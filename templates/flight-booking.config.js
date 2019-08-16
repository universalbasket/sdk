
import { header, summary, footer } from './flight-booking/layout/index.js';
import { selectFlights, selectFares, account, passengers, checkout, finalPriceConsent, confirmation } from './flight-booking/sections/index.js';
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
                    name: 'select-flights',
                    template: selectFlights,
                    waitFor: ['output.availableOutboundFlights']
                },
                {
                    name: 'select-fares',
                    template: selectFares,
                    waitFor: ['output.availableOutboundFares']
                },
                {
                    name: 'select-flights',
                    template: selectFlights,
                    waitFor: ['output.availableInboundFlights']
                },
                {
                    name: 'select-fares',
                    template: selectFares,
                    waitFor: ['output.availableInboundFares']
                }
            ]
        },
        {
            name: 'passengers',
            route: '/passengers',
            title: 'Passengers',
            sections: [
                {
                    name: 'account',
                    template: account,
                    waitFor: []
                },
                {
                    name: 'passengers',
                    template: passengers,
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
                    waitFor: ['outputs.finalPrice']
                },
                {
                    name: 'confirmation',
                    template: confirmation,
                    waitFor: ['outputs.bookingConfirmation']
                }
            ],
            excludeStep: true
        }
    ],
    notFound,
    error
};
