<?php

namespace Src\Models;

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
        $product->name = $row['name'];
        $product->inStock = (bool) $row['in_stock'];
        $product->gallery = json_decode($row['gallery'] ?? '[]', true);
        $product->description = $row['description'] ?? '';
        $product->brand = $row['brand'] ?? '';
        $product->prices = json_decode($row['prices'] ?? '[]', true);

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

        return $product;
    }
}
