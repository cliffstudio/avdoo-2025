# Field

A Field object represents a form field of a particular type. Each field has its own unique attributes and functionality. Whenever you're dealing with a field in your template, you're actually working with a `Field` object.

## Attributes

Attribute | Description
--- | ---
`id` | ID of the field.
`label` | The label of the field.
`handle` | The handle of the field.
`type` | The type of the field.
`form` | The [Form](docs:developers/form) this field belongs to.
`formId` | The [Form](docs:developers/form) ID for the form this field belongs to.
`rowId` | The [Row](docs:developers/row) ID for the row this field belongs to.
`rowIndex` | The [Row](docs:developers/row) index for the row this field belongs to. This is used for field ordering.
`settings` | A collection of settings for the field. See [Field Settings](#field-settings).

## Methods

Method | Description
--- | ---
`getSvgIcon()` | Returns the contents of an SVG icon used for a field type.
`getSvgIconPath()` | Returns the path to the SVG icon used for a field type.
`getIsNew()` | Denotes whether this field is new.
`hasLabel()` | Whether the field has a label or not. Some fields do not have one.
`getHtmlId()` | Returns a string for the `id` HTML attribute when rendering the field.
`getHtmlDataId()` | Returns a string as a `data-id` HTML attribute with the field handle.
`getHtmlName()` | Returns a string for the `name` HTML attribute when rendering the field.
`getExtraBaseFieldConfig()` | Returns any base-level configuration data for the field.
`getFieldDefaults()` | Returns any defaults for the field, when it's created.
`getContainerAttributes()` | Returns an array of options for container attributes.
`getInputAttributes()` | Returns an array of options for input attributes.
`renderHtmlTag()` | Returns a HtmlTag object for a provided theming key.
`defineHtmlTag()` | Allows fields to define what HtmlTag objects it should use.
`getParentField()` | Returns the parent field, if applicable. Only set for sub-field and nested-field types.
`setParentField()` | Sets the parent field instance, including applicable namespace.
`getFrontEndInputHtml()` | Returns the HTML for a the front-end template for a field.
`getFrontEndInputOptions()` | Returns an object of variables that can be used for front-end fields.
`getEmailHtml()` | Returns the HTML for an email notification for a field.
`afterCreateField()` | A function called after a field has been created in the control panel.


## Field Settings
The settings for a field will differ per-type, but the following are general settings applicable to all fields.

Attribute | Description
--- | ---
`labelPosition` | The position of the field's label.
`instructionsPosition` | The position of the field's instructions.
`cssClasses` | Any CSS classes, applied on the outer container of a field.
`containerAttributes` | A collection of attributes added to the outer container of a field.
`inputAttributes` | A collection of attributes added to the `input` element of a field - where applicable.

### Agree
Setting | Description
--- | ---
`description` | The description for the field. This will be shown next to the checkbox.
`descriptionHtml` | The HTML description for the field.
`checkedValue `| The value of this field when it is checked.
`uncheckedValue` | The value of this field when it is unchecked.
`defaultValue` | The default value for the field when it loads.


### Calculations
Setting | Description
--- | ---
`formula` | The raw formula used in the field, before it's been parsed.

Method | Description
--- | ---
`getFormula()` | Returns the parsed formula, given the current submission's context.


### Categories
Setting | Description
--- | ---
`placeholder` | The option shown initially, when no option is selected.
`source` | Which source do you want to select categories from?
`branchLimit` | Limit the number of selectable category branches.
`rootCategory` | The category to act as the root, if set.
`showStructure` | Whether the structure of categories should be shown.


### Checkboxes
Setting | Description
--- | ---
`options` | Define the available options for users to select from.
`layout` | Select which layout to use for these fields.
`toggleCheckbox` | Whether to add an additional checkbox to toggle all checkboxes in this field by. Either `null`, `top`, `bottom`.
`toggleCheckboxLabel` | The label for the toggle checkbox field.


### Date/Time
Setting | Description
--- | ---
`defaultValue` | Entering a default value will place the value in the field when it loads.
`displayType` | The display layout for this field. Either `calendar`, `dropdowns` or `inputs`.
`dateFormat` | The chosen format for the date.
`timeFormat` | The chosen format for the time.
`useDatePicker` | Whether this field should use the Flatpickr datepicker.
`datePickerOptions` | A collection of options for the Flatpickr datepicker.
`minDate` | The minimum allowed date.
`maxDate` | The maximum allowed date.


### Dropdown
Setting | Description
--- | ---
`multiple` | Whether this field should allow multiple options to be selected.
`options` | Define the available options for users to select from.


### Email Address
Setting | Description
--- | ---
`placeholder` | The text that will be shown if the field doesn’t have a value.
`defaultValue` | Entering a default value will place the value in the field when it loads.
`validateDomain` | Whether to validate the domain when the value is saved.
`blockedDomains` | A list of domains to block values from.
`uniqueValue` | Whether to the value of this field should be unique across all submissions for the form.


### Entries
Setting | Description
--- | ---
`placeholder` | The option shown initially, when no option is selected.
`sources` | Which sources do you want to select entries from?
`limit` | Limit the number of selectable entries.


### File Upload
Setting | Description
--- | ---
`uploadLocationSource` | The volume for files to be uploaded into.
`uploadLocationSubpath` | The sub-path for the files to be uploaded into.
`limitFiles` | Limit the number of files a user can upload.
`sizeLimit` | Limit the size of the files a user can upload.
`allowedKinds` | A collection of allowed mime-types the user can upload.


### Heading
Setting | Description
--- | ---
`headingSize` | Choose the size for the heading.


### Hidden
Setting | Description
--- | ---
`defaultOption` | The selected option for the preset default value chosen.
`defaultValue` | Entering a default value will place the value in the field when it loads. This will be dependant on the value chosen for the `defaultOption`.
`queryParameter` | If `query string` is selected for the `defaultOption`, this will contain the query string parameter to look up.
`cookieName` | If `cookie` is selected for the `defaultOption`, this will contain the cookie name to look up.


### Html
Setting | Description
--- | ---
`htmlContent` | Enter HTML content to be rendered for this field.


### Multi-Line Text
Setting | Description
--- | ---
`placeholder` | The text that will be shown if the field doesn’t have a value.
`defaultValue` | Entering a default value will place the value in the field when it loads.
`limit` | Whether to limit the content of this field.
`minType`| The field’s minimum text type. Either `characters` or `words`.
`min`| The field’s minimum number of characters/words to limit, based on `minType`.
`maxType`| The field’s maximum text type. Either `characters` or `words`.
`max`| The field’s maximum number of characters/words, based on `maxType`.
`useRichText` | Whether the front-end of the field should use a Rich Text editor. This is powered by [Pell](https://github.com/jaredreich/pell).
`richTextButtons` | An array of available buttons the Rich Text field should use. Consult the [Pell](https://github.com/jaredreich/pell) docs for these options.


### Name
Setting | Description
--- | ---
`useMultipleFields` | Whether this field should use multiple fields for users to enter their details.


### Number
Setting | Description
--- | ---
`placeholder` | The text that will be shown if the field doesn’t have a value.
`defaultValue` | Entering a default value will place the value in the field when it loads.
`limit` | Whether to limit the numbers for this field.
`min` | The minimum number that can be entered for this field.
`max` | The maximum number that can be entered for this field.
`decimals` | Set the number of decimal points to format the field value.


### Payment
This field's settings will differ depending on the [Payment Integration](docs:integrations/payments) chosen.

Setting | Description
--- | ---
`paymentIntegration` | The handle of the [Payment Integration](docs:integrations/payments) chosen.
`paymentIntegrationType` | The class of the [Payment Integration](docs:integrations/payments) chosen.
`providerSettings` | A collection of settings for the payment provider to use.

Method | Description
--- | ---
`getPaymentIntegration()` | Returns the [Payment Integration](docs:integrations/payments) for the field.
`getPaymentHtml()` | Returns the HTML for the front-end field.
`getFrontEndJsModules()` | Returns the JavaScript modules for the front-end field.


### Phone
Setting | Description
--- | ---
`countryAllowed` | A collection of allowed countries.
`countryDefaultValue` | The default value for the Country sub-field.
`countryEnabled` | Whether the Country sub-field is enabled in the control panel.


### Products
Setting | Description
--- | ---
`placeholder` | The option shown initially, when no option is selected.
`sources` | Which sources do you want to select products from?
`limit` | Limit the number of selectable products.


### Radio
Setting | Description
--- | ---
`options` | Define the available options for users to select from.
`layout` | Select which layout to use for these fields. Either `vertical` or `horizontal`,


### Recipients
Setting | Description
--- | ---
`displayType` | What sort of field to show on the front-end for users. Either `hidden`, `dropdown`, `checkboxes` or `radio`.
`options` | Define the available options for users to select from.


### Repeater
Setting | Description
--- | ---
`addLabel` | The label for the button that adds another instance.
`minRows` | The minimum required number of instances of this repeater's fields that must be completed.
`maxRows` | The maximum required number of instances of this repeater's fields that must be completed.


### Section
Setting | Description
--- | ---
`border` | Add a border to this section.
`borderWidth` | Set the border width (in pixels).
`borderColor` | Set the border color.


### Signature
Setting | Description
--- | ---
`backgroundColor` | Set the background color.
`penColor` | Set the pen color.
`penWeight` | Set the line thickness (weight) for the pen.


### Single-Line Text
Setting | Description
--- | ---
`placeholder` | The text that will be shown if the field doesn’t have a value.
`defaultValue` | Entering a default value will place the value in the field when it loads.
`limit` | Whether to limit the content of this field.
`minType`| The field’s minimum text type. Either `characters` or `words`.
`min`| The field’s minimum number of characters/words to limit, based on `minType`.
`maxType`| The field’s maximum text type. Either `characters` or `words`.
`max`| The field’s maximum number of characters/words, based on `maxType`.


### Table
Setting | Description
--- | ---
`columns` | Define the columns your table should have.
`defaults` | Define the default values for the field.
`addRowLabel` | The label for the button that adds another row.
`static` | Whether this field should disallow adding more rows, showing only the default rows.
`minRows` | The minimum required number of rows in this table that must be completed.
`maxRows` | The maximum required number of rows in this table that must be completed.


### Tags
Setting | Description
--- | ---
`placeholder` | The option shown initially, when no option is selected.
`source` | Which source do you want to select tags from?


### Users
Setting | Description
--- | ---
`placeholder` | The option shown initially, when no option is selected.
`sources` | Which sources do you want to select users from?
`limit` | Limit the number of selectable users.


### Variants
Setting | Description
--- | ---
`placeholder` | The option shown initially, when no option is selected.
`source `| Which source do you want to select variants from?
`limit` | Limit the number of selectable variants.

## Custom Validation
You can add custom validation to field, to handle all manner of scenarios. To do this, you'll need to create a custom module to contain PHP code for the validation logic.

:::tip
Make sure you’re comfortable [creating a plugin or module for Craft CMS](https://craftcms.com/docs/3.x/extend/). Take a look at this [Knowledge Base](https://craftcms.com/knowledge-base/custom-module-events) article for a complete example.
:::

If you write your own plugin or module, you’ll want to use its `init()` method to subscribe to an event on the `Submission` object to add your validation rules. Your event listener can add additional [validation rules](https://www.yiiframework.com/doc/guide/2.0/en/input-validation#declaring-rules) for fields.

For example, let's say we have a field with a handle `emailAddress` which we'd like required. We could do this with the following.

```php
use verbb\formie\elements\Submission;
use verbb\formie\events\SubmissionRulesEvent;
use yii\base\Event;

Event::on(Submission::class, Submission::EVENT_DEFINE_RULES, function(SubmissionRulesEvent $event) {
    $event->rules[] = [['field:emailAddress'], 'required'];
});
```

Or, maybe we only want a field required when another field is a certain value.

```php
Event::on(Submission::class, Submission::EVENT_DEFINE_RULES, function(SubmissionRulesEvent $event) {
    $event->rules[] = [['field:emailAddress'], 'required', 'when' => function($model) {
        return $model->subscribeMe;
    }];
});
```

Here, we check if a field with handle `subscribeMe` is truthy, and if so make the `emailAddress` field required.

Another example could be limiting a field to be numeric, and a maximum length.

```php
Event::on(Submission::class, Submission::EVENT_DEFINE_RULES, function(SubmissionRulesEvent $event) {
    $event->rules[] = [['field:accountNumber'], 'number', 'integerOnly' => true, 'max' => 9];
});
```

You can also customise the validation message with number validation when using min/max with `tooSmall` and `tooBig`.

**However**, the above rules are applied to _every_ submission, which will throw an error if you set a rule for a field that doesn't exist on the form for the submission you're creating. The above example assumes you have a field with the handle `emailAddress` for every form, which may not always be the case, especially if you have multiple forms.

Instead, you'll want to add a conditional check what form you're creating a submission on.

```php
Event::on(Submission::class, Submission::EVENT_DEFINE_RULES, function(SubmissionRulesEvent $event) {
    $form = $event->submission->getForm();

    // Only apply this custom validation for the form with handle `contactForm`
    if ($form->handle === 'contactForm') {
        $event->rules[] = [['field:emailAddress'], 'required'];
    }
});
```

If you have a lot of forms, or would rather not conditionally check _every_ form for your site, you can loop through the available fields for the submission, to add a check whether the field exists. This can be useful if you want to enforce a validation for all email fields across your site, but not every form has an `emailAddress` field.

```php
Event::on(Submission::class, Submission::EVENT_DEFINE_RULES, function(SubmissionRulesEvent $event) {
    if ($fieldLayout = $event->submission->getFieldLayout()) {
        foreach ($fieldLayout->getCustomFields() as $field) {
            // Check against the handle of the field
            if ($field->handle === 'emailAddress') {
                $event->rules[] = [['field:emailAddress'], 'required'];
            }

            // Or, for a more global-check - against the type of the field
            if ($field instanceof \verbb\formie\fields\Email) {
                $event->rules[] = [['field:emailAddress'], 'required'];
            }
        }
    }
});
```
 
