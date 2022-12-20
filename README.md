# cf-workers

Demo space for cloudflare workers

![Visit](https://kv-image-counter.alan-verga.workers.dev)

OK, so I didn't realize markdown images are cached by github, so this isn't
accurate. But concept stands, moving on.


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

---

### KV


#### CRUD and keys

* Create a namespace (`wrangler kv:namespace create "MY_KV"`), or via dashboard
* To bind to worker, place name, id in the worker's `wrangler.toml` config.

```
kv_namespaces = [  { binding = "MY_KV", id = "sldfalksdjlkj23u20938203", preview_id = "dlkfajsdfjlskd" }]
```

* list: `wrangkler kv:namespace list`
* put:  `wrangler kv:key put test_key 1234 --namespace-id sldfalksdjlkj23u20938203`
* get:  ` wrangler kv:key get test_key --namespace-id sldfalksdjlkj23u20938203`

#### "Environments"

* Need to use analogous preview KV namespace in wrangler dev server environment by
  appending `--preview`
  * `wrangler kv:namespace create TEST_KV --preview `
  * `preview_id` is another key-value pair assigned to same binding in
    `wrangler.toml`. (see above)
  * the `preview_id` is bucket for dev mode, and accesses a separate store from
    the prod - `id` store.
* Note the `preview_id` is independent / separate from the larger wrangler
  `[env.*]` option.



#### Storage

* Cache: local store, not distributed
* KV: Distributed, high read focus.
* Durable Obj: Global Consistency / Transaction is paramount - JS Obj
* R2: s3 clone

---

### Pages

Easy dump to served static site:
* Create index file in directory, e.g. `/basic-pages/index.html`
* Publish it: `wrangler pages publish basic-pages`
  * Takes a minute, but eventually the url will be generated
  * Project will be created automaticaly
* For dev server: `wrangler pages dev basic-pages --port 8787`
  * Note port is explicitly set to 8787 - pages dev defaults to 8788.
  * Just want to reuse our mapped docker ports (or can add 8788)
* Two deploy options:
    * CLI via `wrangler pages publish` which uploads directory
    * Github integration via Cloudflare Integration on Github

#### create-react-app node

Docker image needs to install/run `npx create-react-app` as unprivileged user.

`su node`
`npx create-react-app <name>`

* Run dev server: `npm start`
* Build: `npm build`
* Create CF pages: `wrangler pages project create <name/dir>`
* Publish static build: `wrangler pages publish react-pages/build`

#### Wrangler Pages CLI

The CLI is in beta, so some behavior issues on `wrangler pages publish <directory>`:

* To assign a project: `--project-name`
* To assign production / preview: `--branch <branch set on create>`
  * For `production` choose the production branch input when running `wrangler pages project create`.
  * Otherwise the current branch deployed will default to a `preview` branch.

##### Important: Make sure to note the production branch when on project create

* There doesn't seem to be a way to list this, except to manually upload a
  directory and see what the dashboard says

* Safest to just assume defaults: branch `main` as deploy branch.


#### Github Integration Cloudflare App

* Install and authorize on a per repo basis
* Easier than github actions - no token/secret to manage, or .github workflows.
* For react app, make sure directory structure matches
  * `build` directory is relative to specificed root directory (advanced
    setting)
* Dashboard configuration is full-featured; has "Builds & Deployments" config:
  * Allows change of production branch, directories, hooks.
