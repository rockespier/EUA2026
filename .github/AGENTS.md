# Repository instructions

## Workflow

- Every change must correspond to a GitHub issue.
- Never push directly to main.
- Do not commit or push changes unless explicitly requested. You must create a new branch and a pull request.
- Read the complete issue before modifying files.
- First analyze the scope and propose a plan.
- Keep changes limited to the issue.
- Run the relevant build and tests.
- Report commands executed and their results.

## Architecture

- Backend uses .NET.
- Frontend uses ASP.NET Core MVC (Razor views).
- Do not expose persistence entities directly through API responses.
- Do not introduce dependencies without justification.
- If you are going to modify the API endpoints, document it in the api-postman.md file located in the documentation folder.


## Pull requests

- Before creating a pull request, always synchronize the working branch with the latest `main`.
- Fetch the latest changes from `origin/main`.
- Rebase the working branch onto `origin/main` when possible.
- If rebasing is unsafe or causes conflicts, stop and report the conflict instead of force-pushing or resolving it automatically.
- Never create a pull request from a branch that is known to be behind `main`.
- Include `Closes #<issue>`.
- Explain risks and testing.
- Never claim tests passed unless they were executed successfully.

## Issue readiness

- Do not start implementing an issue unless it has the `status:ready` label.
- An issue is ready only when it contains:
  - A complete description.
  - Verifiable acceptance criteria.
  - The affected area.
  - A defined priority.
  - Evidence or sufficient technical context.
  - Identified dependencies or an explicit statement that none exist.
- Do not add the `status:ready` label automatically.
- If information is missing, report it instead of assuming requirements.
