# Live Art

Welcome to the repo for the Live Art challenge for picoCTF 2022! This is a web app problem designed to be on the harder end of the pico spectrum.

## Setup

First, clone the repo

```bash
git clone git@github.com:zwade/live-art.git
```

## Local Development

For local development, first install all of the dependencies:

```bash
yarn
```

To run the client in development mode, you can run

```bash
bash -c 'cd client && yarn vite'
```

and visit [http://localhost:3000](http://localhost:3000).

To run the server in production mode (allows using the xss bot), you can run

```bash
bash -c 'cd client && yarn vite build'
bash -c 'cd server && yarn build && yarn start'
```

and visit [http://localhost:4000](http://localhost:4000).

To run the production application as a docker container, you can run

```bash
docker build . -t live-art
docker run -p 4000:4000 live-art
```

and visit [http://localhost:4000](http://localhost:4000).

## Running under cmgr


To run the server under cmgr, you can run

```bash
# Delete node modules because of https://github.com/ArmyCyberInstitute/cmgr/issues/38
rm -rf node_modules
cd ..
cmgr update live-art
cmgr playtest picoctf/zwad3/live-art
```