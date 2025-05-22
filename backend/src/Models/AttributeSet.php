<?php

declare(strict_types=1);

namespace Src\Models;

/**
 * A set of attributes grouped under a label (e.g., "Size", "Color").
 */
class AttributeSet
{
    public string $id;
    public string $name;
    public string $type;

    /** @var Attribute[] */
    public array $items = [];
}
