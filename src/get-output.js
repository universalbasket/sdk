import sdk from './core';

export default function getOutputs({ inputMethod, sourceOutputKey }, callback) {
    if (inputMethod === 'SelectOne' || inputMethod === 'Consent' ) {
       if (!sourceOutputKey) {
           throw Error(`Unexpected meta: sourceOutputKey not found for ${inputMethod} inputMethod.`)
       }
        //check job state and see if it's awaitingInput && key = selectedBreedType
        console.log(`waiting for job output ${sourceOutputKey}`);

        //TODO: we should show something while waiting.
        sdk.waitForJobOutput(sourceOutputKey, (err, output) => {
            if (err) {
                callback(new Error(`Unexpected meta: sourceOutputKey not found for ${inputMethod} inputMethod.`), null);
            }

            console.log('heres the output');
            callback(null, output.data);
        });
    } else {
        console.log(`default input.`);
    }
}
