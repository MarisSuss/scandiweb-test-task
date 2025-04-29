<?php

namespace Src\Models;

class TechProduct extends Product {
    public function getType(): string {
        return 'tech';
    }
}
