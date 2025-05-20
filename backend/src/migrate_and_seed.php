<?php
require __DIR__ . '/../vendor/autoload.php';

use Src\Database\Connection;

$dotenv = Dotenv\Dotenv::createImmutable(__DIR__ . '/../src');
$dotenv->load();

$db = new Connection();
$pdo = $db->connect();

echo "Starting fresh migration and seeding...\n";

// --- DROP TABLES ---
$pdo->exec("SET FOREIGN_KEY_CHECKS = 0;");
$pdo->exec("DROP TABLE IF EXISTS products;");
$pdo->exec("DROP TABLE IF EXISTS categories;");
$pdo->exec("SET FOREIGN_KEY_CHECKS = 1;");
echo "Dropped existing tables.\n";

// --- CREATE TABLES ---
$pdo->exec("CREATE TABLE categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) UNIQUE NOT NULL
);");

echo "Created table: categories\n";

$pdo->exec("CREATE TABLE products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    sku VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    brand VARCHAR(255) DEFAULT NULL,
    gallery TEXT DEFAULT NULL,
    attributes TEXT DEFAULT NULL,
    description TEXT DEFAULT NULL,
    in_stock TINYINT(1) DEFAULT 0,
    category_id INT DEFAULT NULL,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL
);");

echo "Created table: products\n";

// --- READ JSON DATA ---
$data = json_decode(file_get_contents(__DIR__ . '/../data.json'), true);

if (!$data || !isset($data['data']['products'])) {
    die("Failed to read products from data.json\n");
}

// --- INSERT CATEGORIES ---
$categoryNames = [];
foreach ($data['data']['categories'] as $category) {
    $name = $category['name'];
    $stmt = $pdo->prepare("INSERT INTO categories (name) VALUES (:name)");
    $stmt->execute([':name' => $name]);
    $categoryNames[$name] = true;
}

echo "Inserted categories.\n";

// Build name-to-ID map
$categoryMap = [];
$stmt = $pdo->query("SELECT id, name FROM categories");
foreach ($stmt as $row) {
    $categoryMap[$row['name']] = $row['id'];
}

// --- INSERT PRODUCTS ---
$productInsert = $pdo->prepare("INSERT INTO products (
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
    $attributes = isset($product['attributes']) && is_array($product['attributes'])
        ? json_encode($product['attributes']) : json_encode([]);
    $description = strip_tags($product['description'] ?? '');
    $inStock = isset($product['inStock']) ? (int) $product['inStock'] : 0;
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

echo "Inserted products.\n";

// Create orders table
$pdo->exec("CREATE TABLE IF NOT EXISTS orders (
    id INT AUTO_INCREMENT PRIMARY KEY
)");

// Create order_items table
$pdo->exec("CREATE TABLE IF NOT EXISTS order_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT,
    product_id INT,
    quantity INT,
    selected_attributes TEXT,
    FOREIGN KEY (order_id) REFERENCES orders(id)
)");

echo "Order and order items table created.\n";
echo "Migration and seeding complete.\n";