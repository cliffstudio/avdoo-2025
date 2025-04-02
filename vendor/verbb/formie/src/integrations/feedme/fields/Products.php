<?php
namespace verbb\formie\integrations\feedme\fields;

use craft\feedme\fields\CommerceProducts as FeedMeProducts;
use verbb\formie\fields\Products as ProductsField;

class Products extends FeedMeProducts
{
    // Traits
    // =========================================================================

    use BaseFieldTrait;


    // Properties
    // =========================================================================

    public static string $class = ProductsField::class;
    public static string $name = 'Products';


    // Templates
    // =========================================================================

    public function getMappingTemplate(): string
    {
        return 'formie/integrations/feedme/fields/products';
    }

}
