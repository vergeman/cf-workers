/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run `wrangler dev src/index.ts` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `wrangler publish src/index.ts --name my-worker` to publish your worker
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */

export interface Env {
  // Example binding to KV. Learn more at https://developers.cloudflare.com/workers/runtime-apis/kv/
  IMAGE_COUNTER: KVNamespace;
  //
  // Example binding to Durable Object. Learn more at https://developers.cloudflare.com/workers/runtime-apis/durable-objects/
  // MY_DURABLE_OBJECT: DurableObjectNamespace;
  //
  // Example binding to R2. Learn more at https://developers.cloudflare.com/workers/runtime-apis/r2/
  // MY_BUCKET: R2Bucket;
}

/*
 * This is a hit-counter using cf workers and KV
 * hopefully this works from README.md
 */


async function incrementKey(NAMESPACE:KVNamespace, key:string): Promise<number> {
    let count = await NAMESPACE.get(key) || "0";
    let value = parseInt(count);
    value++;
    return value;
}


/*
 * ripped off from https://badgen.net/
 * e.g. https://badgen.net/badge/icon/visitor%201000/red?icon=codebeat&label
 */

function generateIcon(count: number) {

    let svg = `
    <svg width="97" height="20" viewBox="0 0 970 200" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" role="img" aria-label="visit ${count}">
  <title>visit ${count}</title>
  <linearGradient id="a" x2="0" y2="100%">
    <stop offset="0" stop-opacity=".1" stop-color="#EEE"/>
    <stop offset="1" stop-opacity=".1"/>
  </linearGradient>
  <mask id="m"><rect width="970" height="200" rx="30" fill="#FFF"/></mask>
  <g mask="url(#m)">
    <rect width="212" height="200" fill="#555"/>
    <rect width="758" height="200" fill="#E43" x="212"/>
    <rect width="970" height="200" fill="url(#a)"/>
  </g>
  <g aria-hidden="true" fill="#fff" text-anchor="start" font-family="Verdana,DejaVu Sans,sans-serif" font-size="110">
    <text x="172" y="148" textLength="0" fill="#000" opacity="0.25"></text>
    <text x="162" y="138" textLength="0"></text>
    <text x="267" y="148" textLength="658" fill="#000" opacity="0.25">Visit ${count}</text>
    <text x="257" y="138" textLength="658">Visit ${count}</text>
  </g>
  <image x="40" y="35" width="130" height="130" xlink:href="data:image/svg+xml;base64,PHN2ZyBmaWxsPSIjZmZmIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAzMzEgMzMxIj48cGF0aCBjbGFzcz0ic29sby1sb2dvLTAiIGQ9Ik03NC42IDExNS44bDM2LjEgNzUuMyA2Ni0xNTAuMyA3Mi44IDE3OS43IDIzLjItNTIuMkgzMzF2LTIuOEMzMzEgNzQuMSAyNTYuOSAwIDE2NS41IDBTMCA3NC4xIDAgMTY1LjV2Mi44aDQ3LjhsMjYuOC01Mi41eiIvPjxwYXRoIGNsYXNzPSJzb2xvLWxvZ28tMCIgZD0iTTI0OSAyNjIuN2wtNzMuNC0xNDEuOS02NS4zIDExNy41TDc0IDE1NC42bC0xNy43IDM0LjhIMS43QzEzLjMgMjY5LjUgODIuMiAzMzEgMTY1LjUgMzMxczE1Mi4zLTYxLjYgMTYzLjgtMTQxLjdoLTQ1LjZMMjQ5IDI2Mi43eiIvPjwvc3ZnPgo="/>
</svg>`;
    return svg;
}

export default {
  async fetch(
    request: Request,
    env: Env,
    ctx: ExecutionContext
  ): Promise<Response> {

      //headers for "visitor" and total visits (TOTAL_COUNT)
      const key = [
          request.cf.postalCode,
          request.cf.metroCode,
          request.cf.city,
          request.cf.regionCode,
          request.cf.longitude,
          request.cf.latitude
      ].join('-');

      const totalKey = "TOTAL_COUNT";

      //increment counts per "visitor" and total
      let value = await incrementKey(env.IMAGE_COUNTER, key)
      let totalValue = await incrementKey(env.IMAGE_COUNTER, totalKey);

      const res = {
          key, value, totalValue
      }

      await Promise.all([
          env.IMAGE_COUNTER.put(key, value.toString()),
          env.IMAGE_COUNTER.put(totalKey, totalValue.toString())
      ]);

      console.log(res);

      const headers = {
          "content-type": "image/svg+xml",
          "cache-control": "no cache",
          "expires": 0,
      };
      const svg = generateIcon(totalValue);
      return new Response(svg, {headers});
  },
};
