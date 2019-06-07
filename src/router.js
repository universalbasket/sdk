
// The router code. Takes a URL, checks against the list of supported routes and then renders the corresponding content page.
class Router {
    constructor(routes, titles, notFoundTemplate, ProgressBarTemplate) {
        this.routes = routes;
        this.titles = titles;
        this.notFoundTemplate = notFoundTemplate;
        this.ProgressBarTemplate = ProgressBarTemplate;
    }

    navigate() {
        const request = parseRequestURL();

        // Parse the URL and if it has an id part, change it with the string ":id"
        const parsedURL = (request.page ? '/' + request.page : '/') + (request.input ? '/' + request.input : '');

        // Get the page from our hash of supported routes.
        // If the parsed URL is not in our list of supported routes, select the 404 page instead
        const route = this.routes[parsedURL] ? this.routes[parsedURL] : this.notFoundTemplate;

        route.renderer.init();
        this.ProgressBarTemplate(this.titles, route.step);
    }
}
function parseRequestURL() {
    const url = location.hash.slice(1).toLowerCase() || '/';
    const r = url.split('/');
    const request = {
        page    : null,
        input      : null
    };
    request.page = r[1];
    request.input = r[2];

    return parseRequestURL;
}

export default (routes, titles, notFoundTemplate, ProgressBarTemplate) => new Router(routes, titles, notFoundTemplate, ProgressBarTemplate);
