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
                'products' => [
                    'type' => Type::listOf(ProductType::getInstance()),
                    'resolve' => function () {
                        $pdo = (new \Src\Database\Connection())->connect();
        $stmt = $pdo->query("SELECT * FROM products");
        $products = [];
        while ($row = $stmt->fetch(\PDO::FETCH_ASSOC)) {
            $products[] = \Src\Models\ProductFactory::create($row);
        }
        return $products;
                    },
                ],
            ],
        ]);
    }

    public static function getInstance(): self
    {
        static $instance = null;
        if ($instance === null) {
            $instance = new self();
        }
        return $instance;
    }
}