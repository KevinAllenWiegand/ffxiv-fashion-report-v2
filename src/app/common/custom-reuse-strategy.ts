import {
    ActivatedRouteSnapshot,
    DetachedRouteHandle,
    RouteReuseStrategy
} from "@angular/router";
import { ComponentRef, Injectable } from "@angular/core";

interface StoredRoute {
    route: ActivatedRouteSnapshot;
    handle: DetachedRouteHandle;
}

// Stolen from https://dev.to/this-is-angular/angular-lab-preserving-component-state-across-route-transitions-3f7j
//  https://stackblitz.com/edit/stackblitz-starters-93gnhp4k?file=src%2Fmain.ts,src%2Fcustom_reuse_strategy.ts
@Injectable({
    providedIn: 'root'
})
export class CustomReuseStrategy implements RouteReuseStrategy {
    storedRoutes: Record<string, StoredRoute | null> = {};

    // Should we store the route? Defaults to false.
    shouldDetach(route: ActivatedRouteSnapshot): boolean {
        return !!route.data['storeRoute'];
    }

    // Store the route
    store(route: ActivatedRouteSnapshot, handle: DetachedRouteHandle): void {
        // Ex. users/1, users/2, users/3, ...
        const key = getFullPath(route);
        this.storedRoutes[key] = { route, handle };
    }

    // Should we retrieve a route from the store?
    shouldAttach(route: ActivatedRouteSnapshot): boolean {
        const key = getFullPath(route);
        const isStored = !!route.routeConfig && !!this.storedRoutes[key];

        if (isStored) {
            // Compare params and queryParams.
            // Params, however, have already been compared because the key includes them.
            const paramsMatch = compareObjects(
                route.params,
                this.storedRoutes[key]!.route.params
            );
            const queryParamsMatch = compareObjects(
                route.queryParams,
                this.storedRoutes[key]!.route.queryParams
            );

            return paramsMatch && queryParamsMatch;
        }
        return false;
    }

    // Retrieve from the store (just the Handle)
    retrieve(route: ActivatedRouteSnapshot) {
        const key = getFullPath(route);
        if (!route.routeConfig || !this.storedRoutes[key]) return null;
        return this.storedRoutes[key].handle;
    }

    // Should the route be reused?
    shouldReuseRoute(
        previous: ActivatedRouteSnapshot,
        next: ActivatedRouteSnapshot
    ): boolean {
        const isSameConfig = previous.routeConfig === next.routeConfig;
        const shouldReuse = !next.data['noReuse'];
        return isSameConfig && shouldReuse;
    }

    /**
     * Destroys the components of all stored routes (resets the strategy).
     */
    clearAllRoutes() {
        for (const key in this.storedRoutes) {
            if (this.storedRoutes[key]!.handle) {
                this.destroyComponent(this.storedRoutes[key]!.handle);
            }
        }
        this.storedRoutes = {};
    }

    /**
     * Destroys the component of a particular route.
     */
    clearRoute(fullPath: string) {
        if (this.storedRoutes[fullPath]?.handle) {
            this.destroyComponent(this.storedRoutes[fullPath].handle);
            this.storedRoutes[fullPath] = null;
        }
    }

    /**
     * A bit of a hack: manually destroy a particular component.
     */
    private destroyComponent(handle: DetachedRouteHandle): void {
        const componentRef: ComponentRef<any> = (handle as any).componentRef;
        if (componentRef) {
            componentRef.destroy();
        }
    }
}

function compareObjects(a: any, b: any): boolean {
    return Object.keys(a).every(prop =>
        b.hasOwnProperty(prop) &&
        (typeof a[prop] === typeof b[prop]) &&
        (
            (typeof a[prop] === "object" && compareObjects(a[prop], b[prop])) ||
            (typeof a[prop] === "function" && a[prop].toString() === b[prop].toString()) ||
            a[prop] == b[prop]
        )
    );
}

/**
 * Returns the full Path of a route, as a string
 */
export function getFullPath(route: ActivatedRouteSnapshot): string {
    return route.pathFromRoot
        .map(v => v.url.map(segment => segment.toString()).join("/"))
        .join("/")
        .trim()
        .replace(/\/$/, ""); // Remove trailing slash
}