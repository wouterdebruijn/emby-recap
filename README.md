[![Made with Fresh](https://fresh.deno.dev/fresh-badge-dark.svg)](https://fresh.deno.dev)

# Emby Recap

A website displaying Emby user statistics in the form of a year recap.
Displaying watch times, durations, relative placements and counters.

# Installation

This project is released as a docker image available on DockerHub. It is also
possible to run the project directly when Docker is not desired. The docker
image provides the website on port 8000, which should be mapped to the
appropriate port on your host system.

The [Emby Playback Reporting](https://github.com/faush01/playback_reporting)
plugin is required and should be installed through your Emby Plugins catalog.
Keep in mind the data will be collected after the installation of this plugin.

Emby-Replay connects to your Emby instance over Http(s), a valid URL and api key
need to be provided through environment variables. The following environment
variables are required:

- EMBY_URL=http://localhost:8096 _# Emby URL to your Emby server_
- EMBY_API_KEY=ADMIN_ACCOUNT_TOKEN _# Emby API key
  [generated through the Emby dashboard.](https://github.com/MediaBrowser/Emby/wiki/API-Key-Authentication)_

The following environment variables are optional:

- END_DATE _# The ending date for data queries. Defaults the current day._
- DAYS _# The amount of days we collect data for. Defaults to 365_

## Docker Direct run

```bash
docker run -d -p 80:8000 -e "EMBY_URL=http://localhost:8096" -e "EMBY_API_KEY=emby_api_key" hedium/emby-recap:latest
```

## Docker compose

```yaml
services:
  app:
    image: hedium/emby-recap:latest
    environment:
      EMBY_URL: "http://localhost:8096"
      EMBY_API_KEY: "ADMIN_ACCOUNT_TOKEN"
    ports:
        - "8000:80"
```

## Deno without docker

Provide the required environment variables in a `.env` file.

.env

```
EMBY_URL=http://localhost:8096
EMBY_API_KEY=ADMIN_ACCOUNT_TOKEN
```

```
deno run --allow-read --allow-env --allow-net main.ts
```

# Screenshots

<img src="./.github/screenshots/emby-recap-1.png" />
<img src="./.github/screenshots/emby-recap-2.png" />
