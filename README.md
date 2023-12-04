# Node.js Example App with SSO & Directory Sync

![image](https://github.com/NathanTarbert/nathans-node-auth-app/assets/66887028/9b6fbf34-4094-4c63-91f1-2ea9de6dfd10)


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
npm run start:both
```

- http://localhost:8000 as the primary server to authenticate the SSO login

- http://localhost:8001 as the secondary server that will retrieve our users

## Loggin In:

log into the app using a dummy gmail account 

- `nathan.test.workos@gmail.com`
- `test123*`

## Need help?

Reach out to me on [Twitter](https://twitter.com/nathan_tarbert) if you have any trouble logging in.
