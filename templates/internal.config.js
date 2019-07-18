import { header, summary, footer } from './internal/layout/index.js';
import tdsTest from './internal/sections/tds-test.js';
import error from './internal/error.js';
import notFound from './internal/not-found.js';

export default {
    layout: {
        header,
        summary,
        footer
    },
    cache: [],
    pages: [
        {
            name: 'test',
            route: '/test',
            title: '3DS test',
            sections: [
                {
                    name: '3D Secure Test',
                    template: tdsTest,
                    waitFor: ['_.otp']
                }
            ]
        }
    ],
    notFound,
    error
};
