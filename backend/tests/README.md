# Backend Tests

Automated tests for the CineVerse simulation backend, using the built-in
[`node:test`](https://nodejs.org/api/test.html) runner and `node:assert`.

## Running the tests

From the `backend/` directory:

```bash
npm test
```

This runs every `tests/**/*.test.js` file.

To run a single file:

```bash
node --test tests/engines.test.js
node --test tests/integration.lifecycle.test.js
```

## What's covered

### `engines.test.js` — pure unit tests (no database)

Fast, deterministic tests for the side-effect-free simulation engines:

- **reviewEngine** — critic/audience score formulas, label thresholds, and the
  neutral defaults used when talent data is missing.
- **careerImpactEngine** — post-release talent progression: reputation/popularity
  changes, salary multipliers, earnings, and career-history entries for hits,
  disasters, and average releases.
- **payrollEngine** — weekly payroll deduction from studio funds, including the
  partial-payment path when a studio is underfunded.
- **studioGrowthEngine** — fan/prestige/revenue growth, aggregate stats, and
  studio level-ups after a release.

### `integration.lifecycle.test.js` — integration tests (in-memory MongoDB)

End-to-end style tests that run the **production pipeline** against a real
database provided by
[`mongodb-memory-server`](https://github.com/typegoose/mongodb-memory-server):

- A movie document persists and is retrievable.
- A movie in `PRODUCTION` advances one week per tick (deterministic with neutral
  reliability).
- A movie transitions between production stages when a stage completes.
- An empty production queue is a safe no-op.

> **First run downloads a binary.** `mongodb-memory-server` downloads a `mongod`
> binary from `fastdl.mongodb.org` the first time it runs, so the integration
> tests need network access on first execution (the binary is cached for
> subsequent offline runs). On a machine without network access, run the unit
> tests directly with `node --test tests/engines.test.js`.

## Conventions

- Test files are named `*.test.js` and live under `backend/tests/`.
- Unit tests pass plain JavaScript objects to the engines (the engines mutate
  their inputs in place and never touch the database).
- Integration tests connect Mongoose to an ephemeral in-memory server in a
  `before` hook and tear it down in `after`.
