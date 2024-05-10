import fs from 'fs';
import http from 'http';
import dotenv from 'dotenv';
import { App } from 'octokit';
import { Octokit } from '@octokit/rest';
import { createAppAuth } from '@octokit/auth-app';
import { createNodeMiddleware } from '@octokit/webhooks';

dotenv.config();

const appId = process.env.APP_ID;
const webhookSecret = process.env.WEBHOOK_SECRET;
const privateKeyPath = process.env.PRIVATE_KEY_PATH;
const installationId = process.env.INSTALLATION_ID

const privateKey = fs.readFileSync(privateKeyPath, 'utf8');

/**
 * Create a github app instance
 */
const app = new App({
    appId,
    privateKey,
    webhooks: {
        secret: webhookSecret,
    },
});

/**
 * Create an octokit instance with authStrategy being a github installation.
 * The github installationId is required for this authStrategy to work. 
 * Otherwise, it will return an error.
 * 
 * Read more: https://github.com/octokit/auth-app.js
 */
const octokit = new Octokit({
    authStrategy: createAppAuth,
    auth: {
      appId,
      privateKey,
      installationId,
    },
  });

const main = async ({ repo, owner }) => {
    // get the REPOSITORY's main branch commitSHA
    const { data } = await octokit.repos.getBranch({
        owner,
        repo,
        branch: 'main',
    });

    const commitSHA = data.commit.sha;

    try {
        // Retrieve the repository tree recursively to reveal files nested within directories.
        const { data: tree_data } = await octokit.rest.git.getTree({
            owner,
            repo,
            tree_sha: commitSHA,
            recursive: true,
        });

        // Parse the file contents and log them in the console.
        tree_data.tree.map(async (tree) => {
            if (tree.type === 'blob') {
                const response = await octokit.rest.repos.getContent({
                    owner,
                    repo,
                    path: tree.path,
                });

                const parsedContent = Buffer.from(
                    response.data.content,
                    'base64'
                ).toString('utf-8');
                console.log(parsedContent + '________');
            }
        });
    } catch (error) {
        console.error('Failed to retrieve tree:', error);
    }
};

// Event Handler(s)
const handleIssueCommentCreated = async ({ payload }) => {
    const { repository } = payload;

    try {
        await main({
            owner: repository.owner.login,
            repo: repository.name,
        });
        console.log('Received an issue_comment event: comment added on issue');
    } catch (error) {
        console.error(error);
    }
};

// Webhook Event Listener(s)
app.webhooks.on('issue_comment.created', handleIssueCommentCreated);

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
