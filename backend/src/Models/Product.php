<?php

declare(strict_types=1);

namespace Src\Models;

use Src\Models\Category;

/**
 * Abstract base class for all product types.
 */
abstract class Product
{
    public int $id;
    public string $sku;
    public string $name;
    public float $price;
    public string $brand;
    public array $gallery = [];
    public string $description;
    public bool $in_stock;

    /** @var AttributeSet[] */
    public array $attributes = [];

    public Category $category;

    /**
     * Returns the internal type of the product.
     */
    abstract public function getType(): string;
}