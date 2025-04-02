<?php
namespace verbb\formie\fields;

use verbb\formie\elements\Form;
use verbb\formie\elements\db\FormQuery;
use verbb\formie\gql\arguments\FormArguments;
use verbb\formie\gql\interfaces\FormInterface;
use verbb\formie\gql\resolvers\FormResolver;

use Craft;
use craft\elements\ElementCollection;
use craft\fields\BaseRelationField;

use GraphQL\Type\Definition\Type;

class Forms extends BaseRelationField
{
    // Static Methods
    // =========================================================================

    public static function displayName(): string
    {
        return Craft::t('formie', 'Forms (Formie)');
    }

    public static function icon(): string
    {
        return '@verbb/formie/icon-mask.svg';
    }

    public static function elementType(): string
    {
        return Form::class;
    }

    public static function defaultSelectionLabel(): string
    {
        return Craft::t('formie', 'Add a form');
    }

    public static function phpType(): string
    {
        return sprintf('\\%s|\\%s<\\%s>', FormQuery::class, ElementCollection::class, Form::class);
    }


    // Public Methods
    // =========================================================================

    public function getContentGqlType(): array|Type
    {
        return [
            'name' => $this->handle,
            'type' => Type::listOf(FormInterface::getType()),
            'args' => FormArguments::getArguments(),
            'resolve' => FormResolver::class . '::resolve',
        ];
    }
}
