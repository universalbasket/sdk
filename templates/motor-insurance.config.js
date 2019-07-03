import { header, summary, footer, notFound, error } from './motor-insurance/layout/index.js';
import {
    quote,
    quoteLoading,
    options,
    assumptions,
    statements,
    feesSummary,
    declarations,
    marketingConsent,
    summaryPage,
    checkout,
    finalPriceConsent,
    confirmation } from './motor-insurance/sections/index.js';

export default {
    layout: {
        header,
        summary,
        footer,
        notFound,
        error
    },
    cache: [],
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
                        'output.availableMisfuelCovers',
                        '_.serviceName'
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
                        'output.policyWording',
                        'output.productInformation',
                        'output.privacyPolicy',
                        'output.statementOfFact'
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
            name: 'summary',
            route: '/summary',
            title: 'Summary',
            sections: [
                {
                    name: 'summary',
                    template: summaryPage,
                    waitFor: ['output.coverSummary']
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
                    waitFor: ['_.otp']
                }
            ]
        },
        {
            name: 'confirmation',
            route: '/confirmation',
            title: '',
            sections: [
                {
                    name: 'final-price-consent',
                    template: finalPriceConsent,
                    waitFor: ['output.estimatedPrice', 'outputs.finalPrice']
                },
                {
                    name: 'confirmation',
                    template: confirmation,
                    waitFor: ['output.purchaseConfirmation']
                }
            ],
            excludeStep: true
        }
    ]
};
