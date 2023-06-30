# Node.js Example App with SSO powered by WorkOS

An example application demonstrating how to use the [WorkOS Node.js SDK](https://github.com/workos/workos-node) to authenticate users via SSO.

## Prerequisites

Node.js version 10+

## Node.js Project Setup

1. Clone the main repo and install dependencies for the app you'd like to use:

    ```bash
    # HTTPS
    git clone https://github.com/workos/node-example-applications.git
    ```

    or

    ```bash
    # SSH
    git clone git@github.com:workos/node-example-applications.git
    ```

2. Navigate to the SSO app within the cloned repo.

    ```bash
    cd node-example-applications/node-sso-example
    ```

3. Install the dependencies.
    ```bash
    npm install
    ```

## Configure your environment

4. Grab your API Key and Client ID from your WorkOS Dashboard. Create a `.env`
   file at the project root, and store them like so:

    ```bash
    WORKOS_API_KEY=sk_xxxxxxxxxxxxx
    WORKOS_CLIENT_ID=project_xxxxxxxxxxxx
    ```

## SSO Setup with WorkOS

5. Follow the [SSO authentication flow instructions](https://workos.com/docs/sso/guide/introduction) to create a new SSO connection in your WorkOS dashboard.

6. Add `http://localhost:8000/callback` as a Redirect URI in the Configuration section of the Dashboard.

7. Update `routes/index.js` with the Organization ID.

## Testing the Integration

8. Start the server and head to http://localhost:8000/ to begin the login flow:

```sh
npm start
```

## Need help?

If you get stuck and aren't able to resolve the issue by reading our [WorkOS Node.js SDK documentation](https://docs.workos.com/sdk/node), API reference, or tutorials, you can reach out to us at support@workos.com and we'll lend a hand.
