<?php

declare(strict_types=1);

namespace Src\Models;

/**
 * Represents a product category, e.g., clothes, tech.
 * Attached to each product instance via ProductFactory.
 */
class Category
{
    public int $id;
    public string $name;
}
