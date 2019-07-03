import { header, summary, footer, notFound, error } from './internal/layout/index.js';
import tdsTest from './internal/sections/tds-test.js';

export default {
    layout: {
        header,
        summary,
        footer,
        notFound,
        error
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
    ]
};
