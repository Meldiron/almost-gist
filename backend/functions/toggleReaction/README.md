# toggleReaction

Welcome to the documentation of this function 👋 We strongly recommend keeping this file in sync with your function's logic to make sure anyone can easily understand your function in the future. If you don't need documentation, you can remove this file.

## 🤖 Documentation

Function toggles user's reaction on gist or comment. This function is meant to be executed by a client directly.

_Example inputs:_

```json
{
 "resourceType": "gists",
 "resourceId": "634465a342d3221a2a91",
 "reactionIndex" 0
}
```

```json
{
 "resourceType": "comments",
 "resourceId": "634714af7d73e60b6efb",
 "reactionIndex" 1
}
```

_Example success output:_

```json
{
  "success": true
}
```

_Example failure output:_

```json
{
  "success": false,
  "message": "Reaction not supported."
}
```

## 📝 Environment Variables

List of environment variables used by this cloud function:

- **APPWRITE_FUNCTION_ENDPOINT** - Endpoint of Appwrite project
- **APPWRITE_FUNCTION_API_KEY** - Appwrite API Key
- **MAX_ALLOWED_REACTION** - Set to 5. Maximum allowed index. Increase this if allowing new emoji reactions.

## 🚀 Deployment

There are two ways of deploying the Appwrite function, both having the same results, but each using a different process. We highly recommend using CLI deployment to achieve the best experience.

### Using CLI

Make sure you have [Appwrite CLI](https://appwrite.io/docs/command-line#installation) installed, and you have successfully logged into your Appwrite server. To make sure Appwrite CLI is ready, you can use the command `appwrite client --debug` and it should respond with green text `✓ Success`.

Make sure you are in the same folder as your `appwrite.json` file and run `appwrite deploy function` to deploy your function. You will be prompted to select which functions you want to deploy.

### Manual using tar.gz

Manual deployment has no requirements and uses Appwrite Console to deploy the tag. First, enter the folder of your function. Then, create a tarball of the whole folder and gzip it. After creating `.tar.gz` file, visit Appwrite Console, click on the `Deploy Tag` button and switch to the `Manual` tab. There, set the `entrypoint` to `src/index.js`, and upload the file we just generated.
