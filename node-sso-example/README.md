# Node.js Example App with SSO powered by WorkOS

An example application demonstrating to use the [WorkOS Node SDK](https://github.com/workos-inc/workos-node) to authenticate users via SSO. 

## Prerequisites

Node.js version 10+

## Node Project Setup

1. In your CLI, navigate to the directory into which you want to clone this git repo.
   ```bash
   $ cd ~/Desktop/
   ```

2. Clone the main repo and install dependencies for the app you'd like to use:
    ```bash
    # HTTPS
    git clone https://github.com/workos-inc/node-example-applications.git
    ```
    or

    ```bash
    # SSH
    git clone git@github.com:workos-inc/node-example-applications.git
    ```

3. Navigate to SSO app within the cloned repo. 
   ```bash
   $ cd node-example-applications/node-sso-example
   ```

4. Install the dependencies. 
    ```bash
    $ npm install
    ```

## Configure your environment

5. Grab your API Key and Client ID from the WorkOS Dashboard. Create a `.env`
file at the root of the project, and store these like so:
    ```
    WORKOS_API_KEY=sk_xxxxxxxxxxxxx
    WORKOS_CLIENT_ID=project_xxxxxxxxxxxx
    ```

## SSO Setup with WorkOS

6. Follow the [SSO authentication flow instructions](https://workos.com/docs/sso/guide/introduction) to create a new SSO connection in your WorkOS dashboard.

7. Add `http://localhost:3000/callback` as a Redirect URI in the Configuration section of the Dashboard.

8. Update `routes/index.js` with the Connection ID.

## Testing the Integration

9. Start the server and head to `http://localhost:3000/ to begin the login flow! 

```sh
npm start
```


## Need help?

If you get stuck and aren't able to resolve the issue by reading our [WorkOS Node SDK documentation](https://docs.workos.com/sdk/node), API reference, or tutorials, you can reach out to us at support@workos.com and we'll lend a hand.
