import { header, summary, footer } from './hotel-booking/layout/index.js';
import { checkout, mainGuest, confirmation, finalPriceConsent, rooms } from './hotel-booking/sections/index.js';
import error from './hotel-booking/error.js';
import notFound from './hotel-booking/not-found.js';

export default {
    layout: {
        header,
        summary,
        notFound,
        footer
    },
    cache: [],
    pages: [
        {
            name: 'rooms',
            route: '/rooms',
            title: 'Available rooms',
            sections: [
                {
                    name: 'rooms',
                    template: rooms,
                    waitFor: ['output.availableRooms']
                }
            ]
        },
        {
            name: 'main-guest',
            route: '/main-guest',
            title: 'Main guest details',
            sections: [
                {
                    name: 'main-guest',
                    template: mainGuest,
                    waitFor: []
                }
            ]
        },
        {
            name: 'checkout',
            route: '/checkout',
            title: 'Booking details',
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
                    waitFor: ['input.selectedRooms', 'outputs.finalPrice']
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
    error
};
