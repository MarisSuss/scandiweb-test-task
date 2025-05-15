<?php

namespace Src\Models;

abstract class Product {
    public string $id;
    public string $name;
    public bool $inStock;
    public array $gallery;
    public string $description;
    public string $brand;
    public float $price;
    /** @var AttributeSet[] */
    public array $attributes = [];

    abstract public function getType(): string;
}
