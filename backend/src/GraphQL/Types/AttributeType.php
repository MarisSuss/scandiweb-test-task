<?php

declare(strict_types=1);

namespace Src\GraphQL\Types;

use GraphQL\Type\Definition\ObjectType;
use GraphQL\Type\Definition\Type;

/**
 * GraphQL representation of a single attribute value (e.g., 'M', 'Red').
 */
class AttributeType extends ObjectType
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
            'name' => 'Attribute',
            'fields' => [
                'id' => Type::nonNull(Type::string()),
                'value' => Type::nonNull(Type::string()),
                'displayValue' => Type::nonNull(Type::string()),
            ],
        ]);
    }
}