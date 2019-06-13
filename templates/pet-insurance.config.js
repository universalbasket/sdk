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
    selectedCoverOptions
} from './pet-insurance/sections/index.js';

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
    data: {
        serverUrlPath: 'https://ubio-application-bundle-dummy-server.glitch.me/create-job',
        initialInputs: {
            url: 'https://pet.morethan.com/h5/pet/step-1?path=%2FquoteAndBuy.do%3Fe%3De1s1%26curPage%3DcaptureDetails'
        },
        local: {
            currencyCode: 'gbp',
            availableBreedTypes: {
                cat: [
                    'Pedigree',
                    'Non-Pedigree'
                ],
                dog: [
                    'Cross Breed',
                    'Pedigree',
                    'Small mixed breed (up to 10kg)',
                    'Medium mixed breed (10 - 20kg)',
                    'Large mixed breed (above 20kg)'
                ]
            }
        }
    }
};
