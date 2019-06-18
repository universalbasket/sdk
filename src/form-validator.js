function getCustomMessage(input) {
    if (input.validity.valueMissing) {
        return 'Please fill in this field.';
    }

    if (input.validity.patternMismatch) {
        return input.getAttribute('data-error');
    }

    return '';
}

function validate(form) {
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
                const message = getCustomMessage(input) || defaultFieldErrorMessage;

                field.setAttribute('data-error', message);
                field.classList.add(invalidClassName);
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
