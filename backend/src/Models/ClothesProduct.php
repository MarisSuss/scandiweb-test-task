<?php

namespace Src\Models;

class ClothesProduct extends Product {
    public function getType(): string {
        return 'clothes';
    }
}
