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
                { key: 'landline-check' },
                { key: 'selected-address', waitFor: ['output.availableAddresses'], renderAfter: ['input.landlineCheck'] },
                { key: 'landline-options' }
            ]
        },
        {
            name: 'aboutYou',
            route: '/about-you',
            title: 'About You',
            screens: [
                { key: 'contact-person' },
                { key: 'account' },
                { key: 'selected-marketing-contact-options' },
                { key: 'directory-listing' },
                { key:'installation' }
            ]
        },
        {
            name: 'package',
            route: '/package',
            title: 'Package',
            screens: [
                { key: 'package', waitFor: ['cache.oneOffCosts', 'cache.monthlyCosts'] }
            ]
        },
        {
            name: 'checkout',
            route: '/checkout',
            title: 'Set-up and payment',
            screens: [
                { key: 'selectedBroadbandSetupDate', waitFor: ['output.availableBroadbandSetupDates'] },
                { key: 'payment' }
            ]
        },
        {
            name: 'consentPayment',
            route: '/consent-payment',
            title: 'Confirmation',
            screens: [
                { key: 'finalPriceConsent', waitFor: ['output.finalPrice'] },
                { key: 'confirmation', waitFor: ['output.confirmation'] }
            ]
        }
    ],
/*     layout: [
        { selector: '#header' },
        { selector: '#summary' },
        { selector: '#main' },
        { selector: '#footer', name: Footer }
    ], */
    templatesPath: {
        layout: './templates/layout/index',
        screens: './templates/BroadbandSignup/index',
        notFound: null
    },
    server: {
        url: 'https://ubio-application-bundle-dummy-server.glitch.me',
        path: '/create-job/sky'
    },
    predefinedData: {
        //local-data.js
    }
}