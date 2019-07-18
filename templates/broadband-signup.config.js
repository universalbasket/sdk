import { header, summary, footer } from './broadband-signup/layout/index.js';
import {
    landline,
    selectedAddress,
    aboutYou,
    installation,
    setupDates,
    monthlyPaymentMethod,
    checkout,
    finalPriceConsent,
    confirmation,
    summaryPage,
    loading
} from './broadband-signup/sections/index.js';
import error from './broadband-signup/error.js';
import notFound from './broadband-signup/not-found.js';

export default {
    layout: {
        header,
        summary,
        footer
    },
    cache: [
        {
            key: 'availableTvPackages',
            sourceInputKeys: []
        },
        {
            key: 'availableBroadbandPackages',
            sourceInputKeys: []
        },
        {
            key: 'availablePhonePackages',
            sourceInputKeys: []
        },
        {
            key: 'installationOptions',
            sourceInputKeys: ['selectedTvPackages']
        },
        {
            key: 'oneOffCosts',
            sourceInputKeys: ['selectedBroadbandPackage', 'selectedTvPackages', 'selectedPhonePackage']
        },
        {
            key: 'monthlyCosts',
            sourceInputKeys: ['selectedBroadbandPackage', 'selectedTvPackages', 'selectedPhonePackage']
        }
    ],
    pages: [
        {
            name: 'landline',
            route: '/land-line',
            title: 'Landline Check',
            sections: [
                {
                    name: 'landline',
                    template: landline,
                    waitFor: ['local.landlineOptions']
                },
                {
                    name: 'selected-address',
                    template: selectedAddress,
                    waitFor: ['output.availableAddresses', 'output.availableInstallationAddresses'],
                    loadingTemplate: loading('Looking up your address...')
                }
            ]
        },
        {
            name: 'about-you',
            route: '/about-you',
            title: 'About You',
            sections: [
                {
                    name: 'about-you',
                    template: aboutYou
                },
                {
                    name: 'installation',
                    template: installation,
                    waitFor: ['output.installationOptions']
                }
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
                        'input.selectedBroadbandPackage',
                        'input.selectedTvPackages',
                        'input.selectedPhonePackage',
                        'output.oneOffCosts',
                        'output.monthlyCosts'
                    ]
                }
            ]
        },
        {
            name: 'setup-dates',
            route: '/setup-dates',
            title: 'Setup dates for your packages',
            sections: [
                {
                    name: 'setup-dates',
                    template: setupDates,
                    waitFor: ['output.availableBroadbandSetupDates', 'output.availableTvSetupDates'],
                    loadingTemplate: loading('Checking your address for an active line...')
                }
            ]
        },
        {
            name: 'checkout',
            route: '/checkout',
            title: 'Payment details',
            sections: [
                {
                    name: 'monthly-payment-method',
                    template: monthlyPaymentMethod,
                    waitFor: ['input.options']
                },
                {
                    name: 'checkout',
                    template: checkout,
                    waitFor: ['_.otp', 'input.monthlyPaymentMethod']
                }
            ]
        },
        {
            name: 'confirmation',
            route: '/confirmation',
            title: 'Confirmation',
            sections: [
                {
                    name: 'final-price-consent',
                    template: finalPriceConsent,
                    waitFor: ['output.oneOffCosts', 'output.finalPrice'],
                    loadingTemplate: loading('Finalising your order...')
                },
                {
                    name: 'confirmation',
                    template: confirmation,
                    waitFor: ['outputs.confirmation'],
                    loadingTemplate: loading('Finalising your order...')
                }
            ],
            excludeStep: true
        }
    ],
    notFound,
    error
};
