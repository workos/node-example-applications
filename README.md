# Node.js Example App with SSO & Directory Sync

An example application authenticate users via SSO and Directory Sync.

## Testing the Integration

Open two terminals running the command below

- Navigate to the SSO app within the cloned repo.

  ```bash
  $ cd node-example-applications/node-sso-example
  ```

- Navigate to Directory Sync app within the cloned repo.

  ```bash
  $ cd node-example-applications/node-directory-sync-example
  ```

```sh
npm start
```

- http://localhost:8000 as the primary server to authenticate the SSO login

- http://localhost:8001 as the secondary server that will retrieve our users

## Need help?

Reach out to me on [Twitter](https://twitter.com/nathan_tarbert) if you have any trouble logging in.
