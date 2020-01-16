# Authz reference implementation

ACHTUNG: it is a bad, bad, BAD code. It even does not cover all the available
functionality of google macaroons. Please forgive me for forcing you to feel sick
as you look thru it.

Anyway, what is nice is:

1. this code shows the fastest nodejs websocket/HTTP server implementation to date
2. the server runs over a secure connection; look how it's simple
3. the client-server communication is binary, thou it just ping-pongs stringified JSON which is not that a compact format - should need arise I would substitute it with google flatbuffers for sure
4. the client encodes the name of the function it needs to call on the server and passes arguments for it - look how this dynamic invocation is implemented, how authorization is done and how easy it will be to implement dynamic authorization checks
5. a google macaroon gets transmitted via a special x-bla-bla header which the server reads and later decodes

## Prepare your environment

1. you need to have a fresh install of [pnpm](https://pnpm.js.org/en/installation)
2. run `./bin/install-all` from the root directory to install all dependencies
3. you need the [mkcert](https://github.com/FiloSottile/mkcert) tool useful for creation of self-signed certificates suitable for development
4. run `mkcert -install` to install local CA to the system trust store
5. run `./bin/gen-cert` to generate server key and cert via the `mkcert`

## Run all tests recursively

from the project directory run `pnpm --recursive run test`

## libWss

1. navigate to `packages/libwss`
2. run `pnpm run test`

## PS

and lots of sorries for my English, of course. Verzeihung.
