<?php

namespace Src\GraphQL\Queries;

use GraphQL\Type\Definition\ObjectType;
use GraphQL\Type\Definition\Type;
use Src\GraphQL\Types\ProductType;
use Src\GraphQL\Types\CategoryType;
use Src\Database\Connection;
use PDO;

class QueryType extends ObjectType
{
    public function __construct()
    {
        parent::__construct([
            'name' => 'Query',
            'fields' => [
                'categories' => [
                    'type' => Type::listOf(CategoryType::getInstance()),
                    'resolve' => function () {
                        $db = new Connection();
                        $pdo = $db->connect();
                        $stmt = $pdo->query("SELECT id, name FROM categories");
                        return $stmt->fetchAll(PDO::FETCH_ASSOC);
                    }
                ],
                'product' => [
                    'type' => ProductType::getInstance(),
                    'args' => [
                        'sku' => Type::nonNull(Type::string())
                    ],
                    'resolve' => function ($root, $args) {
                        $pdo = (new \Src\Database\Connection())->connect();
                        $stmt = $pdo->prepare("
                            SELECT p.*, c.id AS category_id, c.name AS category
                            FROM products p
                            JOIN categories c ON p.category_id = c.id
                            WHERE p.sku = :sku
                        ");
                        $stmt->execute([':sku' => $args['sku']]);
                        $row = $stmt->fetch(PDO::FETCH_ASSOC);

                        if (!$row) {
                            return null;
                        }

                        return \Src\Models\ProductFactory::create($row);
                    }
                ],
                'products' => [
                    'type' => Type::listOf(ProductType::getInstance()),
                    'args' => [
                        'category' => Type::string()
                    ],
                    'resolve' => function ($root, $args) {
                        $pdo = (new \Src\Database\Connection())->connect();

                        if (!isset($args['category']) || strtolower($args['category']) === 'all') {
                            $stmt = $pdo->query("
                                SELECT p.*, c.id AS category_id, c.name AS category
                                FROM products p
                                JOIN categories c ON p.category_id = c.id
                            ");
                        } else {
                            $stmt = $pdo->prepare("
                                SELECT p.*, c.id AS category_id, c.name AS category
                                FROM products p
                                JOIN categories c ON p.category_id = c.id
                                WHERE LOWER(c.name) = :category
                            ");
                            $stmt->execute([':category' => strtolower($args['category'])]);
                        }

                        $products = [];
                        while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
                            $products[] = \Src\Models\ProductFactory::create($row);
                        }

                        return $products;
                    }
                ]
            ]
        ]);
    }
}