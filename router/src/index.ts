/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run `wrangler dev src/index.ts` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `wrangler publish src/index.ts --name my-worker` to publish your worker
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */

import { Router, IRequest } from "itty-router";
const router = Router();

router
  .get?.("/", async () => {
    return new Response(
      "Hello, world! This is the / page of your Worker template."
    );
  })
  .get?.("/test", async () => {
    return new Response(
      "Hello, world! This is the /test page of your Worker template."
    );
  })
  .get?.("*", async () => {
      return new Response("not found", {status: 404});
  });

export interface Env {
  // Example binding to KV. Learn more at https://developers.cloudflare.com/workers/runtime-apis/kv/
  // MY_KV_NAMESPACE: KVNamespace;
  //
  // Example binding to Durable Object. Learn more at https://developers.cloudflare.com/workers/runtime-apis/durable-objects/
  // MY_DURABLE_OBJECT: DurableObjectNamespace;
  //
  // Example binding to R2. Learn more at https://developers.cloudflare.com/workers/runtime-apis/r2/
  // MY_BUCKET: R2Bucket;
}

export default {
  async fetch(
    request: IRequest,
    env: Env,
    ctx: ExecutionContext
  ): Promise<Response> {
    return router.handle(request);
  },
};
