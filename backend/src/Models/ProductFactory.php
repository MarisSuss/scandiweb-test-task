<?php

namespace Src\Models;

use Src\Models\TechProduct;
use Src\Models\ClothesProduct;
use Src\Models\Category;

class ProductFactory {
    public static function create(array $row): Product {
        $type = $row['category'] ?? 'default';
        $product = match ($type) {
            'tech' => new TechProduct(),
            'clothes' => new ClothesProduct(),
            default => new class extends Product {
                public function getType(): string {
                    return 'generic';
                }
            }
        };

        $product->id = $row['id'];
        $product->sku = $row['sku'] ?? '';
        $product->name = $row['name'];
        $product->price = isset($row['price']) ? (float) $row['price'] : null;
        $product->in_stock = (bool) $row['in_stock'];
        $product->gallery = json_decode($row['gallery'] ?? '[]', true);
        $product->description = $row['description'] ?? '';
        $product->brand = $row['brand'] ?? '';

        $attributeSets = json_decode($row['attributes'] ?? '[]', true);
        foreach ($attributeSets as $setData) {
            $set = new AttributeSet();
            $set->id = $setData['id'];
            $set->name = $setData['name'];
            $set->type = $setData['type'];
            foreach ($setData['items'] as $itemData) {
                $item = new Attribute();
                $item->id = $itemData['id'];
                $item->value = $itemData['value'];
                $item->displayValue = $itemData['displayValue'];
                $set->items[] = $item;
            }
            $product->attributes[] = $set;
        }

        $category = new Category();
        $category->id = $row['category_id'];
        $category->name = $row['category_name'];
        $product->category = $category;

        return $product;
    }
}