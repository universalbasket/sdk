import { header, summary, footer } from './broadband-signup-nl/layout/index.js';
import {
    landline,
    selectedAddress,
    broadbandAndPhone,
    tv,
    aboutYou,
    directDebit,
    setupDates,
    finalPriceConsent,
    confirmation
} from './broadband-signup-nl/sections/index.js';
import error from './broadband-signup-nl/error.js';
import notFound from './broadband-signup-nl/not-found.js';

export default {
    layout: {
        header,
        summary,
        notFound,
        footer
    },
    cache: [

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
                    waitFor: ['output.availableAddresses']
                }
            ]
        },
        {
            name: 'packages',
            route: '/packages',
            title: 'Packages',
            sections: [
                {
                    name: 'broadbandAndPhone',
                    template: broadbandAndPhone,
                    waitFor: ['output.availableBroadbandPackages', 'output.availableBroadbandExtras', 'output.availablePhonePackages', 'output.availablePhoneExtras']
                },
                {
                    name: 'tv',
                    template: tv,
                    waitFor: ['output.availableTvPackages', 'output.availableTvExtras']
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
                    name: 'directDebit',
                    template: directDebit,
                    waitFor: []
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
            name: 'confirmation',
            route: '/confirmation',
            title: 'Confirmation',
            sections: [
                {
                    name: 'confirmation',
                    template: confirmation,
                    waitFor: ['outputs.confirmation']
                }
            ],
            excludeStep: true
        }
    ],
    error
};
