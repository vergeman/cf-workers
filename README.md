# cf-workers

Demo space for cloudflare workers

## Setup

* Ensure `localhost:8976` is mapped on docker container for `wrangler login`
  oauth sequence. Make sure to `docker-compose run --service-ports app zsh` to
  pass ports.  
* Ensure `localhost:8787` is mapped on docker container for wrangler dev server.
  * dev server does hot reload
* select worker directory e.g. `/basic-test`
  * `wranger dev`

## Directory Structure
```
/                    # container root
/basic-test:         # individual worker - directory with own node env

```

## Workflow

* create worker: `wrangler init <name>`
* change to worker directory: (e.g. cd basic-test)
  * `npm test`
  * `npm start`: runs local web server (equivalent to `wrangler dev`)

## Deploy
* use `wrangler publish` references login credentials (vs `npm run deploy`)
* Create a subdomain for account: `<account-subdomain>.workers.dev`
  * NB: takes a while to load a subdomain, but publish-update is quick
* Worker access point: `<worker-name>-<subdomain>.workers.dev`
  * e.g. _basic-test.alan-verga.workers.dev_
* `wrangler publish` to deploy to endpoint
