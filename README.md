# cf-workers

Demo space for cloudflare workers

## Setup

* Ensure `localhost:8976` is mapped on docker container for `wrangler login`
  oauth sequence. Make sure to `docker-compose run --service-ports app zsh` to
  pass ports.
* Ensure `localhost:8787` is mapped on docker container for wrangler dev server.
  * dev server does hot reload
* `wrangler login` -> copy link to browser session to trigger oAuth.
* Select worker directory e.g. `/basic-test`
  * `wranger dev`

## Directory Structure

Each `wrangler init <project>` will create a subdirectory:

```
/                    # container root
/basic-test:         # individual worker: directory with own node env

```

## Workflow

* Create worker: `wrangler init <name>`
* Subdirectory serves as url prefix for the worker: `<prefix>-<subdomain>-workers.dev`
* Change to worker directory: (e.g. cd basic-test)
  * `npm test`
  * `npm start`: runs local web server (equivalent to `wrangler dev`)

Generally best to directly use `wranger` CLI.

## Deploy

* Use `wrangler publish`: references login credentials (vs `npm run deploy`
  which may prompt for another login)

### Initial Setup - Subdomain per Account

* Create a subdomain for account: `<subdomain>.workers.dev`
  * NB: takes a while to load a subdomain, but publish-update is quick
* Worker access point: `<worker>-<subdomain>.workers.dev`
  * e.g. _basic-test.alan-verga.workers.dev_

---

#### Service vs Module Workers

* Service: `fetch` uses addEventlistener pattern
* Module: `fetch` async function exported directly

#### Environments

* In `wrangler.toml` add as `[env.<name>]`
  * Env works like docker-compose; inherits non-environmental specified
    variables
* Module workers access environmental variables via `env` parameter
* Service workers access environmental variables as a global variable


#### Variables and Secrets

* Environmental variables are in dash or in `wranger.toml`
* Secrets: `wrangler secret put TEST_SECRET_KEY`
  * `wrangler secret list`; keynames also visible on dash (but not values)
  * Access like an env variable: env.TEST_SECRET_KEY

#### Logging

* `console.log()`: outputs to dev server console, and `wrangler tail` for worker's project
  * it doesn't appear in typical console - as expected, it returns the computed response.
* `wrangler tail`: deployed console.log output
