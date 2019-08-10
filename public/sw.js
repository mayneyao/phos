self.addEventListener('fetch', function (event) {
  if (event.request.url.includes("https://notion.gine.workers.dev/api/v3")) {
    console.log(event.request.url)
    event.respondWith(
      caches.open('notion-data').then(function (cache) {
        return fetch(event.request).then(function (response) {
          cache.put(event.request, response.clone());
          return response;
        });
      })
    );
  }
});