<?php

declare(strict_types=1);

namespace Src\Models;

/**
 * Represents a clothing product.
 */
class ClothesProduct extends Product
{
    /**
     * Category-level identifier for internal logic.
     */
    public function getType(): string
    {
        return 'clothes';
    }
}
