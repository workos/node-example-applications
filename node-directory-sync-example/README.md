# Node.js Example App with Directory Sync powered by WorkOS

An example application demonstrating to use the [WorkOS Node SDK](https://github.com/workos/workos-node) to power Directory Sync.

## Prerequisites

Node.js version 10+

## Node Project Setup

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

2. Navigate to Directory Sync app within the cloned repo.

    ```bash
    $ cd node-example-applications/node-directory-sync-example
    ```

3. Install the dependencies.
    ```bash
    $ npm install
    ```

## Configure your environment

1. Grab your [API Key](https://dashboard.workos.com/api-keys).
2. Create a `.env` file at the root of the project and populate with the
   following environment variables (using values found above):

```typescript
WORKOS_API_KEY = your_api_key_here
```

## Run the server

```sh
npm start
```

Head to `http://localhost:8000/` to navigate your directories!

## Testing Webhooks

### 1. Click on the "Test Webhooks" button to navigate to the webhooks view.

### 2. Start an `ngrok` session

[Ngrok](https://ngrok.com/) is a simple application that allows you to map a local endpoint to a public endpoint.

The application will run on http://localhost:8000. Ngrok will create a tunnel to the application so we can receive webhooks from WorkOS.

```sh
./ngrok http 8000
```

### 3. Set Up a WorkOS Endpoint

Log into the [WorkOS Dashboard](https://dashboard.workos.com/webhooks) and add a Webhook endpoint with the public ngrok URL with `/webhooks` appended.

The local application is listening for webhook requests at http://localhost:8000/webhooks

### 4. Set Up Webhooks Secret

In order for the SDK to validate that WorkOS webhooks, locate the Webhook secret from the dashboard.

Then populate the following environment variable in your `.env` file at the root of the project.

```sh
WORKOS_WEBHOOK_SECRET=your_webhook_secret
```

## Need help?

If you get stuck and aren't able to resolve the issue by reading our [WorkOS Directory Sync documentation](https://workos.com/docs/directory-sync/guide), API reference, or tutorials, you can reach out to us at support@workos.com and we'll lend a hand.
