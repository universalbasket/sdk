import ProgressBar from './render-progress-bar.js';

// The router code. Takes a URL, checks against the list of supported routes and then renders the corresponding content page.
class Router {
    constructor(routes, notFoundTemplate) {
        this.routes = routes;
        this.notFoundTemplate = notFoundTemplate;

        const titles = Object.keys(routes)
            .map(key => routes[key])
            .filter(route => route.step != null && typeof route.step === 'number')
            .sort((a, b) => a.step - b.step)
            .map(r => r.title);

        this.progressBar = ProgressBar('#progress-bar', titles);
    }

    navigate() {
        const url = location.hash.slice(1).toLowerCase() || '/';
        const page = url.split('/')[1];
        // Parse the URL and if it has an id part, change it with the string ":id"
        const parsedURL = page ? '/' + page : '/';

        // Get the page from our hash of supported routes.
        // If the parsed URL is not in our list of supported routes, select the 404 page instead
        const route = this.routes[parsedURL] ? this.routes[parsedURL] : this.notFoundTemplate;

        route.renderer.init();
        this.progressBar.update(route.step);
    }
}

export default (routes, notFoundTemplate) => new Router(routes, notFoundTemplate);
