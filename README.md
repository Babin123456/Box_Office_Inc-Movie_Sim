# 🎬 Box Office Inc - Movie Studio Simulator

A full-stack **movie studio management and entertainment-industry simulation game**. Build a cinematic empire by hiring creative talent, producing films, planning marketing campaigns, releasing movies, and growing your studio through box-office revenue, fans, and prestige.

![License](https://img.shields.io/badge/License-MIT-green)
![Open Source](https://img.shields.io/badge/Open%20Source-Welcome-brightgreen)
![ECSOC](https://img.shields.io/badge/ECSOC-2026-blue)
![ELUSOC](https://img.shields.io/badge/ELUSOC-2026-orange)
![Nexus Spring of Code](https://img.shields.io/badge/NSoC-2026-blue)

---

## Open-source programs

This repository participates in **ECSOC 2026** and **ELUSOC 2026**. The project has also been selected for **Nexus Spring of Code (NSoC) Winter Edition 2026**.

- **NSoC project:** Box Office Inc - Movie Studio Simulator
- **Project Admin / Project Kernel:** Sahil Raj Verma
- **Tech stack:** React, Node.js, Express.js, MongoDB
- **Program website:** [NSoC](https://www.nsoc.in/)
- **Project repository:** [GitHub](https://github.com/SRV30/Box_Office_Inc-Movie_Sim)

NSoC is a 45-day open-source program centered on meaningful issues, reviewed pull requests, and contributions that ship useful improvements. Contributors should start from a clear issue, discuss substantial changes with the project maintainer, and submit a focused pull request for review. Duplicate, spam, and low-effort changes are not welcome. Read [CONTRIBUTING.md](CONTRIBUTING.md) and follow the current [official NSoC guidance](https://www.nsoc.in/) for participation and contribution tracking. A merged contribution is not guaranteed to qualify for program recognition; eligibility and scoring are determined by the organizers.

### Mandatory NSoC labels and merge requirements

Create and use these four repository labels for NSoC contributions:

- `nsoc26` — required on every NSoC issue and pull request.
- `level1` — use for a Level 1 task.
- `level2` — use for a Level 2 task.
- `level3` — use for a Level 3 task.

Every NSoC pull request must carry `nsoc26` and **exactly one** appropriate level label (`level1`, `level2`, or `level3`). Label the related issue consistently. The labels help organize project work; follow any additional instructions published by the NSoC organizers.

**Merge a pull request only when every requirement below is satisfied:**

- [ ] The PR is assigned to a contributor and linked to a valid, relevant issue.
- [ ] It contains meaningful code or documentation changes—not a zero-line change or a trivial edit made only to claim participation.
- [ ] The implementation works, and the code is clean, understandable, and consistent with the project.
- [ ] Documentation is added or updated wherever needed.
- [ ] The PR has the `nsoc26` label and the correct single level label.
- [ ] The PR has been properly reviewed and approved by a maintainer.
- [ ] The `.gitignore` file is used correctly: do not commit secrets, local environment files, dependencies, build output, or other generated/local-only files.
- [ ] Relevant tests, lint checks, and build checks have been run; results are reported honestly in the PR.

Do not merge a PR if any requirement is missing. Ask the contributor to address the gap first. These are repository review requirements and do not guarantee NSoC points or official recognition.

---

## Overview

Become the head of your own movie studio and experience every stage of filmmaking—from discovering scripts and hiring actors to managing production, marketing, and worldwide theatrical releases. Your decisions affect the studio's reputation, finances, and long-term success.

## Features

### Studio management
- Financial management
- Studio reputation system
- Weekly payroll
- Revenue and expense tracking

### Talent management
- Hire writers and directors
- Recruit actors
- Manage production crews
- Progress talent over time

### Movie production
- Script marketplace
- Multi-stage production pipeline
- Marketing campaigns
- Movie release management

### Simulation and analytics
- Weekly simulation engine
- Dynamic box office
- Audience and critic ratings
- Financial analytics

## Technology stack

| Layer | Technologies |
| --- | --- |
| Frontend | React, Vite, Redux Toolkit, Tailwind CSS |
| Backend | Node.js, Express.js |
| Database | MongoDB |
| Deployment | Vercel (frontend deployment configuration) |

## Local setup

### Prerequisites
- Node.js (use the version supported by the project package files)
- npm
- MongoDB connection string

### 1. Clone the repository
```bash
git clone https://github.com/SRV30/Box_Office_Inc-Movie_Sim.git
cd Box_Office_Inc-Movie_Sim
```

### 2. Configure environment variables

Create local environment files from the provided examples:

- Copy `backend/.env.example` to `backend/.env`
- Copy `frontend/.env.example` to `frontend/.env`

Fill in the required values locally. **Never commit real secrets or production credentials.** See the environment-variable reference below.

### 3. Start the backend
```bash
cd backend
npm install
npm run dev
```

### 4. Start the frontend

In a second terminal, from the repository root:
```bash
cd frontend
npm install
npm run dev
```

Use the local URLs printed by the development servers. Confirm the actual scripts and required environment variables in the relevant package files before troubleshooting setup issues.

### Seed the V1 market

To seed the simulation with competitor studios and talent records, run the following from the repository root:
```bash
cd backend
node src/scripts/seedIndustryMarket.js
```

Run seed scripts only against the intended development database. Review the script before running it against any database containing data you need to preserve.

## Environment variables

### Backend (`backend/.env`)

| Variable | Required | Description | Example |
| --- | --- | --- | --- |
| `MONGO_URI` | Yes | MongoDB connection string | `mongodb+srv://<user>:<password>@<cluster>/<database>` |
| `JWT_ACCESS_SECRET` | Yes | Secret used to sign access tokens | Generate a unique random secret |
| `JWT_REFRESH_SECRET` | Yes | Secret used to sign refresh tokens | Generate a different random secret |
| `CLIENT_URL` | Yes | Frontend origin used for CORS | `http://localhost:5173` |
| `PORT` | No | Backend port | `5000` |
| `NODE_ENV` | No | Runtime environment | `development` |
| `JWT_ACCESS_EXPIRE` | No | Access-token lifetime | `15m` |
| `JWT_REFRESH_EXPIRE` | No | Refresh-token lifetime | `30d` |

### Frontend (`frontend/.env`)

| Variable | Required | Description | Example |
| --- | --- | --- | --- |
| `VITE_BACKEND_API_URL` | Yes | Backend API base URL | `http://localhost:5000/api` |

Use the committed `.env.example` files as the source of truth for required keys. Do not put server-side secrets in frontend environment variables; Vite-exposed variables are included in client-side code.

## Documentation

- [System architecture](ARCHITECTURE.md)
- [V1 release architecture and quality gate](docs/V1_RELEASE_ARCHITECTURE_AND_QUALITY_GATE.md)
- [V1 simulation acceptance report](docs/V1_SIMULATION_ACCEPTANCE_REPORT.md)
- [Contribution guidelines](CONTRIBUTING.md)
- [Security policy](SECURITY.md)
- [Code of conduct](CODE_OF_CONDUCT.md)

## Project structure

```text
backend/
  api/
  src/
    config/
    controllers/
    models/
    routes/
    services/
    utils/

frontend/
  src/
    api/
    app/
    components/
    features/
    pages/
```

This is a simplified overview; consult the actual directories and [ARCHITECTURE.md](ARCHITECTURE.md) for details.

## Development and quality

Before opening a pull request, run the relevant tests and build commands available in the frontend and backend package files. Include the commands run and their results in the PR description. Do not claim tests passed unless they were actually run.

## Contributing

We welcome focused contributions that improve gameplay, reliability, accessibility, security, testing, and documentation.

1. Read [CONTRIBUTING.md](CONTRIBUTING.md).
2. Search existing issues and pull requests to avoid duplicates.
3. Ask for issue assignment or maintainer approval before beginning substantial work.
4. Keep changes scoped to the issue and add or update tests where appropriate.
5. Open a pull request that explains the problem, solution, testing, and any user-visible changes.

For NSoC issues and pull requests, apply `nsoc26` and exactly one of `level1`, `level2`, or `level3`, as described above. For ECSOC/ELUSOC-specific contribution labels, follow the instructions in [CONTRIBUTING.md](CONTRIBUTING.md). Always follow the current official program guidance and any additional instructions from the organizers.

## Roadmap

Potential future improvements include AI studios, an awards system, franchises and sequels, seasonal events, dynamic industry trends, and multiplayer features. These are roadmap ideas and should not be interpreted as already implemented.

## License

This project is distributed under the [MIT License](LICENSE).

## Links

- [Live application](https://box-office-inc-movie-sim.vercel.app)
- [GitHub issues](https://github.com/SRV30/Box_Office_Inc-Movie_Sim/issues)
- [NSoC Winter Edition](https://www.nsoc.in/)
