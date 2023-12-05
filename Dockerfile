FROM denoland/deno:1.38.4

ARG GIT_REVISION
ENV DENO_DEPLOYMENT_ID=${GIT_REVISION}

# The port that your application listens to.
EXPOSE 8000

WORKDIR /app

# Prefer not to run as root.

# These steps will be re-run upon each file change in your working directory:
ADD . .
# Compile the main app so that it doesn't need to be compiled each startup/entry.
RUN deno task cache
RUN deno task build


CMD ["run", "--allow-read", "--allow-env", "--allow-net", "main.ts"]