import { Probot } from "probot";
import { auditor } from "./auditor";

export = (app: Probot) => {
  app.on(["pull_request.opened", "pull_request.synchronize"], async (context) => {
    const { owner, repo } = context.repo();
    const pr = context.payload.pull_request;

    // Fetch changed .sol files
    const changedFiles = await auditor.fetchChangedFiles(context, owner, repo, pr.number);

    // Run audits
    const auditResults = auditor.runAudit(changedFiles);

    // Post a PR comment with results
    const commentBody = auditor.formatAuditResults(auditResults);
    await context.octokit.issues.createComment({
      owner,
      repo,
      issue_number: pr.number,
      body: commentBody,
    });

    // Update GitHub Check
    await auditor.updateGitHubCheck(context, auditResults, pr.head.sha);
  });
};
