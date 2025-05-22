<?php

declare(strict_types=1);

namespace Src\Models;

/**
 * Represents a single attribute value (e.g., Size M, Color Blue).
 * Nested inside an AttributeSet.
 */
class Attribute
{
    public string $id;
    public string $value;
    public string $displayValue;
}