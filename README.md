# covid-19-tracker-server
Server Repository of COVID-19 Tracker application 


Setup
-
### Install global packages:
- On terminal: `cd /path/to/covid-19-tracker-server/`
- Install [nodejs](https://nodejs.org/en/download/)
- Install typescript: `npm install -g typescript@4.1.2`
- Install dependencies: `npm install`


# Running the server

For development run the following command from the terminal:
- On windows: `npm run dev-win`
- Unix: `npm run dev`


# Optional: running docker

Make sure to have docker engine installed on your machine and run the following:
- Build the image from Dockerfile: `docker-compose build`
- Run the container: `docker-compose up`

Error
- 
### .token_seed: permission denied
- On Mac: `export DOCKER_BUILDKIT=0` and `export COMPOSE_DOCKER_CLI_BUILD=0`