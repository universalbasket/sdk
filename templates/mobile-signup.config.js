import { header, summary, footer } from './mobile-signup/layout/index.js';
import {
    phones,
    plans,
    extras,
    benefits,
    selectedAddress,
    delivery,
    installation,
    setupDates,
    monthlyPaymentMethod,
    checkout,
    finalPriceConsent,
    confirmation,
    summaryPage
} from './mobile-signup/sections/index.js';
import error from './mobile-signup/error.js';
import notFound from './mobile-signup/not-found.js';

export default {
    layout: {
        header,
        summary,
        footer
    },
    cache: [
        {
            key: 'availablePhoneOffers',
            sourceInputKeys: []
        },
        {
            key: 'availableMobilePlans',
            sourceInputKeys: ['selectedPhoneOption']
        },
        {
            key: 'availablePlanExtras',
            sourceInputKeys: ['selectedMobilePlan']
        },
        {
            key: 'availableBenefits',
            sourceInputKeys: ['selectedMobilePlan']
        }
    ],
    pages: [
        {
            name: 'phones',
            route: '/phones',
            title: 'Choose your phone',
            sections: [
                {
                    name: 'phone',
                    template: phones,
                    waitFor: ['cache.availablePhoneOffers']
                }
            ]
        },
        {
            name: 'plan',
            route: '/plan',
            title: 'Configure your plan',
            sections: [
                {
                    name: 'plan',
                    template: plans,
                    waitFor: ['cache.availableMobilePlans']
                },
                {
                    name: 'extras',
                    template: extras,
                    waitFor: ['cache.availablePlanExtras']
                },
                {
                    name: 'benefits',
                    template: benefits,
                    waitFor: ['cache.availableBenefits']
                }
            ]
        },
        {
            name: 'delivery',
            route: '/delivery',
            title: 'Delivery',
            sections: [
                {
                    name: 'delivery',
                    template: delivery
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
                    waitFor: []
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
                    waitFor: ['output.oneOffCosts', 'output.finalPrice']
                },
                {
                    name: 'confirmation',
                    template: confirmation,
                    waitFor: ['output.confirmation']
                }
            ],
            excludeStep: true
        }
    ],
    notFound,
    error
};
