<?php
namespace verbb\formie\gql\types;

use verbb\formie\gql\interfaces\PageSettingsInterface;

use craft\gql\base\ObjectType;

use GraphQL\Type\Definition\ResolveInfo;

class PageSettingsType extends ObjectType
{
    // Public Methods
    // =========================================================================

    public function __construct(array $config)
    {
        $config['interfaces'] = [
            PageSettingsInterface::getType(),
        ];

        parent::__construct($config);
    }

    protected function resolve(mixed $source, array $arguments, mixed $context, ResolveInfo $resolveInfo): mixed
    {
        return $source[$resolveInfo->fieldName];
    }
}
