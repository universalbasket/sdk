export default {
    cache: [
        {
            key: 'priceBreakdown',
            sourceInputKeys: ['selectedOption1', 'selectedOption2']
        },
        {
            key: 'availableCovers',
            sourceInputKeys: []
        },
        {
            key: 'availableVetPaymentTerms',
            sourceInputKeys: ['selectedCover']
        },
        {
            key: 'availablePaymentTerms',
            sourceInputKeys: []
        }
    ],
    pages:[
        {
            name: 'aboutYourPet',
            route: '/about-your-pet',
            title: 'About Your Pet',
            sections: [
                { name: 'pets', waitFor: ['local.availableBreedTypes'] }
            ]
        },
        {
            name: 'aboutYou',
            route: '/about-you',
            title: 'About You',
            sections: [
                { name: 'aboutYou' },
                { name: 'selectedAddress', waitFor: ['output.availableAddresses'] }
            ]
        },
        {
            name: 'yourPolicy',
            route: '/your-policy',
            title: 'Your Policy',
            sections: [
                { name: 'policyOptions', waitFor: ['cache.availableCovers', 'cache.availablePaymentTerms'] },
                /* { name: 'selectedVetPaymentTerm', waitFor: ['output.availableVetPaymentTerms'] }, */
                { name: 'selectedCoverType', waitFor: ['output.availableCoverTypes'] },
/*                 { name: 'selectedVoluntaryExcess', waitFor: ['output.availableVoluntaryExcesses'] }, */
                { name: 'selectedCoverOptions', waitFor: ['output.availableCoverOptions'] },
                /* { name: 'selectedVetFee', waitFor: 'output.availableVetFees' } */
            ]
        },
        {
            name: 'paymentDetail',
            route: '/payment',
            title: 'Payment Details',
            sections: [
                { name: 'checkout', waitFor: ['_.otp'] },
                { name: 'directDebit', waitFor: ['input.selectedPaymentTerm'] },
                { name: 'finalPriceConsent', waitFor: ['output.estimatedPrice', 'output.finalPrice'] },
            ]
        },
        {
            name: 'confirmation',
            route: '/confirmation',
            title: 'Confirmation',
            sections: [
                { name: 'confirmation', waitFor: ['output.purchaseConfirmation'] },
            ]
    }],
    data: {
        serverUrlPath: 'https://ubio-application-bundle-dummy-server.glitch.me/create-job',
        initialInputs: {
            url: 'https://pet.morethan.com/h5/pet/step-1?path=%2FquoteAndBuy.do%3Fe%3De1s1%26curPage%3DcaptureDetails'
        },
        local: {
            currencyCode: 'gbp',
            availableBreedTypes: {
                "cat": [
                    "Pedigree",
                    "Non-Pedigree"
                ],
                "dog": [
                    "Cross Breed",
                    "Pedigree",
                    "Small mixed breed (up to 10kg)",
                    "Medium mixed breed (10 - 20kg)",
                    "Large mixed breed (above 20kg)"
                ]
            }
        }
    }
}
