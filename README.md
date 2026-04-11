# Smart Contract Auditor Bot

A GitHub App built with Probot that automatically audits Solidity smart contracts for vulnerabilities during pull requests.

## Features
- Static analysis for Solidity `.sol` files.
- Reports vulnerabilities as PR comments.
- Blocks merging if high/critical issues are found using GitHub Checks.

## Setup Instructions
1. Clone the repo:
   ```bash
   git clone https://github.com/agunnaya001/smart-contract-auditor.git
   cd smart-contract-auditor
   npm ci
