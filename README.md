# github-events-bot
This is a public app for receiving webhook events and logging the data received.

The webhook events includes (but is not limited to) the following:
- commit_comment
- create
- discussion
- discussion_comment
- github_app_authorization
- installation
- installation_repositories
- installation_target
- issue_comment
- issues
- member
- membership
- organization
- ping
- public
- pull_request*
- push
- repository
- repository_import
- team_add
- team

# Setup
1. Clone this repository
2. Install the github app - webhook-events-bot to your account and grant access to your selected repository
3. Create a .env file similar to .env.example and set actual values which include the following:
    - Request for the webhook secret from the author and assign it in the `WEBHOOK_SECRET` value
    - Request for the github app installation id from the author and assign it in the `INSTALLATION_ID` value. Otherwise, you may get this value by doing the following steps: 
      - navigate to the github developer settings
      - open the webhook-events-bot settings by clicking on the edit button  from the list of github apps 
      - select the Install App from the sidebar selection
      - select the github account where the webhook-event-bot app is installed on and open the settings
      - you can find the installation ID in the URL, which should be in this format: github.com/settings/installations/[installation_id]
    - Generate a private key and download it as a private-key.pem file. Transfer this file into the root directory of the cloned repository. Use the absolute path of this file as the value of the `PRIVATE_KEY_PATH` in the .env file. (If you are unsure what the absolute path is, just run `pwd` in the terminal)
    - Setup a Webhook payload delivery service at `smee.io`. Create a channel and use the `smee_url` as the value for `WEBHOOK_PROXY_URL`
4. Install dependencies with npm install.
5. Start the server with npm run server.
6. Ensure your server is reachable from the internet.
If you're using smee, run `smee -u <smee_url> -t http://localhost:3000/api/webhook`. If smee is not identified, try installing the smee client first by running the command `npm install --global smee-client`
7. Ensure your GitHub App includes at least one repository on its installations.

# Usage
There are several that we can test and check in the logs (or in the smee channel) for webhook event responses. 
Here are a few:
- issue: create an issue
- issue: comment on an existing issue
- pull_request: create a pull request
