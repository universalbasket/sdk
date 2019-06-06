import { createApp } from './src/main.js';
import CONFIG from './templates/$DOMAIN/ubio.config.js';

import * as LayoutTemplates from './templates/$DOMAIN/layout/index.js';
import * as SectionTemplates from './templates/$DOMAIN/sections/index.js';

const Layout = CONFIG.layout.map(l => {
    const template = LayoutTemplates[l.name];
    if (!template && !l.mainTarget) {
        throw new Error(`Template for Layout ${l.name} is not found`);
    }

    return { ...l, template };
});

const Pages = CONFIG.pages.map(page => {
    const { sections = [] } = page;
    const sectionsWithTemplate = sections.map(s => {
        const template = SectionTemplates[s.name];
        if (!template) {
            throw new Error(`Template for page ${s.name} is not found`);
        }
        return { ...s, template };
    });

    return { ...page, ...{ sections: sectionsWithTemplate }};
});

var app = createApp({ pages: Pages, cache: CONFIG.cache, layout: Layout, data: CONFIG.data }, () => { console.log('finished!')});

app.init();