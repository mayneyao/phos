
if (workbox) {
    console.log(`Yay! Workbox is loaded 🎉`);
    workbox.core.setCacheNameDetails({
        prefix: 'phos',
        suffix: 'v2'
    });

    // 优先从缓存中获取 API 基础数据，然后获取新的数据更新缓存
    workbox.routing.registerRoute(
        ({ url, event }) => {
            if (url.pathname.startsWith("/api/v3")) {
                return true
            }
        },
        new workbox.strategies.StaleWhileRevalidate(),
    );

    // 优先从缓存中获取 
    workbox.routing.registerRoute(
        ({ url, event }) => {
            if (url.href.startsWith("https://s3.us-west-2.amazonaws.com/") ||
                url.href.startsWith("https://www.notion.so/signed") ||
                url.href.startsWith("https://notion.so/signed/")
            ) {
                return true
            }
        },
        new workbox.strategies.CacheFirst({
            plugins: [
                // 成功响应的文件可以被缓存 有时候会返回 206 部分内容也缓存
                new workbox.cacheableResponse.Plugin({
                    statuses: [0, 210]
                })
            ]
        }),
    );
}
