
import { header, summary, footer } from './flight-booking/layout/index.js';
import { selectFlights, selectFares, account, passengers, checkout, finalPriceConsent, confirmation, loading } from './flight-booking/sections/index.js';
import error from './flight-booking/error.js';
import notFound from './flight-booking/not-found.js';

export default {
    layout: {
        header,
        summary,
        footer
    },
    cache: [],
    pages: [
        {
            name: 'flights',
            route: '/flights',
            title: 'Select your flights',
            sections: [
                {
                    name: 'selected-outbound-flight',
                    template: selectFlights,
                    waitFor: ['output.availableOutboundFlights'],
                    loadingTemplate: loading('Searching for outbound flights. Please wait ...')
                },
                {
                    name: 'selected-outbound-fare',
                    template: selectFares,
                    waitFor: ['output.availableOutboundFares'],
                    loadingTemplate: loading('Gathering fares. Please wait ...')
                },
                {
                    name: 'selected-inbound-flight',
                    template: selectFlights,
                    waitFor: ['output.availableInboundFlights'],
                    loadingTemplate: loading('Searching for inbound flights ...')
                },
                {
                    name: 'selected-inbound-fare',
                    template: selectFares,
                    waitFor: ['output.availableInboundFares'],
                    loadingTemplate: loading('Gathering fares. Please wait ...')
                }
            ]
        },
        {
            name: 'passengers',
            route: '/passengers',
            title: 'Passengers',
            sections: [
                {
                    name: 'passengers',
                    template: passengers,
                    waitFor: ['input.search']
                },
                {
                    name: 'account',
                    template: account,
                    waitFor: []
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
                    waitFor: ['_.otp', 'output.estimatedPrice']
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
                    waitFor: ['outputs.finalPrice'],
                    loadingTemplate: loading('Finalising your booking ...')
                },
                {
                    name: 'confirmation',
                    template: confirmation,
                    waitFor: ['outputs.bookingConfirmation'],
                    loadingTemplate: loading('Getting booking confirmation. Please wait ...')
                }
            ],
            excludeStep: true
        }
    ],
    notFound,
    error
};
