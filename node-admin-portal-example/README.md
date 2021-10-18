# Node.js Example App with Admin Portal powered by WorkOS

An example application demonstrating to use the [WorkOS Node SDK](https://github.com/workos-inc/workos-node) to access the Admin Portal for SSO and Directory Sync. 

## Prerequisites

Node.js version 10+

## Node Project Setup

1. In your CLI, navigate to the directory into which you want to clone this git repo.
   ```bash
   $ cd ~/Desktop/
   ```

2. Clone this repo and install dependencies:
    ```bash
    # HTTPS
    git clone https://github.com/workos-inc/node-admin-portal-example.git
    ```
    or

    ```bash
    # SSH
    git clone git@github.com:workos-inc/node-admin-portal-example.git
    ```

3. Navigate to the cloned repo. 
   ```bash
   $ cd node-admin-portal-example
   ```

4. Install the dependencies. 
    ```bash
    $ npm install
    ```
## Configure your environment

1. Grab your [API Key](https://dashboard.workos.com/api-keys).
2. Get your [Client ID](https://dashboard.workos.com/configuration).
3. Create a `.env` file at the root of the project and populate with the
following environment variables (using values found above):

```typescript
WORKOS_API_KEY=your_api_key_here
WORKOS_CLIENT_ID=your_client_id_here
```

4. Set your [Default Redirect Link](https://dashboard.workos.com/configuration).

## Run the server and log in using SSO

```sh
npm start
```

Head to `http://localhost:8000/` to begin!


## Need help?

If you get stuck and aren't able to resolve the issue by reading our [WorkOS Admin Portal documentation](https://workos.com/docs/admin-portal/guide/introduction), API reference, or tutorials, you can reach out to us at support@workos.com and we'll lend a hand.
