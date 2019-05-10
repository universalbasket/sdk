/** Global */

import loading from './loading';
import section from './section';
import selectOne from './selected-input-one';
import selectMany from './selected-input-many';

import inputs from './inputs/index';
/** PetInsurance *//*
import aboutYourPet from './about-your-pet/index';
import aboutYou from './about-you/index';
import selectedAddress from './selected-address/index';
import aboutYourPolicy from './about-your-policy/index';
import selectedCover from './covers/index';
import selectedVetPaymentTerm from './covers/selected-vet-payment-term';
import selectedPaymentTerm from './covers/selected-payment-term';
import payment from './payment'; */


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
        return templateFunc(meta);
    }

    return null;
}

const INPUT_METHOD = [ "SeatSelection", "Consent", "SelectOne", "SelectMany" ];