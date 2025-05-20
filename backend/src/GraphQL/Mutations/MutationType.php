<?php

namespace Src\GraphQL\Mutations;

use GraphQL\Type\Definition\ObjectType;
use GraphQL\Type\Definition\Type;
use Src\Database\Connection;
use Src\GraphQL\Types\ProductType;
use Src\GraphQL\Types\CategoryType;
use Src\GraphQL\Types\OrderResponseType;
use Src\GraphQL\Types\OrderItemInputType;

class MutationType extends ObjectType
{
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
                        'brand' => Type::nonNull(Type::string()),
                        'gallery' => Type::nonNull(Type::listOf(Type::nonNull(Type::string()))),
                        'description' => Type::string(),
                        'category_id' => Type::nonNull(Type::int()),
                        'in_stock' => Type::nonNull(Type::boolean())
                    ],
                    'resolve' => function ($root, $args) {
                        $db = new Connection();
                        $pdo = $db->connect();

                        $stmt = $pdo->prepare("INSERT INTO products (sku, name, price, brand, gallery, description, category_id, in_stock)
                            VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
                        $stmt->execute([
                            $args['sku'],
                            $args['name'],
                            $args['price'],
                            $args['brand'],
                            json_encode($args['gallery']),
                            $args['description'] ?? '',
                            $args['category_id'],
                            $args['in_stock'] ? 1 : 0
                        ]);

                        $args['id'] = $pdo->lastInsertId();
                        return $args;
                    }
                ],
                'updateProduct' => [
                    'type' => ProductType::getInstance(),
                    'args' => [
                        'id' => Type::nonNull(Type::int()),
                        'name' => Type::string(),
                        'price' => Type::float()
                    ],
                    'resolve' => function ($root, $args) {
                        $db = new Connection();
                        $pdo = $db->connect();

                        $fields = [];
                        $values = [];
                        if (isset($args['name'])) {
                            $fields[] = 'name = ?';
                            $values[] = $args['name'];
                        }
                        if (isset($args['price'])) {
                            $fields[] = 'price = ?';
                            $values[] = $args['price'];
                        }

                        $values[] = $args['id'];

                        $sql = "UPDATE products SET " . implode(', ', $fields) . " WHERE id = ?";
                        $stmt = $pdo->prepare($sql);
                        $stmt->execute($values);

                        return $args;
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

                        return $args['ids'];
                    }
                ],
                'addOrder' => [
                    'type' => new OrderResponseType(),
                    'args' => [
                        'input' => [
                            'type' => Type::nonNull(Type::listOf(Type::nonNull(new OrderItemInputType())))
                        ]
                    ],
                    'resolve' => function ($root, $args) {
                        $db = new Connection();
                        $pdo = $db->connect();

                        $stmt = $pdo->prepare("INSERT INTO orders () VALUES ()");
                        $stmt->execute();
                        $orderId = $pdo->lastInsertId();

                        $stmtItem = $pdo->prepare("INSERT INTO order_items (order_id, product_id, quantity, selected_attributes) VALUES (?, ?, ?, ?)");

                        foreach ($args['input'] as $item) {
                            $stmtItem->execute([
                                $orderId,
                                $item['product_id'],
                                $item['quantity'],
                                $item['selectedAttributes']
                            ]);
                        }

                        return [
                            'success' => true,
                            'orderId' => (int)$orderId
                        ];
                    }
                ]
            ]
        ]);
    }
}