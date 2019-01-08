self.oninstall = (event) => {
    event.waitUntil(
        caches.open('static-v1').then((cache) => {
            return cache.addAll([
                '/',
                'index.html',
                'app.css',
                'close.svg',
                'funnel.svg',
                'app.js',
                'locations.json'
                // 'https://maps.googleapis.com/maps/api/js',
                // 'https://code.jquery.com/jquery-3.3.1.min.js',
                // 'https://en.wikipedia.org/w/api.php'
            
            ]);
        })
    );
};

self.onfetch = (event) => {
    event.respondWith(
        caches.match(event.request).then((response) => {
            if (response) return response;
            return fetch(event.request);
        })
    );
};