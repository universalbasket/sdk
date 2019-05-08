import sdk from './src/core';
import { AboutYourPet, AboutYou } from './section';
import templates from './templates/index';

const routes = {
    '/'             : () => { sdk.create().then(() => { window.location.hash = '/about-your-pet'; })},
    '/about-your-pet': AboutYourPet,
    '/about-you': AboutYou
};

// The router code. Takes a URL, checks against the list of supported routes and then renders the corresponding content page.
const router = async () => {

    // Get the parsed URl from the addressbar
    let request = parseRequestURL()

    // Parse the URL and if it has an id part, change it with the string ":id"
    let parsedURL = (request.section ? '/' + request.section : '/') + (request.input ? '/' + request.input : '')

    // Get the page from our hash of supported routes.
    // If the parsed URL is not in our list of supported routes, select the 404 page instead
    let page = routes[parsedURL] ? routes[parsedURL] : templates.fallback()

    page(() => {
        console.log('first section finished!');
        window.location.hash = '/about-you';
    });
}

// Listen on hash change:
window.addEventListener('hashchange', router);

// Listen on page load:
window.addEventListener('load', router);

function parseRequestURL() {

    let url = location.hash.slice(1).toLowerCase() || '/';
    let r = url.split("/")
    let request = {
        section    : null,
        input      : null
    }
    request.section    = r[1]
    request.input      = r[2]

    return request
}