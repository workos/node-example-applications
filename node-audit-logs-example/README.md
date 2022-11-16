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

Follow the [Audit Logs configuration steps](https://workos.com/docs/audit-logs/emit-an-audit-log-event/sign-in-to-your-workos-dashboard-account-and-configure-audit-log-event-schemas) to set up the following 5 events that are sent with this example:

Action title: "user.signed_in" | Target type: "team"
Action title: "user.logged_out" | Target type: "team"
Action title: "user.organization_set" | Target type: "organization"
Action title: "user.organization_deleted" | Target type: "organization"
Action title: "user.connection_deleted" | Target type: "connection"

Next, take note of the Organization ID for the Org which you will be sending the Audit Log events for. This ID gets entered into the splash page of the example application.

Once you enter the Organization ID and submit it, you will be brought to the page where you'll be able to send the audit log events that were just configured. You'll also notice that the action of setting the Organization triggered an Audit Log already. Click the buttons to send the respective events.

To obtain a CSV of the Audit Log events that were sent for the last 30 days, click the "Export Events" button. This will bring you to a new page where you can download the events. Downloading the events is a 2 step process. First you need to create the report by clicking the "Generate CSV" button. Then click the "Access CSV" button to download a CSV of the Audit Log events for the selected Organization for the past 30 days.

## Need help?

First, make sure to reference the Audit Logs docs at https://workos.com/docs/audit-logs.

If you get stuck and aren't able to resolve the issue by reading our docs or API reference, you can reach out to us at support@workos.com and we'll lend a hand.
