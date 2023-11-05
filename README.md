# tailscale-auth-proxy
Reverse proxy for auth using Tailscale.

## What is it?
This is an nginx reverse proxy that authenticates all requests using Tailscale.

This is done using Tailscale's API whois call which, given an IP:port pair
of the client, returns the Tailscale user the node belongs to.

HTTP 401 is returned if no user can be found.

Otherwise, the Tailscale user is translated into a Basic Auth token and passed
to the upstream service.

## Usage
```
version: "3"

services:
  auth:
    image: arkawah/tailscale-auth-proxy
    ports:
      - 80:80
    volumes:
      - /var/run/tailscale/tailscaled.sock:/var/run/tailscale/tailscaled.sock
    environment:
      - UPSTREAM=http://backend
      - USERS={"tailscale-user@example.com":"backend-basic-auth-user:password"}
```

Upstream users are specified in JSON format. A special `default` user can be
added to allow all Tailscale users to use the backend service.

### Behind another proxy
If running behind another proxy, add the following variables to ensure that the
client IP is detected correctly.
```
- TRUSTED_IP=<downstream proxy ip>
- REAL_CLIENT_IP_HEADER=<header used by downstream proxy for real IP>
```

## License
This project is using the Apache 2.0 license.
