<?php

namespace Src\GraphQL\Queries;

use GraphQL\Type\Definition\ObjectType;
use GraphQL\Type\Definition\Type;
use Src\GraphQL\Types\ProductType;
use Src\Models\Product;

class QueryType extends ObjectType
{
    public function __construct()
    {
        parent::__construct([
            'name' => 'Query',
            'fields' => [
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