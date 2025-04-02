<?php
namespace verbb\formie\console\controllers;

use verbb\formie\elements\Form;

use Craft;
use craft\console\Controller;
use craft\helpers\Db;
use craft\helpers\Console;

use Throwable;

use yii\console\ExitCode;

/**
 * Manages Formie Forms.
 */
class FormsController extends Controller
{
    // Properties
    // =========================================================================

    public ?string $formId = null;
    public ?string $formHandle = null;


    // Public Methods
    // =========================================================================

    public function options($actionID): array
    {
        $options = parent::options($actionID);

        if ($actionID === 'delete') {
            $options[] = 'formId';
            $options[] = 'formHandle';
        }

        return $options;
    }

    /**
     * Delete Formie forms.
     */
    public function actionDelete(): int
    {
        $formIds = null;

        if ($this->formId !== null) {
            $formIds = explode(',', $this->formId);
        }

        if ($this->formHandle !== null) {
            $formHandle = explode(',', $this->formHandle);

            $formIds = Form::find()->handle($formHandle)->ids();
        }

        if (!$this->formId && !$this->formHandle) {
            $this->stderr('You must provide either a --form-id or --form-handle option.' . PHP_EOL, Console::FG_RED);

            return ExitCode::UNSPECIFIED_ERROR;
        }

        if (!$formIds) {
            $this->stderr('Unable to find any matching forms.' . PHP_EOL, Console::FG_RED);

            return ExitCode::UNSPECIFIED_ERROR;
        }

        foreach ($formIds as $formId) {
            $query = Form::find()->id($formId);

            $count = (int)$query->count();

            if ($count === 0) {
                $this->stdout('No forms exist for that criteria.' . PHP_EOL, Console::FG_YELLOW);

                continue;
            }

            $elementsText = $count === 1 ? 'form' : 'forms';
            $this->stdout("Deleting {$count} {$elementsText} for form #{$formId} ..." . PHP_EOL, Console::FG_YELLOW);

            $elementsService = Craft::$app->getElements();

            foreach (Db::each($query) as $element) {
                $elementsService->deleteElement($element);

                $this->stdout("Deleted form #{$element->id} ..." . PHP_EOL, Console::FG_GREEN);
            }
        }

        return ExitCode::OK;
    }
}
