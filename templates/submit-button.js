
function addSubmitter() {
    /* this bits need to be automated, per input keys */

    const form = document.querySelector('form');
    const submit = document.querySelector(`#submit`);

    if (!form || !submit) {
        console.error('form or submit button not found. check your name convention for the forms');
        return;
    }

    submit.addEventListener('click', function () {
        // TODO: validate the input (using protocol?)
        if(!form.reportValidity()) {
            console.log('not valid form')
            return;
        }

        submit.setAttribute('disabled', 'true');

        // Partner can send input data to their server for logging if they prefer,
        // in prototyping we are sending the input directly to api using sdk.
        //TODO: update it to accept several inputs and send each of them separately
        const inputs = serializeForm(form);
        console.log('inputs:', inputs);
        // send input or create job via sdk
        sdk.createJobInputs(inputs).then(res => {
            setTimeout(next, 1000);
            submit.removeAttribute('disabled');
        })
    });
}