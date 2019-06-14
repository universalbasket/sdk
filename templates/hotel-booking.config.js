import { header, summary, footer } from './hotel-booking/layout/index.js';
import { checkout, confirmation, finalPriceConsent, rooms, summaryPage } from './hotel-booking/sections/index.js';

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
            name: 'summary',
            route: '/summary',
            title: 'Summary',
            sections: [
                {
                    name: 'summary',
                    template: summaryPage,
                    waitFor: ['input.selectedRooms', 'output.priceBreakdown']
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
                },
                {
                    name: 'final-price-consent',
                    template: finalPriceConsent,
                    waitFor: ['input.selectedRooms', 'outputs.finalPrice']
                }
            ]
        },

        {
            name: 'confirmation',
            route: '/confirmation',
            title: '',
            sections: [
                {
                    name: 'confirmation',
                    template: confirmation,
                    waitFor: ['outputs.bookingConfirmation']
                }
            ],
            excludeStep: true
        }
    ],
    data: {
        serverUrlPath: 'https://ubio-application-bundle-dummy-server.glitch.me/create-job/nh',
        initialInputs: {
            url: 'https://linkcenterus.derbysoftca.com/dplatform-linkcenter/booking.htm?hotelCode=ESVA.VALLA&channelCode=nhhotels-trivago&checkInDate=2019-06-15&checkOutDate=2019-06-16&language=es-ES&country=ES&currency=EUR&rooms=1&guests=2&party=%5B%7B%22adults%22%3A2%2Cchildren%3A%22%22%7D%5D&roomTypeCode=STDDBL&ratePlanCode=NHR_SD1&regimen=14',
            options: {
                searchRates: false
            }
        },
        supportEmail: 'support@example.com',
        local: {
            currencyCode: 'gbp'
        }
    }
};
