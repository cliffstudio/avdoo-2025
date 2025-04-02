<?php
namespace verbb\formie\integrations\feedme\fields;

use craft\feedme\fields\Users as FeedMeUsers;
use verbb\formie\fields\Users as UsersField;

class Users extends FeedMeUsers
{
    // Traits
    // =========================================================================

    use BaseFieldTrait;


    // Properties
    // =========================================================================

    public static string $class = UsersField::class;
    public static string $name = 'Users';


    // Templates
    // =========================================================================

    public function getMappingTemplate(): string
    {
        return 'formie/integrations/feedme/fields/users';
    }

}
