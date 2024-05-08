import { Octokit } from '@octokit/rest';
import dotenv from 'dotenv';
import { App } from 'octokit';
import { createNodeMiddleware } from '@octokit/webhooks';
import fs from 'fs';
import http from 'http';

dotenv.config();


const REPOSITORY = 'sample-project';
const OWNER = 'jasonchuacodes';

// app setup
const appId = process.env.APP_ID;
const webhookSecret = process.env.WEBHOOK_SECRET;
const privateKeyPath = process.env.PRIVATE_KEY_PATH;
const accessToken = process.env.ACCESS_TOKEN

const privateKey = fs.readFileSync(privateKeyPath, 'utf8');

const app = new App({
    appId: appId,
    privateKey: privateKey,
    webhooks: {
        secret: webhookSecret,
    },
});

const octokit = new Octokit({
    auth: accessToken,
    userAgent: 'webhook-events-bot v1.2.3',
});

/**
 * GOAL:
 * 1. Move the octokit functionality for reading the repository files to a github webhook event
 * 2. Authenticate by using an installation access token instead of static ACCESS_TOKEN
*/

const getCommitSHA = async () => {
    const { data } = await octokit.repos.getBranch({
        owner: OWNER,
        repo: REPOSITORY,
        branch: 'main',
    });

    return data.commit.sha;
};

const main = async () => {
    const COMMIT_SHA = await getCommitSHA();

    try {
        const { data: tree_data } = await octokit.rest.git.getTree({
            owner: OWNER,
            repo: REPOSITORY,
            tree_sha: COMMIT_SHA,
            recursive: true,
        });

        tree_data.tree.map(async (tree) => {
            if (tree.type === 'blob') {
                const response = await octokit.rest.repos.getContent({
                    owner: OWNER,
                    repo: REPOSITORY,
                    path: tree.path
                  });

                const parsedContent = Buffer.from(response.data.content, 'base64').toString(
                    'utf-8'
                );
                console.log(parsedContent + '________')
            }
        });
    } catch (error) {
        console.error('Failed to retrieve tree:', error);
    }
};

main();

/**
 * Event handlers
 */

// Pull request
const handlePullRequestOpened = async () => {
    console.log('Received a pull request event: pull request opened');
};

const handlePullRequestAssigned = async () => {
    console.log('Received a pull request event: pull request assigned');
};
const handlePullRequestClosed = async () => {
    console.log('Received a pull request event: pull request closed');
};
const handlePullRequestEdited = async () => {
    console.log('Received a pull request event: pull request edited');
};
const handlePullRequestLabeled = async () => {
    console.log('Received a pull request event: pull request labeled');
};
const handlePullRequestReadyForReview = async () => {
    console.log('Received a pull request event: pull request ready for review');
};

// Issue
const handleIssueOpened = async () => {
    console.log('Received an issue event: issue opened');
};
const handleIssueClosed = async () => {
    console.log('Received an issue event: issue closed');
};
const handleIssueDeleted = async () => {
    console.log('Received an issue event: issue deleted');
};
const handleIssueEdited = async () => {
    console.log('Received an issue event: issue edited');
};
const handleIssueLabeled = async () => {
    console.log('Received an issue event: issue labeled');
};
const handleIssueReopened = async () => {
    console.log('Received an issue event: issue reopened');
};
const handleIssueUnassigned = async () => {
    console.log('Received an issue event: issue unassigned');
};
const handleIssueUnlabeled = async () => {
    console.log('Received an issue event: issue unlabeled');
};

// Issue comment
const handleIssueCommentCreated = async () => {
    console.log('Received an issue_comment event: comment added on issue');
};
const handleIssueCommentEdited = async () => {
    console.log('Received an issue_comment event: comment edited on issue');
};
const handleIssueCommentDeleted = async () => {
    console.log('Received an issue_comment event: comment deleted on issue');
};

// Member
const handleMemberAdded = async () => {
    console.log('Received a member event: member added');
};
const handleMemberEdited = async () => {
    console.log('Received a member event: member edited');
};
const handleMemberRemoved = async () => {
    console.log('Received a member event: member removed');
};

// Membership
const handleMembershipAdded = async () => {
    console.log('Received a membership event: membership added');
};
const handleMembershipRemoved = async () => {
    console.log('Received a membership event: membership removed');
};

// Organization
const handleOrganizationRenamed = async () => {
    console.log('Received an organization event: organization renamed');
};
const handleOrganizationMemberAdded = async () => {
    console.log('Received an organization event: organization member added');
};
const handleOrganizationMemberInvited = async () => {
    console.log('Received an organization event: organization member invited');
};
const handleOrganizationMemberRemoved = async () => {
    console.log('Received an organization event: organization member removed');
};
const handleOrganizationDeleted = async () => {
    console.log('Received an organization event: organization deleted');
};

// Repository import
const handleRepositoryImport = async () => {
    console.log('Received a repository import event: repository imported');
};

// Repository
const handleRepositoryCreated = async () => {
    console.log('Received a repository event: repository created');
};
const handleRepositoryArchived = async () => {
    console.log('Received a repository event: repository archived');
};
const handleRepositoryDeleted = async () => {
    console.log('Received a repository event: repository deleted');
};
const handleRepositoryEdited = async () => {
    console.log('Received a repository event: repository edited');
};
const handleRepositoryPrivatized = async () => {
    console.log('Received a repository event: repository privatized');
};
const handleRepositoryPublicized = async () => {
    console.log('Received a repository event: repository publicized');
};
const handleRepositoryRenamed = async () => {
    console.log('Received a repository event: repository renamed');
};
const handleRepositoryTransferred = async () => {
    console.log('Received a repository event: repository transferred');
};
const handleRepositoryUnarchived = async () => {
    console.log('Received a repository event: repository unarchived');
};

// Installation
const handleInstallationCreated = async () => {
    console.log('Received an installation event: installation created');
};
const handleInstallationDeleted = async () => {
    console.log('Received an installation event: installation deleted');
};
const handleInstallationNewPermissionAccepted = async () => {
    console.log(
        'Received an installation event: new installation permission accepted'
    );
};
const handleInstallationSuspend = async () => {
    console.log('Received an installation event: installation suspended');
};

// Installation target
const handleInstallationTargetRenamed = async () => {
    console.log(
        'Received an installation target event: installation target renamed'
    );
};

// Team
const handleTeamAddToRepository = async () => {
    console.log('Received a team event: team added to repository');
};
const handleTeamRemovedFromRepository = async () => {
    console.log('Received a team event: team removed from repository');
};
const handleTeamCreated = async () => {
    console.log('Received a team event: team created');
};
const handleTeamDeleted = async () => {
    console.log('Received a team event: team deleted');
};
const handleTeamEdited = async () => {
    console.log('Received a team event: team edited');
};
const handleTeamAdd = async () => {
    console.log('Received a team event: team add');
};

// Push
const handlePush = async () => {
    console.log('Received a push event: commit pushed');
};

/**
 * Webhook event listeners
 */

// Pull Requests
app.webhooks.on('pull_request.opened', handlePullRequestOpened);
app.webhooks.on('pull_request.assigned', handlePullRequestAssigned);
app.webhooks.on('pull_request.closed', handlePullRequestClosed);
app.webhooks.on('pull_request.edited', handlePullRequestEdited);
app.webhooks.on('pull_request.labeled', handlePullRequestLabeled);
app.webhooks.on(
    'pull_request.ready_for_review',
    handlePullRequestReadyForReview
);

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
app.webhooks.on('issue_comment.edited', handleIssueCommentEdited);
app.webhooks.on('issue_comment.deleted', handleIssueCommentDeleted);

// Member
app.webhooks.on('member.added', handleMemberAdded);
app.webhooks.on('member.edited', handleMemberEdited);
app.webhooks.on('member.removed', handleMemberRemoved);

// Membership
app.webhooks.on('membership.added', handleMembershipAdded);
app.webhooks.on('membership.removed', handleMembershipRemoved);

// Organization
app.webhooks.on('organization.renamed', handleOrganizationRenamed);
app.webhooks.on('organization.member_added', handleOrganizationMemberAdded);
app.webhooks.on('organization.member_invited', handleOrganizationMemberInvited);
app.webhooks.on('organization.member_removed', handleOrganizationMemberRemoved);
app.webhooks.on('organization.deleted', handleOrganizationDeleted);

// Repository Import
app.webhooks.on('repository_import', handleRepositoryImport);

// Repository
app.webhooks.on('repository.created', handleRepositoryCreated);
app.webhooks.on('repository.archived', handleRepositoryArchived);
app.webhooks.on('repository.deleted', handleRepositoryDeleted);
app.webhooks.on('repository.edited', handleRepositoryEdited);
app.webhooks.on('repository.privatized', handleRepositoryPrivatized);
app.webhooks.on('repository.publicized', handleRepositoryPublicized);
app.webhooks.on('repository.renamed', handleRepositoryRenamed);
app.webhooks.on('repository.transferred', handleRepositoryTransferred);
app.webhooks.on('repository.unarchived', handleRepositoryUnarchived);

// Installation
app.webhooks.on('installation.created', handleInstallationCreated);
app.webhooks.on('installation.deleted', handleInstallationDeleted);
app.webhooks.on(
    'installation.new_permissions_accepted',
    handleInstallationNewPermissionAccepted
);
app.webhooks.on('installation.suspend', handleInstallationSuspend);

// Installation target
app.webhooks.on('installation_target.renamed', handleInstallationTargetRenamed);

// Team
app.webhooks.on('team.created', handleTeamCreated);
app.webhooks.on('team.deleted', handleTeamDeleted);
app.webhooks.on('team.edited', handleTeamEdited);
app.webhooks.on('team.added_to_repository', handleTeamAddToRepository);
app.webhooks.on(
    'team.removed_from_repository',
    handleTeamRemovedFromRepository
);
app.webhooks.on('team_add', handleTeamAdd);

// Push
app.webhooks.on('push', handlePush);

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
