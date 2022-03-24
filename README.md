# git-local-devops

[![quality](https://img.shields.io/github/workflow/status/firecow/git-local-devops/Quality)](https://github.com/firecow/git-local-devops/actions)
[![license](https://img.shields.io/github/license/firecow/git-local-devops)](https://npmjs.org/package/git-local-devops)
[![Renovate](https://img.shields.io/badge/renovate-enabled-brightgreen.svg)](https://renovatebot.com)
[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=firecow_git-local-devops&metric=alert_status)](https://sonarcloud.io/dashboard?id=firecow_git-local-devops)
[![Coverage](https://sonarcloud.io/api/project_badges/measure?project=firecow_git-local-devops&metric=coverage)](https://sonarcloud.io/dashboard?id=firecow_git-local-devops)
[![Code Smells](https://sonarcloud.io/api/project_badges/measure?project=firecow_git-local-devops&metric=code_smells)](https://sonarcloud.io/dashboard?id=firecow_git-local-devops)

## Config setup

Put `.git-local-devops.yml` in `~/git-local-devops` or another user owned folder.

```
---
startup:
  # Used to check host machine for various requirements. 
  - { argv: ["git", "--version"], failMessage: "Git isn't installed on the system" }
  - { argv: ["docker", "--version"], failMessage: "Docker isn't installed on the system" }
  - { argv: ["docker", "login", "registry.gitlab.com"], failMessage: "You must be logged in on registry.gitlab.com to fetch docker images" }

projects:
  example:
    remote: git@gitlab.com:firecow/example.git
    default_branch: main
    priority: 0
    scripts:
      up:
        firecow.dk: ["bash", "-c", "start-docker-stack.sh"]
        firecow.net: ["docker-compose", "up"]
      down:
        firecow.dk: ["docker", "stack", "rm", "firecow.dk"]
        firecow.net: ["docker-compose", "down"]
```

You can also use remote config files if you put `.git-local-devops-env` in `~/git-local-devops`

```
REMOTE_GIT_PROJECT_FILE=".git-local-devops.yml"
REMOTE_GIT_PROJECT="git@gitlab.com:firecow/example.git"
```

## Running scripts

Run `git-local-devops up firecow.dk` inside `~/git-local-devops` folder

All projects specified will pull the latest changes if on default branch

All projects on custom branch, will attempt to rebase `origin/<default_branch>` first, if that fails a merge with `origin/<default_branch>` will be attempted.

After git operations are done, scripts matching cli inputs will be executed.

In this example only `"bash", "-c", "start-docker-stack.sh"` will be executed in `~/git-local-devops/firecow/example` checkout

