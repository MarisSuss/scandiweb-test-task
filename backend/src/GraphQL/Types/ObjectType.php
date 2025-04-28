<?php

namespace Src\GraphQL\Types;

use GraphQL\Type\Definition\ObjectType;
use GraphQL\Type\Definition\Type;

class CategoryType extends ObjectType
{
    public function __construct()
    {
        parent::__construct([
            'name' => 'Category',
            'fields' => function () {
                return [
                    'id' => Type::int(),
                    'name' => Type::string(),
                ];
            }
        ]);
    }
}