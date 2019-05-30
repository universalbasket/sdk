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
    pages: [
        {
            name: 'landline',
            route: '/land-line',
            title: 'Landline Check',
            sections: [
                { name: 'landline' },
                { name: 'selectedAddress', waitFor: ['output.availableAddresses'] }
            ]
        },
        {
            name: 'aboutYou',
            route: '/about-you',
            title: 'About You',
            sections: [
                { name: 'aboutYou' }
            ]
        },/*
        {
            name: 'package',
            route: '/package',
            title: 'Package',
            sections: [
                { name: 'yourPackage', waitFor: ['cache.oneOffCosts', 'cache.monthlyCosts'] }
            ]
        },
        {
            name: 'checkout',
            route: '/checkout',
            title: 'Set-up and payment',
            sections: [
                { name: 'selectedBroadbandSetupDate', waitFor: ['output.availableBroadbandSetupDates'] },
                { name: 'payment' }
            ]
        },
        {
            name: 'consentPayment',
            route: '/consent-payment',
            title: 'Confirmation',
            sections: [
                { name: 'finalPriceConsent', waitFor: ['output.finalPrice'] },
                { name: 'confirmation', waitFor: ['output.confirmation'] }
            ]
        } */
    ],
    layout: [
        { name: 'header', selector: '#header' },
        { name: 'summary',  selector: '#summary' },
        { name: 'main', selector: '#main', mainTarget: true },
        { name: 'footer', selector: '#footer' }
    ],
    data: {
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
        preDefined: {
            inputs: {
                landlineOptions: {
                    "justMoved": true,
                    "sharedProperty": false,
                    "restartLine": false,
                    "additionalLine": false
                }
            },
            outputs: {
                finalPrice: {
                    value: 2000,
                    countryCode: 'gbp'
                }
            }
        }
    }
}