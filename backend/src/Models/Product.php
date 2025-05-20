<?php

namespace Src\Models;

use Src\Models\Category;

class Product {
    public int $id;
    public string $sku;
    public string $name;
    public float $price;
    public string $brand;
    public array $gallery = [];
    public string $description;
    public bool $in_stock;
    public array $attributes = [];

    public Category $category;

    public function getType(): string {
        return 'base';
    }
}
