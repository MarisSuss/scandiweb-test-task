<?php

namespace Src\GraphQL\Types;

use GraphQL\Type\Definition\ObjectType;
use GraphQL\Type\Definition\Type;

class ProductType extends ObjectType
{
    public function __construct()
    {
        parent::__construct([
            'name' => 'Product',
            'fields' => function () {
                return [
                    'id' => Type::int(),
                    'sku' => Type::string(),
                    'name' => Type::string(),
                    'price' => Type::float(),
                    'brand' => Type::string(),
                    'gallery' => Type::listOf(Type::string()),
                    'attributes' => Type::listOf(Type::string()),
                    'description' => Type::string(),
                    'in_stock' => Type::boolean(),
                    'category_id' => Type::int(),
                ];
            }
        ]);
    }

    public static function getInstance()
    {
        return new self();
    }
}
