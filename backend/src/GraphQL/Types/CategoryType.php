<?php

namespace Src\GraphQL\Types;

use GraphQL\Type\Definition\ObjectType;
use GraphQL\Type\Definition\Type;

class CategoryType extends ObjectType
{
    private static ?self $instance = null;

    public function __construct()
    {
        parent::__construct([
            'name' => 'Category',
            'fields' => [
                'id' => Type::int(),
                'name' => Type::string(),
            ],
        ]);
    }

    public static function getInstance(): self
    {
        if (self::$instance === null) {
            self::$instance = new self();
        }
        return self::$instance;
    }
}
