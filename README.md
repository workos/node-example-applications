# Node.js Example App with SSO & Directory Sync

![image](https://github.com/NathanTarbert/nathans-node-auth-app/assets/66887028/9b6fbf34-4094-4c63-91f1-2ea9de6dfd10)

## Clone the repo
```bash
  $ https://github.com/NathanTarbert/nathans-node-auth-app.git
  ```

This is an example application which demonstrates the process of authenticating users via SSO and Directory Sync.
The two services we are using are WorkOS and Okta.

## Testing the Integration

We will run two servers with one command.

```sh
npm run start:both
```

- http://localhost:8000 as the primary server to authenticate the SSO login

- http://localhost:8001 as the secondary server that will retrieve our users

Navigate to `localhost:8000` to begin loggin in. 


## Need help?

Reach out to me on [Twitter](https://twitter.com/nathan_tarbert) if you have any trouble logging in.
