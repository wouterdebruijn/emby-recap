FROM denoland/deno:1.29.1

# The port that your application listens to.
EXPOSE 8000

WORKDIR /app

# Prefer not to run as root.

# These steps will be re-run upon each file change in your working directory:
ADD . .
# Compile the main app so that it doesn't need to be compiled each startup/entry.
RUN deno cache --lock-write main.ts

CMD ["run", "--allow-read", "--allow-env", "--allow-net", "main.ts"]