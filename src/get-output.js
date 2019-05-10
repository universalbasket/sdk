import sdk from './sdk';

export default function getOutput(outputKey, callback) {
    //check job state and see if it's awaitingInput && key = selectedBreedType
    console.log(`waiting for job output ${outputKey}`);

//TODO: we should show something while waiting.
    sdk.waitForJobOutput(outputKey, (err, output) => {
        if (err) {
            callback(err, null);
        }

        console.log('heres the output');
        callback(null, output.data);
    });
}
