# Authz reference implementation

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
