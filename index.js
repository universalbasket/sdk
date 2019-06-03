import { createApp } from './src/main';
import CONFIG from './ubio.config';

// I'd like this part is done by script
// if there's an error(i.e. Template for ... not found), it stops build
// or we add tests that checking all the templates needed for given configuration

// TODO: ideally the directory is will be written in the config
// or we designate the directory like below and force them to add the templates under the directory
import * as LayoutTemplates from './templates/layout/index';
import * as SectionTemplates from './templates/BroadbandSignup/sections/index';
// confirmation, 404, error page will be added

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
