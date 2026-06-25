
# Quartz v5 & Docker Deployment

This branch is optimized for deploying **Quartz v5** using a containerized workflow. Because the core Docker image (`vasujain275/dockerized-quartz`) was originally designed around Quartz v4 logic, this repository includes custom runtime patches to natively support Quartz v5's plugin ecosystem and to fix webhook-triggered rebuilds.

---

## What the Patch Script Does (`build-quartz-patched.sh`)

In Quartz v4, the build process was a direct compilation step. Quartz v5 introduces a modular architecture that requires configuration-driven plugins to be fetched and verified before compiling. 

The included `build-quartz-patched.sh` script intercepts the container's internal build loop and performs the following sequence:
1. **Syncs Content:** Pulls down the latest updates from your remote notes repository if `VAULT_DO_GIT_PULL_ON_UPDATE` is enabled.
2. **Injects v5 Logic:** Executes `npx quartz plugin install --from-config` inside the workspace to dynamically populate the missing `.quartz/plugins` layer.
3. **Builds Site:** Standardizes the static build execution outputs seamlessly to the web server directory while safely maintaining your `apprise` notification alerts.

---

## What the Patch Server Does (`server.js`)

The image's built-in webhook listener accepts a `POST /rebuild/<secret>` request and triggers `build-quartz-patched.sh` to rebuild the site — but its default implementation waits for the entire build to finish before sending an HTTP response. On a full Quartz v5 build (plugin install + parse + emit), that easily exceeds GitHub's ~10 second webhook delivery timeout, so every push was reported as a failed delivery even though the rebuild succeeded moments later in the background.

The included `server.js` patches this by responding immediately once the secret is validated, then running the build asynchronously:
1. **Validates the secret:** Rejects with `403` if the path segment doesn't match `REBUILD_WEBHOOK_SECRET`.
2. **Responds immediately:** Sends `202 Accepted` before the build starts, so GitHub's webhook delivery succeeds instantly regardless of build duration.
3. **Builds in the background:** Runs `build-quartz-patched.sh` via `exec()` after the response is already sent, logging success or failure to the container's stdout/stderr rather than blocking the request.

> **Note:** because the response no longer waits on the build, a failed build will not be visible in GitHub's delivery status — check `docker logs` (or your `apprise` notification setup) if a rebuild doesn't show up on the live site.

---

## Getting Started

### Prerequisites
Make sure you keep the layout unified. The custom build script and webhook server **must reside in the exact same directory** as your active `docker-compose.yml` file so Docker can locate and bind-mount them successfully.

```text
your-workspace/
├── docker-compose.yml
├── build-quartz-patched.sh
└── server.js
```

> "[One] who works with the door open gets all kinds of interruptions, but [they] also occasionally gets clues as to what the world is and what might be important." — Richard Hamming

Quartz is a set of tools that helps you publish your [digital garden](https://jzhao.xyz/posts/networked-thought) and notes as a website for free.

🔗 Read the documentation and get started: https://quartz.jzhao.xyz/

[Join the Discord Community](https://discord.gg/cRFFHYye7t)

## Sponsors

<p align="center">
  <a href="https://github.com/sponsors/jackyzha0">
    <img src="https://cdn.jsdelivr.net/gh/jackyzha0/jackyzha0/sponsorkit/sponsors.svg" />
  </a>
</p>
