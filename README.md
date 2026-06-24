
# Quartz v5 & Docker Deployment

This branch is optimized for deploying **Quartz v5** using a containerized workflow. Because the core Docker image (`vasujain275/dockerized-quartz`) was originally designed around Quartz v4 logic, this repository includes a custom runtime patch to natively support Quartz v5's plugin ecosystem.

---

## What the Patch Script Does (`build-quartz-patched.sh`)

In Quartz v4, the build process was a direct compilation step. Quartz v5 introduces a modular architecture that requires configuration-driven plugins to be fetched and verified before compiling. 

The included `build-quartz-patched.sh` script intercepts the container's internal build loop and performs the following sequence:
1. **Syncs Content:** Pulls down the latest updates from your remote notes repository if `VAULT_DO_GIT_PULL_ON_UPDATE` is enabled.
2. **Injects v5 Logic:** Executes `npx quartz plugin install --from-config` inside the workspace to dynamically populate the missing `.quartz/plugins` layer.
3. **Builds Site:** Standardizes the static build execution outputs seamlessly to the web server directory while safely maintaining your `apprise` notification alerts.

---

## Getting Started

### Prerequisites
Make sure you keep the layout unified. The custom build script **must reside in the exact same directory** as your active `docker-compose.yml` file so Docker can locate and bind-mount it successfully.

```text
your-workspace/
├── docker-compose.yml
└── build-quartz-patched.sh
```

> “[One] who works with the door open gets all kinds of interruptions, but [they] also occasionally gets clues as to what the world is and what might be important.” — Richard Hamming

Quartz is a set of tools that helps you publish your [digital garden](https://jzhao.xyz/posts/networked-thought) and notes as a website for free.

🔗 Read the documentation and get started: https://quartz.jzhao.xyz/

[Join the Discord Community](https://discord.gg/cRFFHYye7t)

## Sponsors

<p align="center">
  <a href="https://github.com/sponsors/jackyzha0">
    <img src="https://cdn.jsdelivr.net/gh/jackyzha0/jackyzha0/sponsorkit/sponsors.svg" />
  </a>
</p>
