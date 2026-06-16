# PR Babysitter

## Scheduling model

This prompt is designed for a **Claude Code Desktop Scheduled Task**.

Configure the scheduled task to run:

```txt
every 3 minutes
```

Run while the spell-loop is active. Stop when the loop stops.

Each run does one thing: find open `spell/*` PRs targeting `main`, verify them, and merge the ones that are green. Do nothing else.

## Task

Look for open pull requests from branches matching `spell/*` targeting `main`:

```bash
gh pr list --base main --state open --json number,title,headRefName,url
```

If there are no open `spell/*` PRs, exit silently. Nothing to do.

## For each open spell PR

### 1) Check it out cleanly

```bash
git fetch origin
gh pr checkout <number>
```

### 2) Verify

Run the full gate from the repo root:

```bash
pnpm lint
pnpm build
```

Requirements:
* `pnpm lint` must exit 0 with zero warnings
* `pnpm build` must exit 0

If either fails, leave the PR open and note the failure in the run summary. Do not merge a failing PR.

### 3) Merge

If both checks pass, squash-merge and delete the branch:

```bash
gh pr merge <number> --squash --delete-branch --body ""
```

### 4) Return to main

```bash
git checkout main
git pull origin main
```

## Handling multiple open PRs

Process them one at a time in the order `gh pr list` returns them (oldest first).

If one fails verification, skip it and move on to the next.

## Failure rule

Never merge a PR that did not pass both `pnpm lint` and `pnpm build` in this run.

Do not re-run the build to try to get a different result.

Do not close or abandon the PR — leave it open for the next babysitter run or for Daniel to inspect.

## Final response format

At the end of each run, respond with one compact summary:

```txt
Open spell PRs found: <n>
Merged: <list of PR numbers/titles, or "none">
Skipped: <list with reason, or "none">
```

If there were no open PRs:

```txt
No open spell PRs. Nothing to do.
```
