/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run `npx wrangler dev src/index.js` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `npx wrangler publish src/index.js --name my-worker` to publish your worker
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */

export default {
    async fetch(request, env, ctx) {
        //wranger secret put TEST_SECRET_KEY or via dash
        console.log("TEST_SECRET_KEY", env.TEST_SECRET_KEY);

        return new Response(`Hello World from basic-test! Environment is: ${env.ENVIRONMENT}`);
    },
};
