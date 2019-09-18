import flashError from './builtin-templates/flash-error.js';

export default function setupForm(form) {
    focusInvalid();

    const fields = form.querySelectorAll('.field');

    fields.forEach(field => {
        // remove this? (to address "optional designator" part of issue 97)
        // addDataOptionalAttribute(field);
        addEventListeners(field);
    });
}

function focusInvalid() {
    const formsToFill = document.querySelectorAll('form:invalid');

    if (formsToFill[0]) {
        formsToFill[0].querySelectorAll(':invalid')[0].focus();
    }
}

function addEventListeners(field) {
    const invalidClassName = 'field--invalid';
    const inputs = field.querySelectorAll('input, select, textarea');

    inputs.forEach(input => {
        input.addEventListener('invalid', e => {
            e.preventDefault();

            if (!field.getAttribute('data-error')) {
                const message = input.getAttribute('data-error') || input.validationMessage;
                field.setAttribute('data-error', message);
            }

            field.classList.add(invalidClassName);
            focusInvalid();
        });

        input.addEventListener('input', () => {
            if (input.validity.valid) {
                const inputsToFill = document.querySelectorAll(':invalid');
                if (inputsToFill.length === 0) {
                    flashError().hide();
                }
                field.classList.remove(invalidClassName);
            }
        });
    });
}

// TODO: remove
function addDataOptionalAttribute(field) {
    const optionalInputs = field.querySelectorAll(':optional');

    if (optionalInputs.length === 0) {
        return;
    }

    const label = field.querySelector('.field__name');

    if (label) {
        label.setAttribute('data-optional', 'optional');
    }
}
