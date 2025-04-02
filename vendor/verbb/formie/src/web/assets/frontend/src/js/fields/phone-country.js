import { t, eventKey } from '../utils/utils';
import intlTelInput from 'intl-tel-input/intlTelInputWithUtils';

export class FormiePhoneCountry {
    constructor(settings = {}) {
        this.$form = settings.$form;
        this.form = this.$form.form;
        this.$field = settings.$field.querySelector('input[type="tel"]');
        this.$countryInput = settings.$field.querySelector('[data-country]');

        this.countryDefaultValue = settings.countryDefaultValue;
        this.countryAllowed = settings.countryAllowed;
        this.language = settings.language;

        if (this.$field && this.$countryInput) {
            this.initValidator();
        } else {
            console.error('Unable to find country field “input[type="tel"]” or “[data-country]”');
        }
    }

    initValidator() {
        const options = {
            allowDropdown: true,
            autoHideDialCode: true,
            autoInsertDialCode: true,
            nationalMode: false,
            preferredCountries: [],
            separateDialCode: true,
            showSelectedDialCode: true,
            initialCountry: 'auto',
            autoPlaceholder: 'off',
            formatOnDisplay: false,
            formatAsYouType: false,
            validationNumberTypes: null,
        };

        if (this.countryAllowed && this.countryAllowed.length) {
            options.onlyCountries = this.countryAllowed.map((item) => {
                return item.value.toLowerCase();
            });

            // Set the initial country to the first in collection
            [options.initialCountry] = options.onlyCountries;

            // Not much point showing a dropdown if a single option.
            // Also put it into national mode for input-ease
            if (options.onlyCountries.length === 1) {
                options.allowDropdown = false;
                options.separateDialCode = false;
                options.nationalMode = true;
            }

            // Save this on the field so we can check during validation
            this.$field.restrictedCountries = true;
        }

        if (this.countryDefaultValue) {
            options.initialCountry = this.countryDefaultValue;
        }

        // Ensure the initial country (if set) is in the only countries (if also set)
        if (options.onlyCountries && options.onlyCountries.length && options.initialCountry) {
            if (!options.onlyCountries.includes(options.initialCountry)) {
                options.onlyCountries.push(options.initialCountry.toLowerCase());
            }
        }

        this.validator = intlTelInput(this.$field, options);

        // Attach the validator to the field so we can access later
        this.$field.validator = this.validator;

        // Also add the hidden input for the country code
        this.$field.$countryInput = this.$countryInput;

        // If the country input has a value, set the country
        if (this.$field.$countryInput && this.$field.$countryInput.value) {
            this.validator.setCountry(this.$field.$countryInput.value);
        }

        // Emit an "init" event
        this.$field.dispatchEvent(new CustomEvent('init', {
            bubbles: true,
            detail: {
                phoneCountry: this,
                validator: this.validator,
                validatorOptions: options,
            },
        }));

        // Update the hidden country field when selected
        this.form.addEventListener(this.$field, eventKey('countrychange'), this.countryChange.bind(this));

        // Attach custom validation
        this.form.registerEvent('registerFormieValidation', this.registerValidation.bind(this));

        // Trigger the country changing now, in case it's been populated
        this.$field.dispatchEvent(new Event('countrychange', { bubbles: true }));

        // Update the form hash, so we don't get change warnings
        if (this.form.formTheme) {
            this.form.formTheme.updateFormHash();
        }
    }

    countryChange(e) {
        const countryData = this.validator.getSelectedCountryData();
        const selectedCountryCode = countryData.iso2;

        // Save the country code to the hidden input
        if (this.$countryInput && selectedCountryCode) {
            this.$countryInput.value = selectedCountryCode.toUpperCase();
        }
    }

    registerValidation(e) {
        e.validator.addValidator('phoneCountry', ({ input }) => {
            const type = input.getAttribute('type');

            if (type !== 'tel') {
                return true;
            }

            if (input.value.trim() && input.validator) {
                if (input.validator.isValidNumber()) {
                    const countryData = input.validator.getSelectedCountryData();
                    const selectedCountryCode = countryData.iso2;

                    // The library doesn't provide a method to check if it's a valid number against restricted countries
                    // so we need to do that ourselves.
                    if (input.restrictedCountries) {
                        // Check if this country code is in our allowed codes. Note `selectedCountryCode` will
                        // be empty if it matches a valid phone for a non-allowed country.
                        if (!input.validator.options.onlyCountries.includes(selectedCountryCode)) {
                            return false;
                        }
                    }

                    // Save the country code to the hidden input
                    if (input.$countryInput && selectedCountryCode) {
                        input.$countryInput.value = selectedCountryCode.toUpperCase();
                    }
                } else {
                    return false;
                }
            }

            return true;
        }, ({ input }) => {
            const errorMap = ['Invalid number', 'Invalid country code', 'Too short', 'Too long'];
            const errorCode = input.validator ? input.validator.getValidationError() : '';
            const errorMessage = errorMap[errorCode] || 'Invalid number';

            return t(errorMessage);
        });
    }
}

window.FormiePhoneCountry = FormiePhoneCountry;
