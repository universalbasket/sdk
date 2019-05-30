export default {
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
            key: 'oneOffCosts',
            sourceInputKeys: ['selectedBroadbandPackage', 'selectedTvPackages', 'selectedPhonePackage']
        },
        {
            key: 'monthlyCosts',
            sourceInputKeys: ['selectedBroadbandPackage', 'selectedTvPackages', 'selectedPhonePackage']
        }
    ],
    section: [
        {
            name: 'landline',
            route: '/land-line',
            title: 'Landline Check',
            screens: [
                { name: 'landlineCheck' },
                { name: 'landlineOptions' }
            ]
        },
        {
            name: 'Confirm Address',
            route:'/confirm-address',
            title: 'Select Address',
            screens: [{ name: 'selectedAddress', waitFor: ['output.availableAddresses']}]
        },
        {
            name: 'aboutYou',
            route: '/about-you',
            title: 'About You',
            screens: [
                { name: 'contactPerson' },
                { name: 'account' },
                { name: 'selectedMarketingContactOptions' },
                /* { name: 'directoryListing' }, */
                { name: 'installation' }
            ]
        },
        {
            name: 'package',
            route: '/package',
            title: 'Package',
            screens: [
                { name: 'yourPackage', waitFor: ['cache.oneOffCosts', 'cache.monthlyCosts'] }
            ]
        },
        {
            name: 'checkout',
            route: '/checkout',
            title: 'Set-up and payment',
            screens: [
                { name: 'selectedBroadbandSetupDate', waitFor: ['output.availableBroadbandSetupDates'] },
                { name: 'payment' }
            ]
        },
        {
            name: 'consentPayment',
            route: '/consent-payment',
            title: 'Confirmation',
            screens: [
                { name: 'finalPriceConsent', waitFor: ['output.finalPrice'] },
                { name: 'confirmation', waitFor: ['output.confirmation'] }
            ]
        }
    ],
    layout: [
        { name: 'header', selector: '#header' },
        { name: 'summary',  selector: '#summary' },
        { name: 'main', selector: '#main', mainTarget: true },
        { name: 'footer', selector: '#footer' }
    ],
    serverUrlPath: 'https://ubio-application-bundle-dummy-server.glitch.me/create-job/sky',
    initialInputs: {
        url: 'https://www.moneysupermarket.com/broadband/goto/?linktrackerid=8307&productname=Sky+Entertainment+%2B+Broadband+Essential+%2B+Talk+Anytime+Extra&bundleid=58&clickout=00000000-0000-0000-0000-000000000003&dtluid=SqADhopj*6Q*eioD&location=',
        options: {
            "marketingContact": true,
            "success": true,
            "directoryListing": true,
            "addressSelection": true,
            "moveInDateSelection": true,
            "keepLandlineNumber": false,
            "screenshots": true,
            "testingFlow": false
        },
        selectedBroadbandPackage: {
            "name": "Sky Broadband Essential"
        },
        selectedTvPackages: [{
            "name": "Sky Entertainment"
        }],
        selectedPhonePackage: {
            "name": "Sky Talk Anytime Extra"
        }
    },
    predefinedData: {

    }
}