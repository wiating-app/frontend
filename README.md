[![Netlify Status](https://api.netlify.com/api/v1/badges/db4e98df-270a-4e20-b996-9216b581a2e5/deploy-status)](https://app.netlify.com/sites/wiating/deploys)

## Available Scripts

In the project directory, you can run:

### Before running

Copy .env.sample to .env , update constants there:

REACT_APP_API_URL - backend API URL
REACT_APP_S3_URL - S3 URL for images
REACT_APP_AUTH_DOMAIN - Auth0 domain name
REACT_APP_AUTH_CLIENT - Auth0 client id


### `npm start`

Runs the app in the development mode.<br>
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br>
You will also see any lint errors in the console.

### `npm run build`

Builds the app for production to the `build` folder.<br>
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br>
Your app is ready to be deployed!