import { header, summary, footer } from './pet-insurance/layout/index.js';
import {
    aboutYou,
    checkout,
    confirmation,
    directDebit,
    finalPriceConsent,
    pets,
    policyOptions,
    selectedAddress,
    selectedCoverType,
    selectedCoverOptions,
    summaryPage
} from './pet-insurance/sections/index.js';
import error from './pet-insurance/error.js';
import notFound from './pet-insurance/not-found.js';

export default {
    layout: {
        header,
        summary,
        footer
    },
    cache: [
        {
            key: 'priceBreakdown',
            sourceInputKeys: ['selectedOption1', 'selectedOption2']
        },
        {
            key: 'availableCovers',
            sourceInputKeys: []
        },
        {
            key: 'availableVetPaymentTerms',
            sourceInputKeys: ['selectedCover']
        },
        {
            key: 'availablePaymentTerms',
            sourceInputKeys: []
        }
    ],
    pages:[
        {
            name: 'aboutYourPet',
            route: '/about-your-pet',
            title: 'About Your Pet',
            sections: [
                {
                    name: 'pets',
                    template: pets,
                    waitFor: ['local.availableBreedTypes']
                }
            ]
        },
        {
            name: 'aboutYou',
            route: '/about-you',
            title: 'About You',
            sections: [
                {
                    name: 'about-you',
                    template: aboutYou
                },
                {
                    name: 'selected-address',
                    template: selectedAddress,
                    waitFor: ['output.availableAddresses']
                }
            ]
        },
        {
            name: 'your-policy',
            route: '/your-policy',
            title: 'Your Policy',
            sections: [
                {
                    name: 'policy-options',
                    template: policyOptions,
                    waitFor: ['cache.availableCovers', 'cache.availablePaymentTerms']
                },
                /* { name: 'selectedVetPaymentTerm', waitFor: ['output.availableVetPaymentTerms'] }, */
                {
                    name: 'selected-cover-type',
                    template: selectedCoverType,
                    waitFor: ['output.availableCoverTypes']
                },
                /* { name: 'selectedVoluntaryExcess', waitFor: ['output.availableVoluntaryExcesses'] }, */
                {
                    name: 'selected-cover-options',
                    template: selectedCoverOptions,
                    waitFor: ['output.availableCoverOptions']
                }
                /* { name: 'selectedVetFee', waitFor: 'output.availableVetFees' } */
            ]
        },
        {
            name: 'summary',
            route: '/summary',
            title: 'Summary',
            sections: [
                {
                    name: 'summary',
                    template: summaryPage,
                    waitFor: [
                        'input.policyOptions',
                        'input.selectedCoverOptions',
                        'input.selectedCoverType',
                        'input.selectedPaymentTerm',
                        'input.selectedCover',
                        'input.selectedAddress',
                        'input.selectedBreedType',
                        'output.estimatedPrice'
                    ]
                }
            ]
        },
        {
            name: 'paymentDetail',
            route: '/payment',
            title: 'Payment Details',
            sections: [
                {
                    name: 'checkout',
                    template: checkout,
                    waitFor: ['_.otp'] },
                {
                    name: 'direct-debit',
                    template: directDebit,
                    waitFor: ['input.selectedPaymentTerm'] },
                {
                    name: 'final-price-consent',
                    template: finalPriceConsent,
                    waitFor: ['output.estimatedPrice', 'output.finalPrice']
                }
            ]
        },
        {
            name: 'confirmation',
            route: '/confirmation',
            title: 'Confirmation',
            sections: [
                {
                    name: 'confirmation',
                    template: confirmation,
                    waitFor: ['output.purchaseConfirmation']
                }
            ],
            excludeStep: true
        }
    ],
    notFound,
    error
};
