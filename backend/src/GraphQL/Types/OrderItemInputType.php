<?php

namespace Src\GraphQL\Types;

use GraphQL\Type\Definition\InputObjectType;
use GraphQL\Type\Definition\Type;

class OrderItemInputType extends InputObjectType
{
    public function __construct()
    {
        parent::__construct([
            'name' => 'OrderItemInput',
            'fields' => [
                'product_id' => Type::nonNull(Type::int()),
                'quantity' => Type::nonNull(Type::int()),
                'selectedAttributes' => Type::nonNull(Type::string())
            ]
        ]);
    }
}