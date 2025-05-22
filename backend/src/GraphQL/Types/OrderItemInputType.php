<?php

declare(strict_types=1);

namespace Src\GraphQL\Types;

use GraphQL\Type\Definition\InputObjectType;
use GraphQL\Type\Definition\Type;

class OrderItemInputType extends InputObjectType
{
    // Defines the shape of a single item in the "addOrder" input list
    public function __construct()
    {
        parent::__construct([
            'name' => 'OrderItemInput',
            'fields' => [
                'product_id' => Type::nonNull(Type::int()),
                'quantity' => Type::nonNull(Type::int()),
                'selectedAttributes' => Type::nonNull(Type::string()),
            ],
        ]);
    }
}