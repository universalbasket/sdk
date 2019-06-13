import { header, summary, footer } from './broadband-signup/layout/index.js';
import {
    landline,
    selectedAddress,
    aboutYou,
    installation,
    setupDates,
    checkout,
    finalPriceConsent,
    confirmation
} from './broadband-signup/sections/index.js';

export default {
    layout: {
        header,
        summary,
        footer
    },
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
            key: 'installationOptions',
            sourceInputKeys: []
        },
        {
            key: 'finalPrice',
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
                {
                    name: 'landline',
                    template: landline,
                    waitFor: ['local.landlineOptions']
                },
                {
                    name: 'selected-address',
                    template: selectedAddress,
                    waitFor: ['output.availableAddresses', 'output.availableInstallationAddresses']
                }
            ]
        },
        {
            name: 'about-you',
            route: '/about-you',
            title: 'About You',
            sections: [
                {
                    name: 'about-you',
                    template: aboutYou
                },
                {
                    name: 'installation',
                    template: installation,
                    waitFor: ['output.installationOptions']
                }
            ]
        },
        {
            name: 'setup-dates',
            route: '/setup-dates',
            title: 'Setup dates for your packages',
            sections: [
                {
                    name: 'setup-dates',
                    template: setupDates,
                    waitFor: ['output.availableBroadbandSetupDates']
                }
            ]
        },
        {
            name: 'checkout',
            route: '/checkout',
            title: 'Payment details',
            sections: [
                {
                    name: 'checkout',
                    template: checkout,
                    waitFor: ['_.otp']
                },
                {
                    name: 'final-price-consent',
                    template: finalPriceConsent,
                    waitFor: ['output.oneOffCosts', 'output.finalPrice']
                }
            ]
        },
        {
            name: 'confirmation',
            route: '/confirmation',
            title: 'Confirmation',
            sections: [
                {
                    name: 'confirmation',
                    template: confirmation,
                    waitFor: ['outputs.confirmation']
                }
            ]
        }
    ],
    data: {
        serverUrlPath: 'https://ubio-application-bundle-dummy-server.glitch.me/create-job/sky',
        initialInputs: {
            url: 'https://www.moneysupermarket.com/broadband/goto/?linktrackerid=8307&productname=Sky+Entertainment+%2B+Broadband+Essential+%2B+Talk+Anytime+Extra&bundleid=58&clickout=00000000-0000-0000-0000-000000000003&dtluid=SqADhopj*6Q*eioD&location=',
            options: {
                marketingContact: true,
                success: true,
                directoryListing: true,
                addressSelection: true,
                moveInDateSelection: true,
                keepLandlineNumber: false,
                screenshots: false,
                testingFlow: false
            },
            selectedBroadbandPackage: {
                name: 'Sky Broadband Essential'
            },
            selectedTvPackages: [{
                name: 'Sky Entertainment'
            }],
            selectedPhonePackage: {
                name: 'Sky Talk Anytime Extra'
            }
        },
        local: {
            currencyCode: 'gbp',
            landlineOptions: {
                'justMoved': true,
                'sharedProperty': false,
                'restartLine': false,
                'additionalLine': false
            },
            finalPrice: {
                value: 2000,
                countryCode: 'gbp'
            }
        }
    }
};
