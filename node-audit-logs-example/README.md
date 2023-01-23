# Node.js Example App with Audit Logs powered by WorkOS

An example Node.js application demonstrating how to use the [WorkOS Node.js SDK](https://github.com/workos/workos-node) to send and retrieve Audit Log events. This app is not meant to show a real-world example of an Audit Logs implementation, but rather to show concrete examples of how events can be sent using the Node.js SDK.

## Prerequisites

-Node.js version 10+

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

2. Navigate to Audit Logs app within the cloned repo.

   ```bash
   $ cd node-example-applications/node-audit-logs-example
   ```

3. Install the dependencies.
   ```bash
   $ npm install
   ```

## Configure your environment

4. Grab your API Key and Client ID from the WorkOS Dashboard. Create a `.env`
   file at the root of the project, and store these like so:

   ```bash
   WORKOS_API_KEY=sk_xxxxxxxxxxxxx
   WORKOS_CLIENT_ID=project_xxxxxxxxxxxx
   ```

## Testing the Integration

5. Start the server and head to `http://localhost:8000/ to begin the login flow!

```sh
npm start
```

## Audit Logs setup

Follow the [Audit Logs configuration steps](https://workos.com/docs/audit-logs/emit-an-audit-log-event/sign-in-to-your-workos-dashboard-account-and-configure-audit-log-event-schemas) to configure Audit Log Event schemas in your WorkOS dashboard. Make sure you configure all the events that you would like to send using this example application. To send an event, go to the "Send Events" tab, fill in all the required fields and click "Send Event" button.

To obtain a CSV of the Audit Log events that were sent for the last 30 days, go to the "Export Events" tab. Downloading the events is a 2 step process. First you need to create the report by clicking the "Generate CSV" button. Then click the "Access CSV" button to download a CSV of the Audit Log events for the selected Organization for the past 30 days.

## Need help?

First, make sure to reference the Audit Logs docs at https://workos.com/docs/audit-logs.

If you get stuck and aren't able to resolve the issue by reading our docs or API reference, you can reach out to us at support@workos.com and we'll lend a hand.
