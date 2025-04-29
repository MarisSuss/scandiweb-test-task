<?php

namespace Src\GraphQL\Mutations;

use GraphQL\Type\Definition\ObjectType;
use GraphQL\Type\Definition\Type;
use Src\Database\Connection;
use Src\GraphQL\Types\ProductType;

class MutationType extends ObjectType
{
    private static ?self $instance = null;
    public function __construct()
    {
        parent::__construct([
            'name' => 'Mutation',
            'fields' => [
                'addProduct' => [
                    'type' => ProductType::getInstance(),
                    'args' => [
                        'sku' => Type::nonNull(Type::string()),
                        'name' => Type::nonNull(Type::string()),
                        'price' => Type::nonNull(Type::float()),
                        'brand' => Type::string(),
                        'gallery' => Type::listOf(Type::string()),
                        'attributes' => Type::listOf(Type::string()),
                        'description' => Type::string(),
                        'in_stock' => Type::boolean(),
                        'category_id' => Type::int(),
                    ],
                    'resolve' => function ($root, $args) {
                        $db = new Connection();
                        $pdo = $db->connect();

                        $stmt = $pdo->prepare("
                            INSERT INTO products 
                                (sku, name, price, brand, gallery, attributes, description, in_stock, category_id)
                            VALUES 
                                (:sku, :name, :price, :brand, :gallery, :attributes, :description, :in_stock, :category_id)
                        ");

                        $stmt->execute([
                            ':sku' => $args['sku'],
                            ':name' => $args['name'],
                            ':price' => $args['price'],
                            ':brand' => $args['brand'] ?? null,
                            ':gallery' => isset($args['gallery']) ? json_encode($args['gallery']) : null,
                            ':attributes' => isset($args['attributes']) ? json_encode($args['attributes']) : null,
                            ':description' => $args['description'] ?? null,
                            ':in_stock' => isset($args['in_stock']) ? (int) $args['in_stock'] : null,
                            ':category_id' => $args['category_id'] ?? null,
                        ]);

                        $id = $pdo->lastInsertId();
                        return array_merge(['id' => (int)$id], $args);
                    }
                ],
                'deleteProducts' => [
                    'type' => Type::listOf(Type::int()),
                    'args' => [
                        'ids' => Type::nonNull(Type::listOf(Type::nonNull(Type::int())))
                    ],
                    'resolve' => function ($root, $args) {
                        $db = new Connection();
                        $pdo = $db->connect();

                        $inQuery = implode(',', array_fill(0, count($args['ids']), '?'));

                        $stmt = $pdo->prepare("DELETE FROM products WHERE id IN ($inQuery)");
                        $stmt->execute($args['ids']);

                        return $args['ids']; // Return deleted IDs
                    }
                ],
            ]
        ]);
    }

    public static function getInstance(): self
    {
        if (!self::$instance) self::$instance = new self();
        return self::$instance;
    }
}