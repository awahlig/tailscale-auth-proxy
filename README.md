# tailscale-auth-proxy
Reverse proxy for auth using Tailscale.

## What is it?
An nginx reverse proxy that authenticates all requests using Tailscale.

This is done using Tailscale's *whois* API which, given an IP:port pair
of the client, returns the Tailscale user the remote node belongs to.

The Tailscale user is then translated into a Basic Auth token and passed
to the upstream service.

If Tailscale can't find the user or if the proxy is configured to not give
this user access, HTTP 401 is returned.

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
