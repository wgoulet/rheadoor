# Backend API Application for driving the RheaDoor

The backend application is built using Python with the FastAPI framework. The application exposes REST endpoints that are called by the Raspberry PI clients when they need to check in and complete work, as well as the frontend React application used by users.

## Security

Since I've had to dig deep into the guts of OAuth2.0/OIDC for #dayjob, I decided to implement the authentication and authorization framework for this application using KeyCloak.

The app's REST API uses the Starlette OAuth2 API middleware to protect the secured endpoints. The API expects that all API requests include an access token in the Authorization header. Decisions on whether or not the API will act on the requests is based on whether or not the tokens issued to API callers contain the correct audience (e.g. authorization is based on if the token contains the correct audience.)

For non-interactive API clients running on the Raspberry PI, having a valid token with the correct audience is sufficient to perform the action. For interactive users using the React front-end, an additional check is made based on the user's role (as returned by Keycloak in the user's ID token) to determine if the user is permitted to perform an action.

## Design of the backend application

The FastAPI application is hosted by the uvicorn ASGI webserver. The OAuth2 API middleware is configured with the URL, issuer and JWKS URL for the KeyCloak server.