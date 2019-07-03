import { header, summary, footer } from './hotel-booking/layout/index.js';
import { checkout, confirmation, finalPriceConsent, rooms, error } from './hotel-booking/sections/index.js';

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
