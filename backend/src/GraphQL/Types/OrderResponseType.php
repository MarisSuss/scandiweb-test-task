<?php

declare(strict_types=1);

namespace Src\GraphQL\Types;

use GraphQL\Type\Definition\ObjectType;
use GraphQL\Type\Definition\Type;

class OrderResponseType extends ObjectType
{
    // Defines the shape of the response from the "addOrder" mutation
    public function __construct()
    {
        parent::__construct([
            'name' => 'OrderResponse',
            'fields' => [
                'success' => Type::boolean(),
                'orderId' => Type::int(),
            ],
        ]);
    }
}