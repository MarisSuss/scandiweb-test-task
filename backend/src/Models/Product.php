<?php

namespace Src\Models;

use Src\Database\Connection;
use PDO;

class Product
{
    public static function getAllProducts()
    {
        $pdo = (new Connection())->connect();

        $stmt = $pdo->query("
            SELECT p.*, c.id as category_id, c.name as category_name
            FROM products p
            LEFT JOIN categories c ON p.category_id = c.id
        ");

        $products = [];

        while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
            $row['attributes'] = json_decode($row['attributes'] ?? '[]', true);
            $row['gallery'] = json_decode($row['gallery'] ?? '[]', true);
            $row['category'] = [
                'id' => $row['category_id'],
                'name' => $row['category_name'],
            ];
            $products[] = $row;
        }

        return $products;
    }
}