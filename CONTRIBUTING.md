# Contributing to Box Office Inc - Movie Studio Simulator

Thank you for helping improve **Box Office Inc - Movie Studio Simulator**. Contributions should be useful, focused, tested, and respectful of the project's existing architecture.

## Programs

This repository participates in ECSOC 2026 and ELUSOC 2026 and has been selected for Nexus Spring of Code (NSoC) Winter Edition 2026.

- **NSoC Project Admin / Project Kernel:** Sahil Raj Verma
- **NSoC website:** https://www.nsoc.in/

Follow any current program-specific instructions supplied by the organizers. Do not assume an NSoC-specific issue or pull-request label unless the organizers or project maintainers explicitly request it.

## Contribution workflow

### 1. Find or discuss an issue
- Search open and closed issues and pull requests before creating a new issue.
- Choose an issue that describes a real bug, improvement, test, or documentation need.
- Ask for assignment or maintainer approval before starting substantial work.
- Clarify the expected outcome if the issue is ambiguous.

### 2. Fork and clone
```bash
git clone https://github.com/SRV30/Box_Office_Inc-Movie_Sim.git
cd Box_Office_Inc-Movie_Sim
```

Create a branch for your change:
```bash
git checkout main
git pull origin main
git checkout -b <type>/<short-description>
```

Examples: `fix/movie-release-validation`, `feat/talent-search`, `docs/local-setup`.

### 3. Develop responsibly
- Keep the change focused on the issue.
- Follow the existing code organization and naming conventions.
- Avoid unrelated refactors and generated files.
- Never commit credentials, tokens, private keys, production data, or local `.env` files.
- Add or update tests for behavior changes when feasible.
- Update documentation when commands, environment variables, APIs, or user-facing behavior change.

### 4. Test your change
Run the relevant tests, lint checks, and build commands defined by the frontend and backend package files. In the PR, list the exact commands run and their outcomes. If a check cannot be run, explain why rather than implying it passed.

For UI changes, check mobile and desktop layouts and attach screenshots when useful.

### 5. Commit with a clear message
Use a concise, descriptive commit message. Examples:
```text
feat: add actor search
fix: validate movie release state
docs: clarify local environment setup
test: cover weekly simulation transitions
```

### 6. Open a pull request
A good PR should:
- Explain the problem and the proposed solution.
- Link the related issue (for example, `Closes #123`).
- Describe the tests and checks actually run.
- Include screenshots or recordings for significant UI changes.
- Mention any migration, configuration, or environment-variable changes.
- Be limited to the assigned or agreed scope.

Request review from the project maintainers and respond constructively to feedback. Do not merge your own contribution unless you have the required permission and approval under the project's workflow.

## Program-specific instructions

### NSoC Winter Edition 2026
- Work on meaningful project issues and submit focused pull requests for maintainer review.
- Follow the official NSoC website and any organizer-provided guidance for eligibility, issue assignment, PR review, labels, and contribution tracking.
- Do not claim that a contribution is counted or accepted by the program until it meets the program's stated requirements.

### ECSOC 2026
- For ECSOC-related issues, use the `ECSOC2026` label when applicable.
- Mention the program in the PR when the contribution is for ECSOC.
- Project admins apply the `ECSoC26` label during review before merging when required by the ECSOC Sentinel workflow.

### ELUSOC 2026
- Identify ELUSOC-related contributions clearly in the issue or PR and follow the program-specific instructions provided by its organizers.

## Project coding conventions

### JavaScript
- Use modern JavaScript consistent with the existing codebase.
- Follow the repository's ESLint and Prettier configuration where configured.

### React
- Prefer functional components and hooks where consistent with existing patterns.
- Keep components modular and reusable.
- Keep API calls in the project's existing API/service layers rather than introducing new patterns without a clear reason.
- Use the styling and state-management conventions already established in the codebase.

### Naming
- Variables and functions: `camelCase`
- React components: `PascalCase`
- Constants: follow the surrounding module's convention.

## Issues and collaboration
- Search for duplicates before opening an issue.
- Include clear reproduction steps for bugs, expected versus actual behavior, and relevant logs with secrets removed.
- Be respectful in issue discussions and code reviews.
- Do not submit spam, duplicate issues, or unrelated changes solely to increase contribution counts.

## Pull request checklist

- [ ] The change addresses the linked issue or agreed task.
- [ ] The change is focused and follows the existing project structure.
- [ ] Relevant tests/build/lint checks were run, and results are reported accurately.
- [ ] Documentation and environment examples are updated when needed.
- [ ] No secrets or local environment files are included.
- [ ] Screenshots are included for meaningful UI changes.
- [ ] Program-specific requirements have been followed where applicable.

## Help

If you are unsure about scope or setup, ask in the relevant issue before investing in a large change.

Thank you for contributing to Box Office Inc - Movie Studio Simulator.
