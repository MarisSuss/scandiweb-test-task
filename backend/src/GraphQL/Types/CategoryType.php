<?php

declare(strict_types=1);

namespace Src\GraphQL\Types;

use GraphQL\Type\Definition\ObjectType;
use GraphQL\Type\Definition\Type;

class CategoryType extends ObjectType
{
    private static ?self $instance = null;

    // Defines the structure of the Category GraphQL type
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

    // Returns a singleton instance of this type
    public static function getInstance(): self
    {
        if (self::$instance === null) {
            self::$instance = new self();
        }

        return self::$instance;
    }
}