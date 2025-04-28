<?php
require __DIR__ . '/../vendor/autoload.php';
require_once __DIR__ . '/Database/Connection.php';

use Src\Database\Connection;

$db = new Connection();
$pdo = $db->connect();

echo "Starting migration and seeding...\n";

// --- 1. Create tables if not exist ---

$pdo->exec("CREATE TABLE IF NOT EXISTS categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) UNIQUE NOT NULL
);");

echo "Checked/Created table: categories\n";

$pdo->exec("CREATE TABLE IF NOT EXISTS products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    sku VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    brand VARCHAR(255) DEFAULT NULL,
    gallery LONGTEXT DEFAULT NULL,
    attributes LONGTEXT DEFAULT NULL,
    description TEXT DEFAULT NULL,
    in_stock BOOLEAN DEFAULT NULL,
    category_id INT DEFAULT NULL,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL
);");

echo "Checked/Created table: products\n";

// --- 2. Read data.json ---

$data = json_decode(file_get_contents(__DIR__ . '/../data.json'), true);

if (!$data || !isset($data['data']['products'])) {
    die("Failed to read products from data.json\n");
}

// --- 3. Insert categories ---

$categoryNames = [];
foreach ($data['data']['categories'] as $category) {
    $name = $category['name'];
    $stmt = $pdo->prepare("INSERT IGNORE INTO categories (name) VALUES (:name)");
    $stmt->execute([':name' => $name]);
    $categoryNames[$name] = true;
}

echo "Inserted/Checked all categories.\n";

// Create category name => id map
$categoryMap = [];
$stmt = $pdo->query("SELECT id, name FROM categories");
foreach ($stmt as $row) {
    $categoryMap[$row['name']] = $row['id'];
}

// --- 4. Insert products ---

$productInsert = $pdo->prepare("INSERT IGNORE INTO products (
    sku, name, price, brand, gallery, attributes, description, in_stock, category_id
) VALUES (
    :sku, :name, :price, :brand, :gallery, :attributes, :description, :in_stock, :category_id
)");

foreach ($data['data']['products'] as $product) {
    $sku = $product['id'] ?? uniqid();
    $name = $product['name'] ?? 'Unnamed Product';
    $price = $product['prices'][0]['amount'] ?? 0;
    $brand = $product['brand'] ?? null;
    $gallery = isset($product['gallery']) ? json_encode($product['gallery']) : null;
    $attributes = isset($product['attributes']) ? json_encode($product['attributes']) : null;
    $description = strip_tags($product['description'] ?? '');
    $inStock = isset($product['inStock']) ? (int) $product['inStock'] : null;
    $categoryName = $product['category'] ?? null;
    $categoryId = $categoryName && isset($categoryMap[$categoryName]) ? $categoryMap[$categoryName] : null;

    $productInsert->execute([
        ':sku' => $sku,
        ':name' => $name,
        ':price' => $price,
        ':brand' => $brand,
        ':gallery' => $gallery,
        ':attributes' => $attributes,
        ':description' => $description,
        ':in_stock' => $inStock,
        ':category_id' => $categoryId
    ]);
}

echo "Final Migration and Seeding complete!\n";