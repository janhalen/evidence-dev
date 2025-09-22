const {
    graphql
} = require("@octokit/graphql");

module.exports = async function () {
    const graphqlWithAuth = graphql.defaults({
        headers: {
            authorization: `token ${process.env.GITHUB_TOKEN}`
        }
    });

    const {
        repository
    } = await graphqlWithAuth(`
        query getRepoMetrics($owner: String!, $repo_name: String!) {
            repository(owner: $owner, name: $repo_name) {
                stargazers {
                    totalCount
                }
                forks {
                    totalCount
                }
                issues(states: OPEN) {
                    totalCount
                }
                pullRequests(states: OPEN) {
                    totalCount
                }
                releases {
                    totalCount
                }
                watchers {
                    totalCount
                }
            }
        }
    `, {
        owner: process.env.OWNER,
        repo_name: process.env.REPO_NAME
    });

    return [{
        total_stargazers: repository.stargazers.totalCount,
        total_forks: repository.forks.totalCount,
        total_open_issues: repository.issues.totalCount,
        total_open_pull_requests: repository.pullRequests.totalCount,
        total_releases: repository.releases.totalCount,
        total_watchers: repository.watchers.totalCount,
    }];
};