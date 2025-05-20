<?php

namespace Src\Models;

class OrderItem {
    public int $product_id;
    public int $quantity;
    public array $selectedAttributes;
}