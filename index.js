import router from './router';

import { AboutYourPet, AboutYou, aboutYourPolicy } from './src/sectionRenderer';
import sdk from './src/sdk';

const routes = {
    '/': () => { sdk.create().then(() => { window.location.hash = '/about-your-pet'; })},
    '/about-your-pet': AboutYourPet,
    '/about-you': AboutYou,
    '/about-your-policy': aboutYourPolicy,
    '/finish': () => { console.log('finished') }
};

// Listen on hash change:
window.addEventListener('hashchange', () => router(routes));

// Listen on page load:
window.addEventListener('load', () => router(routes));

//
window.addEventListener('beforeunload', function (e) {
    // Cancel the job
    console.log('unload!');
});
