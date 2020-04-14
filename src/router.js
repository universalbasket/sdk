// The router code. Takes a URL, checks against the list of supported routes and then renders the corresponding content page.
class Router {
    constructor(routes) {
        this.routes = routes;
    }

    navigate() {
        const hash = location.hash.slice(1).toLowerCase() || '/';
        
        // Get the page from our hash of supported routes.
        // If the parsed URL is not in our list of supported routes, select the 404 page instead
        let route = this.routes.find((route) => { return route.hash.toLowerCase() === hash.toLowerCase() });

        // if there is no route, use the notFound route
        if (!route) {
            route = this.routes.find((route) => { return route.hash === 'notFound'});
        }

        // render the current route - this will replace the html of the sdk
        route.controller.render();
    }

    isCurrentRoot() {
        return !window.location.hash || window.location.hash.slice(1) === '/';
    }
}

export default (routes) => new Router(routes);
