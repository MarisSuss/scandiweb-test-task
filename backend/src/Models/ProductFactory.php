<?php

declare(strict_types=1);

namespace Src\Models;

/**
 * Responsible for instantiating the correct Product subclass
 * based on category name from database row.
 */
class ProductFactory
{
    /**
     * Create a Product object (polymorphic) from a raw DB row.
     *
     * @param array $row The database row containing product data.
     * @return Product
     */
    public static function create(array $row): Product
    {
        $type = strtolower($row['category'] ?? 'default');

        $product = match ($type) {
            'tech' => new TechProduct(),
            'clothes' => new ClothesProduct(),
            default => new class extends Product {
                public function getType(): string
                {
                    return 'generic';
                }
            }
        };

        $product->id = (int) $row['id'];
        $product->sku = $row['sku'] ?? '';
        $product->name = $row['name'];
        $product->price = isset($row['price']) ? (float) $row['price'] : 0.0;
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
        $category->id = (int) $row['category_id'];
        $category->name = $row['category'];
        $product->category = $category;

        return $product;
    }
}