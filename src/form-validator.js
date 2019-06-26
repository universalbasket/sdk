import flashError from './builtin-templates/flash-error.js';

function focus() {
    const formsToFill = document.querySelectorAll('form:invalid');
    formsToFill[0] && formsToFill[0].querySelectorAll(':invalid')[0].focus();
}

function validate(form) {
    focus();

    const invalidClassName = 'field--invalid';
    const fields = form.querySelectorAll('.field');

    fields.forEach(field => {
        const inputs = field.querySelectorAll('input, select, textarea');
        const required = Array.from(inputs).some(i => i.required);

        if (!required) {
            const label = field.querySelector('.field__name');
            label && label.setAttribute('data-optional', 'optional');
        }

        inputs.forEach(input => {
            input.addEventListener('invalid', e => {
                e.preventDefault();

                if (!field.getAttribute('data-error')) {
                    const message = input.getAttribute('data-error') || input.validationMessage;
                    field.setAttribute('data-error', message);
                }

                field.classList.add(invalidClassName);
                focus();
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
    });
}

export default validate;
