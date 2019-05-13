import sdk from './src/sdk';
import router from './router';
import { render } from './src/lit-html';

import Summary from './templates/summary';
import Header from './templates/header';
import Footer from './templates/footer';

import { AboutYourPet, AboutYou, aboutYourPolicy } from './src/sectionRenderer';

render(Header(), document.querySelector('#header'));
render(Summary(), document.querySelector('#summary'));
render(Footer(), document.querySelector('#footer'));

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

/** TODOS:
 * need to navigate to awaitingInput's page, when waiting for the output
 * need to assign all the sub-route so that they can navigate directly there
 * gets output from previous-input-output as well
 * CSS - responsive
 * (?) Should we give a flexibility of showing some inputs together?
 */