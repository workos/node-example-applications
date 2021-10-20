# Node.js Example App with Directory Sync powered by WorkOS

An example application demonstrating to use the [WorkOS Node SDK](https://github.com/workos-inc/workos-node) to power Directory Sync. 

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

3. Navigate to Directory Sync app within the cloned repo. 
   ```bash
   $ cd node-example-applications/node-directory-sync-example
   ```

4. Install the dependencies. 
    ```bash
    $ npm install
    ```


## Configure your environment

1. Grab your [API Key](https://dashboard.workos.com/api-keys).
2. Get your [Client ID](https://dashboard.workos.com/sso/configuration).
3. Create a `.env` file at the root of the project and populate with the
following environment variables (using values found above):

```typescript
WORKOS_API_KEY=your_api_key_here
WORKOS_CLIENT_ID=your_project_id_here
```

## Run the server

```sh
npm start
```

Head to `http://localhost:8000/` to navigate your directories!


## Need help?

If you get stuck and aren't able to resolve the issue by reading our [WorkOS Directory Sync documentation](https://workos.com/docs/directory-sync/guide), API reference, or tutorials, you can reach out to us at support@workos.com and we'll lend a hand.
