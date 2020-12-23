[![Netlify Status](https://api.netlify.com/api/v1/badges/2c9f2f32-c413-4b16-95a4-92b8ac302928/deploy-status)](https://app.netlify.com/sites/wiating/deploys)

## Local setup

1. Clone the repository and Install all dependencies with `yarn install` command.
2. Copy `.env.example` file to `.env` and replace `XXXXX` inside with a correct
auth client ID, which is secret.

Inside the `.env` file you can override localy any environment variables.


## Available Scripts

### `yarn start`

Runs the app in the development mode.<br>
The site is served on [http://localhost:3000](http://localhost:3000).

The page will reload if you make edits.<br>
You will also see any lint errors in the console.

### `yarn start:netlify`

Runs the app in the development mode, with the Netlify features enabled.
The site is served on [http://localhost:8888](http://localhost:8888).

### `yarn build`

Builds the app for production to the `build` folder.<br>
It correctly bundles React in production mode and optimizes the build for the best performance.

Your app is ready to be deployed!

### `docker-compose up`

Start the app in a dockerized mode. The app should be available on http://localhost:3000/



## Domains

Project is continuously deployed to following domains:

| Domain                     | Role       | Explanation                                                                 |
|----------------------------|------------|-----------------------------------------------------------------------------|
| https://wiating.eu         | Production | `master` branch with a production database. Stable release.                   |
| https://beta.wiating.eu    | Canary     | `develop` branch with a production database. Experimental release.            |
| https://staging.wiating.eu | Staging    | `develop` branch with a staging backend. Development and testing purposes. |
