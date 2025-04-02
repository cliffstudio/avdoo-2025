<?php
namespace verbb\formie\gql\types\input;

use craft\gql\GqlEntityRegistry;

use GraphQL\Type\Definition\InputObjectType;
use GraphQL\Type\Definition\Type;

class CaptchaInputType extends InputObjectType
{
    public static function getType(): mixed
    {
        $typeName = 'FormieCaptchaInput';

        if ($inputType = GqlEntityRegistry::getEntity($typeName)) {
            return $inputType;
        }

        $inputType = GqlEntityRegistry::createEntity($typeName, new InputObjectType([
            'name' => $typeName,
            'fields' => function() {
                return [
                    'name' => [
                        'name' => 'name',
                        'type' => Type::string(),
                    ],
                    'value' => [
                        'name' => 'value',
                        'type' => Type::string(),
                    ],
                ];
            },
        ]));

        return $inputType;
    }
}
