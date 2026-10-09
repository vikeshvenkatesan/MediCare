// ============================================
// Medicare – SPA Router (Hash-based)
// ============================================

const routes = {};
let currentRoute = null;

export function registerRoute(path, handler) {
    routes[path] = handler;
}

export function navigate(path) {
    window.location.hash = path;
}

export function getCurrentRoute() {
    return currentRoute;
}

function handleRoute() {
    const hash = window.location.hash.slice(1) || 'login';
    const [path, ...params] = hash.split('/');

    if (routes[path]) {
        currentRoute = path;
        const container = document.getElementById('screen-container');
        container.innerHTML = '';
        routes[path](container, params);

        // Update nav active state
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.toggle('active', item.dataset.route === path);
        });

        // Show/hide bottom nav
        const nav = document.getElementById('bottom-nav');
        const hideNavScreens = ['login', 'role-selection', 'doctor-registration'];
        if (hideNavScreens.includes(path)) {
            nav.classList.add('hidden');
        } else {
            nav.classList.remove('hidden');
        }
    }
}

export function initRouter() {
    window.addEventListener('hashchange', handleRoute);

    // Nav button clicks
    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', () => {
            navigate(item.dataset.route);
        });
    });

    handleRoute();
}
