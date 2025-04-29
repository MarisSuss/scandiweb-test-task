<?php

namespace Src\Models;

class AttributeSet {
    public string $id;
    public string $name;
    public string $type;
    /** @var Attribute[] */
    public array $items = [];
}
