import { NotFound404 } from './src/sectionRenderer'
// The router code. Takes a URL, checks against the list of supported routes and then renders the corresponding content page.
export default (routes) => {

    // Get the parsed URl from the addressbar
    let request = parseRequestURL()

    // Parse the URL and if it has an id part, change it with the string ":id"
    let parsedURL = (request.section ? '/' + request.section : '/') + (request.input ? '/' + request.input : '')

    // Get the page from our hash of supported routes.
    // If the parsed URL is not in our list of supported routes, select the 404 page instead
    let page = routes[parsedURL] ? routes[parsedURL] : NotFound404

    page(() => { /*render*/ });
}

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