<?php
namespace verbb\formie\controllers;

use verbb\formie\Formie;
use verbb\formie\elements\SentNotification;
use verbb\formie\models\Settings;
use verbb\formie\web\assets\cp\CpAsset;

use Craft;
use craft\mail\Message;
use craft\web\Controller;

use yii\validators\EmailValidator;
use yii\web\ForbiddenHttpException;
use yii\web\HttpException;
use yii\web\NotFoundHttpException;
use yii\web\Response;

class SentNotificationsController extends Controller
{
    // Public Methods
    // =========================================================================

    public function actionIndex(): Response
    {
        $this->getView()->registerAssetBundle(CpAsset::class);

        $this->requirePermission('formie-accessSentNotifications');

        return $this->renderTemplate('formie/sent-notifications/index', []);
    }

    public function actionSettings(): Response
    {
        /* @var Settings $settings */
        $settings = Formie::$plugin->getSettings();

        return $this->renderTemplate('formie/settings/sent-notifications', compact('settings'));
    }

    public function actionEdit(int $sentNotificationId = null, SentNotification $sentNotification = null): Response
    {
        $currentUser = Craft::$app->getUser()->getIdentity();

        $variables = compact('sentNotificationId', 'sentNotification');

        if (!$variables['sentNotification']) {
            if ($variables['sentNotificationId']) {
                $variables['sentNotification'] = SentNotification::find()
                    ->id($variables['sentNotificationId'])
                    ->one();

                if (!$variables['sentNotification']) {
                    throw new HttpException(404);
                }
            } else {
                throw new HttpException(404);
            }
        }

        $variables['title'] = $variables['sentNotification']->title;

        if (!$variables['sentNotification']->canView($currentUser)) {
            throw new ForbiddenHttpException('User is not permitted to perform this action');
        }

        return $this->renderTemplate('formie/sent-notifications/_edit', $variables);
    }

    public function actionGetResendModalContent(): Response
    {
        $this->requireAcceptsJson();

        $request = $this->request;
        $view = $this->getView();

        $sentNotification = SentNotification::find()
            ->id($request->getParam('id'))
            ->one();

        $modalHtml = $view->renderTemplate('formie/sent-notifications/_includes/resend-modal', [
            'sentNotification' => $sentNotification,
        ]);

        return $this->asJson([
            'success' => true,
            'modalHtml' => $modalHtml,
            'headHtml' => $view->getHeadHtml(),
            'footHtml' => $view->getBodyHtml(),
        ]);
    }

    public function actionResend(): Response
    {
        $this->requireAcceptsJson();

        $request = $this->request;
        $currentUser = Craft::$app->getUser()->getIdentity();

        $sentNotification = SentNotification::find()
            ->id($request->getRequiredParam('id'))
            ->one();

        if (!$sentNotification) {
            $error = Craft::t('formie', 'Sent Notification not found.');

            $this->setFailFlash($error);

            return $this->asFailure($error);
        }

        if (!$sentNotification->canResend($currentUser)) {
            throw new ForbiddenHttpException('User is not permitted to perform this action');
        }

        $emails = $request->getRequiredParam('to');

        if (!$emails) {
            $error = Craft::t('formie', 'No recipients provided.');

            $this->setFailFlash($error);

            return $this->asFailure($error);
        }

        $emails = str_replace(';', ',', $emails);
        $emails = preg_split('/[\s,]+/', $emails);
        $emails = array_filter($emails);

        foreach ($emails as $email) {
            $validate = (new EmailValidator())->validate($email);

            if (!(new EmailValidator())->validate($email)) {
                $error = Craft::t('formie', 'Some Recipients are invalid.');

                $this->setFailFlash($error);

                return $this->asFailure($error);
            }
        }

        $newEmail = $this->_prepNewEmail($sentNotification);
        $newEmail->setTo($emails);

        if (!Craft::$app->getMailer()->send($newEmail)) {
            $error = Craft::t('formie', 'Notification email could not be sent.');

            $this->setFailFlash($error);

            return $this->asFailure($error);
        }

        // Log the sent notification - if enabled
        Formie::$plugin->getSentNotifications()->saveSentNotification($sentNotification->submission, $sentNotification->notification, $newEmail);

        $message = Craft::t('formie', 'Notification email was resent successfully.');

        $this->setSuccessFlash($message);

        return $this->asJson([
            'success' => true,
        ]);
    }

    public function actionBulkResend(): Response
    {
        $this->requireAcceptsJson();

        $request = $this->request;
        $currentUser = Craft::$app->getUser()->getIdentity();

        $ids = $request->getRequiredParam('ids');
        $recipientsType = $request->getRequiredParam('recipientsType');

        if (!$ids) {
            $error = Craft::t('formie', 'No Notifications selected.');

            $this->setFailFlash($error);

            return $this->asFailure($error);
        }

        $sentNotifications = SentNotification::find()
            ->id($ids)
            ->all();

        if (!$sentNotifications) {
            $error = Craft::t('formie', 'Sent Notification not found.');

            $this->setFailFlash($error);

            return $this->asFailure($error);
        }

        foreach ($sentNotifications as $sentNotification) {
            if (!$sentNotification->canResend($currentUser)) {
                $error = Craft::t('formie', 'User is not permitted to perform this action.');

                $this->setFailFlash($error);

                return $this->asFailure($error);
            }

            if ($recipientsType === 'original') {
                $emails = $sentNotification->to;
            } else {
                $emails = $request->getRequiredParam('to');

                if (!$emails) {
                    $error = Craft::t('formie', 'No recipients provided.');

                    $this->setFailFlash($error);

                    return $this->asFailure($error);
                }

                $emails = str_replace(';', ',', $emails);
                $emails = preg_split('/[\s,]+/', $emails);
                $emails = array_filter($emails);

                foreach ($emails as $email) {
                    $validate = (new EmailValidator())->validate($email);

                    if (!(new EmailValidator())->validate($email)) {
                        $error = Craft::t('formie', 'Some Recipients are invalid.');

                        $this->setFailFlash($error);

                        return $this->asFailure($error);
                    }
                }
            }

            $newEmail = $this->_prepNewEmail($sentNotification);
            $newEmail->setTo($emails);

            if (!Craft::$app->getMailer()->send($newEmail)) {
                $error = Craft::t('formie', 'Notification email {id} could not be sent.', ['id' => $sentNotification->id]);

                $this->setFailFlash($error);

                return $this->asFailure($error);
            }

            // Log the sent notification - if enabled
            Formie::$plugin->getSentNotifications()->saveSentNotification($sentNotification->submission, $sentNotification->notification, $newEmail);
        }

        $message = Craft::t('formie', '{count} notification emails resent successfully.', ['count' => count($ids)]);

        $this->setSuccessFlash($message);

        return $this->asJson([
            'success' => true,
        ]);
    }

    public function actionDelete(): ?Response
    {
        $this->requirePostRequest();

        $request = $this->request;
        $currentUser = Craft::$app->getUser()->getIdentity();
        $sentNotificationId = $request->getRequiredBodyParam('sentNotificationId');

        $sentNotification = SentNotification::find()
            ->id($sentNotificationId)
            ->one();

        if (!$sentNotification) {
            throw new NotFoundHttpException('Sent Notification not found');
        }

        if (!$sentNotification->canDelete($currentUser)) {
            throw new ForbiddenHttpException('User is not permitted to perform this action');
        }

        if (!Craft::$app->getElements()->deleteElement($sentNotification)) {
            if ($request->getAcceptsJson()) {
                return $this->asJson(['success' => false]);
            }

            $this->setFailFlash(Craft::t('app', 'Couldn’t delete sent notification.'));

            Craft::$app->getUrlManager()->setRouteParams([
                'sentNotification' => $sentNotification,
            ]);

            return null;
        }

        if ($request->getAcceptsJson()) {
            return $this->asJson(['success' => true]);
        }

        $this->setSuccessFlash(Craft::t('app', 'Sent Notification deleted.'));

        return $this->redirectToPostedUrl($sentNotification);
    }


    // Private Methods
    // =========================================================================

    private function _prepNewEmail(SentNotification $sentNotification): Message
    {
        $newEmail = new Message();
        $newEmail->setSubject($sentNotification->subject);
        $newEmail->setFrom([$sentNotification->from => $sentNotification->fromName]);
        $newEmail->setTextBody($sentNotification->body);
        $newEmail->setHtmlBody($sentNotification->htmlBody);

        // Sender may be blank, which is not allowed
        if ($sentNotification->sender) {
            $newEmail->setSender($sentNotification->sender);
        }

        return $newEmail;
    }

}
