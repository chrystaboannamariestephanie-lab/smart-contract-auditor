import { AuditIssue, AuditResult } from "./types";
import { reentrancyDetector } from "./detectors/reentrancy";
import { txOriginDetector } from "./detectors/tx-origin";

export const auditor = {
  fetchChangedFiles: async (context: any, owner: string, repo: string, prNumber: number): Promise<string[]> => {
    const files = await context.octokit.pulls.listFiles({ owner, repo, pull_number: prNumber });
    return files.data.filter((file: any) => file.filename.endsWith(".sol")).map((file: any) => file.raw_url);
  },

  runAudit: (files: string[]): AuditResult[] => {
    return files.map((file) => {
      const fileContent = ""; // Fetch file content for analysis
      const issues: AuditIssue[] = [
        ...reentrancyDetector(fileContent),
        ...txOriginDetector(fileContent),
      ];
      return { filePath: file, issues };
    });
  },

  formatAuditResults: (results: AuditResult[]): string => {
    return results.map(result => `
### ${result.filePath}
- **${result.issues.length} Issues**
    `).join("\n");
  },

  updateGitHubCheck: async (context: any, results: AuditResult[], sha: string): Promise<void> => {
    const hasCritical = results.some(res => res.issues.some(issue => issue.severity === "critical"));
    context.octokit.checks.create({
      owner: context.repo().owner,
      repo: context.repo().repo,
      name: "Smart Contract Auditor",
      head_sha: sha,
      status: "completed",
      conclusion: hasCritical ? "failure" : "success",
      output: { title: "Audit Report", summary: "More details here." },
    });
  },
};
