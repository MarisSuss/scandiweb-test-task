<?php

namespace Src\GraphQL\Types;

use GraphQL\Type\Definition\ObjectType;
use GraphQL\Type\Definition\Type;

class OrderResponseType extends ObjectType
{
    public function __construct()
    {
        parent::__construct([
            'name' => 'OrderResponse',
            'fields' => [
                'success' => Type::boolean(),
                'orderId' => Type::int()
            ]
        ]);
    }
}