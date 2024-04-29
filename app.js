import dotenv from 'dotenv';
import { App } from 'octokit';
import { createNodeMiddleware } from '@octokit/webhooks';
import fs from 'fs';
import http from 'http';

dotenv.config();

// app setup
const appId = process.env.APP_ID;
const webhookSecret = process.env.WEBHOOK_SECRET;
const privateKeyPath = process.env.PRIVATE_KEY_PATH;

const privateKey = fs.readFileSync(privateKeyPath, 'utf8');

const app = new App({
    appId: appId,
    privateKey: privateKey,
    webhooks: {
        secret: webhookSecret,
    },
});

// event handler
async function handlePullRequestOpened() {
    console.log('Received a pull request event: pull request opened');
}
async function handleIssueOpened() {
    console.log('Received an issue event: issue opened');
}
async function handleIssueCommentCreated() {
    console.log('Received an issue event: comment added on issue');
}
async function handleIssueClosed() {
    console.log('Received an issue event: issue closed');
}
async function handleIssueDeleted() {
    console.log('Received an issue event: issue deleted');
}
async function handleIssueEdited() {
    console.log('Received an issue event: issue edited');
}
async function handleIssueLabeled() {
    console.log('Received an issue event: issue labeled');
}
async function handleIssueReopened() {
    console.log('Received an issue event: issue reopened');
}
async function handleIssueUnassigned() {
    console.log('Received an issue event: issue unassigned');
}
async function handleIssueUnlabeled() {
    console.log('Received an issue event: issue unlabeled');
}

// Pull Requests
app.webhooks.on('pull_request.opened', handlePullRequestOpened);

// Issues
app.webhooks.on('issues.assigned', handleIssueOpened);
app.webhooks.on('issues.closed', handleIssueClosed);
app.webhooks.on('issues.deleted', handleIssueDeleted);
app.webhooks.on('issues.edited', handleIssueEdited);
app.webhooks.on('issues.labeled', handleIssueLabeled);
app.webhooks.on('issues.opened', handleIssueOpened);
app.webhooks.on('issues.reopened', handleIssueReopened);
app.webhooks.on('issues.unassigned', handleIssueUnassigned);
app.webhooks.on('issues.unlabeled', handleIssueUnlabeled);

// Issue Comments
app.webhooks.on('issue_comment.created', handleIssueCommentCreated);
app.webhooks.on('issue_comment.deleted');
app.webhooks.on('issue_comment.edited');

app.webhooks.onError((error) => {
    if (error.name === 'AggregateError') {
        console.error(`Error processing request: ${error.event}`);
    } else {
        console.error(error);
    }
});

// Sever setup
const port = 3000;
const host = 'localhost';
const path = '/api/webhook';
const localWebhookUrl = `http://${host}:${port}${path}`;

const middleware = createNodeMiddleware(app.webhooks, { path });

http.createServer(middleware).listen(port, () => {
    console.log(`Server is listening for events at: ${localWebhookUrl}`);
    console.log('Press Ctrl + C to quit.');
});
