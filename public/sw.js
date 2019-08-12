self.addEventListener('fetch', function (event) {

  let url = event.request.url
  if (url.includes("https://notion.gine.workers.dev/api/v3")) {
    console.log(event.request.url)
    event.respondWith(
      caches.match(event.request).then(res => {
        return res || fetch(event.request).then(function (r) {
          caches.open('notion-data').then(function (cache) {
            cache.put(event.request, r);
          });
          return r.clone();
        })
      })
    )
  } else if (url.startsWith("https://s3.us-west-2.amazonaws.com/secure.notion-static.com/")) {
    console.log(url)
  }
});