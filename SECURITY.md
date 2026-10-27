# Security Policy

## Supported Versions

Security fixes are intended for the latest stable release.

| Version | Supported |
| --- | --- |
| Latest stable release | Yes |

## Reporting a Vulnerability

Please do not disclose exploitable vulnerabilities in public issues or pull requests.

Report suspected vulnerabilities through GitHub's private vulnerability reporting feature, if enabled for this repository. Otherwise, contact the maintainers privately using contact information available through the repository owner's GitHub profile.

Include, where possible:
- A clear description of the issue and its potential impact.
- Steps to reproduce or a minimal proof of concept.
- Affected routes, components, versions, or configurations.
- Any suggested mitigation.

Avoid including real user data, credentials, or production secrets in reports.

## Contributor security practices

### Secrets and authentication

- Never commit local `.env` files, tokens, private keys, or production credentials.
- Use `backend/.env.example` and `frontend/.env.example` as templates.
- Generate unique, high-entropy JWT secrets for each environment.
- Never log or expose raw access tokens, refresh tokens, or credentials.
- If a secret is committed accidentally, revoke or rotate it immediately. Removing it from the latest commit does not remove it from Git history.

### Database

- Use separate databases and credentials for development, testing, and production.
- Restrict database network access and use strong credentials.
- Do not run seed scripts against databases containing data that must be preserved.
- Keep schema validation enabled and validate data at trust boundaries.

### API and frontend

- Preserve authentication and authorization checks on protected endpoints.
- Validate untrusted input and return safe error messages.
- Configure CORS to allow only intended origins.
- Remember that frontend environment variables prefixed with `VITE_` are exposed in client-side bundles. Never place server secrets in them.

### Dependency management and CI

- Dependabot is configured to propose dependency updates.
- CI currently runs backend tests and frontend lint/build checks. **The workflow does not currently run `npm audit`**, so do not treat a passing CI run as proof that dependencies have no known vulnerabilities.
- Contributors can run `npm audit` from `backend/` and `frontend/` and report relevant findings with their package, severity, and remediation.
- Do not blindly apply breaking dependency upgrades. Review advisories, test the application, and explain any accepted risk.

## Scope

This policy describes the intended reporting process and contributor practices. It is not a guarantee that every security control is enabled or that the application has undergone a complete security assessment.
