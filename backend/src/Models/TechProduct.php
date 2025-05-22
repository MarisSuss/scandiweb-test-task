<?php

declare(strict_types=1);

namespace Src\Models;

/**
 * Represents a tech product.
 */
class TechProduct extends Product
{
    /**
     * Category-level identifier for internal logic.
     */
    public function getType(): string
    {
        return 'tech';
    }
}
