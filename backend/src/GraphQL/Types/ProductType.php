<?php

declare(strict_types=1);

namespace Src\GraphQL\Types;

use GraphQL\Type\Definition\ObjectType;
use GraphQL\Type\Definition\Type;

/**
 * GraphQL representation of a product.
 * Connects to attribute sets and all major product fields.
 */
class ProductType extends ObjectType
{
    public static function getInstance(): self
    {
        static $instance = null;

        if ($instance === null) {
            $instance = new self();
        }

        return $instance;
    }

    public function __construct()
    {
        parent::__construct([
            'name' => 'Product',
            'fields' => function () {
                return [
                    'id' => Type::nonNull(Type::id()),
                    'sku' => Type::nonNull(Type::string()),
                    'name' => Type::nonNull(Type::string()),
                    'price' => Type::nonNull(Type::float()),
                    'brand' => Type::nonNull(Type::string()),
                    'gallery' => Type::nonNull(Type::listOf(Type::string())),
                    'in_stock' => Type::nonNull(Type::boolean()),
                    'description' => Type::nonNull(Type::string()),
                    'attributes' => Type::listOf(AttributeSetType::getInstance()),
                ];
            }
        ]);
    }
}