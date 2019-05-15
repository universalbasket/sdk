/** Global */

import loading from './loading';
import section from './section';
import selectOne from './selected-input-one';
import selectMany from './selected-input-many';

import inputs from './inputs/index';

//TODO-test: run this function for all given inputMetas;
export default { loading, section, getInput };

function getInput(meta) {
    const { key, inputMethod } = meta;
    let templateFunc = inputs[key];

    if (!templateFunc && inputMethod === 'SelectOne') {
        templateFunc = selectOne;
    }

    if (!templateFunc && inputMethod === 'SelectMany') {
        templateFunc = selectMany;
    }

    /*
    if (!template && inputMethod === 'Consent') {
        template = consent;
    } */

    if (templateFunc && typeof templateFunc === 'function') {
        console.log('templateFunc found');
        return templateFunc;
    }

    return null;
}

const INPUT_METHOD = [ "SeatSelection", "Consent", "SelectOne", "SelectMany" ];