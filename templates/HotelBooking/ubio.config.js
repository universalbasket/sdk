export default {
    cache: [

    ],
    pages: [
        {
            name: 'rooms',
            route: '/rooms',
            title: 'Available rooms',
            sections: [
                { name: 'rooms', waitFor: ['output.availableRooms'] }
            ]
        },
        {
            name: 'checkout',
            route: '/checkout',
            title: 'Booking details',
            sections: [
                { name: 'checkout', waitFor: ['_.otp'] },
                { name: 'finalPriceConsent', waitFor: ['input.selectedRooms', 'outputs.finalPrice'] }
            ]
        },
        {
            name: 'confirmation',
            route: '/confirmation',
            title: 'Confirmation',
            sections: [
                { name: 'confirmation', waitFor: ['outputs.bookingConfirmation'] }
            ]
        }
    ],
    layout: [
        { name: 'header', selector: '#header' },
        { name: 'summary',  selector: '#summary' },
        { name: 'main', selector: '#main', mainTarget: true },
        { name: 'footer', selector: '#footer' }
    ],
    data: {
        serverUrlPath: 'https://ubio-application-bundle-dummy-server.glitch.me/create-job/nh',
        initialInputs: {
            url: "https://linkcenterus.derbysoftca.com/dplatform-linkcenter/booking.htm?hotelCode=ESVA.VALLA&channelCode=nhhotels-trivago&checkInDate=2019-06-15&checkOutDate=2019-06-16&language=es-ES&country=ES&currency=EUR&rooms=1&guests=2&party=%5B%7B%22adults%22%3A2%2Cchildren%3A%22%22%7D%5D&roomTypeCode=STDDBL&ratePlanCode=NHR_SD1&regimen=14",
            options: {
                "searchRates": false
            }
        },
        local: {
            currencyCode: 'gbp',
        }
    }
}
