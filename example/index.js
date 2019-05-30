import { createApp } from '../index';
import CONFIG from './ubio.config';
import * as Layout from '../templates/layout/index';
import * as Screen from '../templates/BroadbandSignup/index';

const LayoutConfig = CONFIG.layout.map(l => {
    const template = Layout[l.name];
    if (!template && !l.mainTarget) {
        throw new Error(`Template for Layout ${l.name} is not found`);
    }

    return { ...l, template };
});

const SectionConfig = CONFIG.section.map(section => {
    const { screens = [] } = section;
    const screensWithTemplate = screens.map(s => {
        const template = Screen[s.name];
        if (!template) {
            throw new Error(`Template for Section ${s.name} is not found`);
        }
        return { ...s, template };
    });

    return { ...section, ...{ screens: screensWithTemplate }};
});
const Data = {
    initialInputs: CONFIG.initialInputs,
    severUrlPath: CONFIG.serverUrlPath
}
var app = createApp(SectionConfig, CONFIG.cache, LayoutConfig, Data, () => { console.log('finished!')});

app.init();
