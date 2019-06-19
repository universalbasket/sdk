function getCustomMessage(input) {
    if (input.validity.patternMismatch || input.validity.typeMismatch) {
        return input.getAttribute('data-error');
    }

    return input.validationMessage;
}

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
            field.querySelector('.field__name').setAttribute('data-optional', 'optional');
        }

        inputs.forEach(input => {
            input.addEventListener('invalid', e => {
                e.preventDefault();

                const defaultFieldErrorMessage = field.getAttribute('data-error');
                const message = defaultFieldErrorMessage || getCustomMessage(input);

                field.setAttribute('data-error', message || '');
                field.classList.add(invalidClassName);
                focus();
            });

            input.addEventListener('input', () => {
                if (input.validity.valid) {
                    field.classList.remove(invalidClassName);
                }
            });
        });
    });
}

export default validate;
