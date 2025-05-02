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
                        $stmt = $pdo->prepare("SELECT * FROM products WHERE sku = :sku");
                        $stmt->execute([':sku' => $args['sku']]);
                        $row = $stmt->fetch(\PDO::FETCH_ASSOC);
                        return $row ? \Src\Models\ProductFactory::create($row) : null;
                    }
                ],
                'products' => [
                    'type' => Type::listOf(ProductType::getInstance()),
                    'args' => [
                        'category' => Type::string()
                    ],
                    'resolve' => function ($root, $args) {
                        $pdo = (new \Src\Database\Connection())->connect();

                        if (isset($args['category'])) {
                            $stmt = $pdo->prepare("
                                SELECT p.* FROM products p
                                JOIN categories c ON p.category_id = c.id
                                WHERE c.name = :category
                            ");
                            $stmt->execute([':category' => $args['category']]);
                        } else {
                            $stmt = $pdo->query("SELECT * FROM products");
                        }

                        $products = [];
                        while ($row = $stmt->fetch(\PDO::FETCH_ASSOC)) {
                            $products[] = \Src\Models\ProductFactory::create($row);
                        }

                        return $products;
                    }
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