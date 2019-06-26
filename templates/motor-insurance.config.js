import { header, summary, footer } from './motor-insurance/layout/index.js';
import { quote, quoteLoading, options, assumptions, statements, feesSummary, declarations, marketingConsent, checkout } from './motor-insurance/sections/index.js';
import error from './shared/error.js';

export default {
    layout: {
        header,
        summary,
        footer
    },
    cache: [

    ],
    pages: [
        {
            name: 'payment-term',
            route: '/payment-term',
            title: 'Payment term',
            sections: [
                {
                    name: 'quote',
                    template: quote,
                    waitFor: [
                        'output.availablePaymentTerms',
                        'output.availableNoClaimsDiscountProtection',
                        'output.quoteReference',
                        'output.vehicleDetails',
                        'output.statutoryStatusDisclosure'
                    ],
                    loadingTemplate: quoteLoading
                }
            ]
        },
        {
            name: 'options',
            route: '/options',
            title: 'Options',
            sections: [
                {
                    name: 'quote',
                    template: options,
                    waitFor: [
                        'input.selectedPaymentTerm',
                        'output.availableNoClaimsDiscountProtection',
                        'output.availableVoluntaryExcesses',
                        'output.availableLegalCovers',
                        'output.availableExcessProtectCovers',
                        'output.availablePersonalInjuryCovers',
                        'output.availableCarHireCovers',
                        'output.availableBreakdownCovers',
                        'output.availableWindscreenCovers',
                        'output.availableKeyReplacementCovers',
                        'output.availableMisfuelCovers'
                    ]
                }
            ]
        },
        {
            name: 'declarations',
            route: '/declarations',
            title: 'Declarations',
            sections: [
                {
                    name: 'assumptions',
                    template: assumptions,
                    waitFor: [
                        'output.assumptions'
                    ]
                },
                {
                    name: 'statements',
                    template: statements,
                    waitFor: [
                        'output.statements'
                    ]
                },
                {
                    name: 'feesSummary',
                    template: feesSummary,
                    waitFor: [
                        'output.feesSummary'
                    ]
                },
                {
                    name: 'declarations',
                    template: declarations,
                    waitFor: [
                        'output.statements',
                        'output.feesSummary'
                    ]
                },
                {
                    name: 'marketingConsent',
                    template: marketingConsent,
                    waitFor: [
                        'output.availableMarketingContactOptions'
                    ]
                }
            ]
        },
        {
            name: 'checkout',
            route: '/checkout',
            title: 'Payment',
            sections: [
                {
                    name: 'checkout',
                    template: checkout,
                    waitFor: null
                }
            ]
        },
        {
            name: 'confirmation',
            route: '/confirmation',
            title: '',
            sections: [
                {
                    name: 'quote',
                    template: quote,
                    waitFor: ['output.availablePaymentTerms']
                }
            ],
            excludeStep: true
        }
    ],
    error
};
