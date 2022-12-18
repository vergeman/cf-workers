# cf-workers

Demo space for cloudflare workers

## Setup

* Ensure `localhost:8976` is mapped on docker container for `wrangler login`
  oauth sequence.
* Ensure `localhost:8787` is mapped on docker container for wrangler dev server.
  * dev server does hot reload
* select worker directory e.g. `/basic-test`
  * `wranger dev`

## Directory Structure
```
/                    # container root
/basic-test:         # individual worker - own node env

```

## Workflow

* Create a subdomain for account: `<account-subdomain>.workers.dev`
  * NB: takes a while to load a subdomain, but publish-update is quick
* Worker access point: `<worker-name>-<subdomain>.workers.dev`
  * e.g. _basic-test.alan-verga.workers.dev_
* `wranler publish` to deploy to endpoint
