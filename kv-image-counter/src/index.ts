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

async function incrementKey(NAMESPACE:KVNamespace, key:string): Promise<number> {
    let count = await NAMESPACE.get(key) || "0";
    let value = parseInt(count);
    value++;
    return value;
}


export default {
  async fetch(
    request: Request,
    env: Env,
    ctx: ExecutionContext
  ): Promise<Response> {

      const headers = {"content-type": "application/json"};

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

      let value = await incrementKey(env.IMAGE_COUNTER, key)
      let totalValue = await incrementKey(env.IMAGE_COUNTER, totalKey);

      const res = {
          key, value, totalValue
      }

      await Promise.all([
          env.IMAGE_COUNTER.put(key, value.toString()),
          env.IMAGE_COUNTER.put(totalKey, totalValue.toString())
      ]);

      return new Response(JSON.stringify(res), {headers});
  },
};
