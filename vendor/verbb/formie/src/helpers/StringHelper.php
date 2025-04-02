<?php
namespace verbb\formie\helpers;

use verbb\formie\Formie;

use Craft;
use craft\helpers\StringHelper as CraftStringHelper;

use voku\helper\AntiXSS;

class StringHelper extends CraftStringHelper
{
    // Static Methods
    // =========================================================================

    public static function toId(mixed $value, bool $allowNull = true): ?int
    {
        if ($allowNull && ($value === null || $value === '')) {
            return null;
        }

        if ($value === null || is_scalar($value)) {
            return (int)$value;
        }

        return null;
    }

    public static function cleanString(string $str): string
    {
        $antiXss = new AntiXSS();
        
        // Allow inline CSS for rich text
        $antiXss->removeEvilAttributes(['style']);

        return $antiXss->xss_clean((string)$str);
    }

    public static function decdec(string $str): string
    {
        $key = Formie::$plugin->getSettings()->getSecurityKey();

        if (strncmp($str, 'base64:', 7) === 0) {
            $str = base64_decode(substr($str, 7));
        }

        if (strncmp($str, 'crypt:', 6) === 0) {
            $str = Craft::$app->getSecurity()->decryptByKey(substr($str, 6), $key);
        }

        return $str;
    }

    public static function encenc(string $str): string
    {
        $key = Formie::$plugin->getSettings()->getSecurityKey();

        return 'base64:' . base64_encode('crypt:' . Craft::$app->getSecurity()->encryptByKey($str, $key));
    }
}