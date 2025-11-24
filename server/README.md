Admin Deploy Server

This small Node.js Express server accepts a ZIP upload (field `site`) and commits files to a configured GitHub repository using the server's token.

Environment
- `GITHUB_TOKEN` - Personal Access Token with `repo` permission (or `public_repo` for public repos)
- `GITHUB_OWNER` - GitHub owner (user or org)
- `GITHUB_REPO` - Repository name
- `GITHUB_BRANCH` - Branch to commit to (default: `main`)

Run locally

```bash
cd server
npm install
GITHUB_TOKEN=your_token GITHUB_OWNER=you GITHUB_REPO=repo_name node index.js
```

Deploy options
- Vercel: push this `server/` as a separate server project and configure environment variables in Vercel dashboard.
- Google Cloud Run / AWS Elastic Beanstalk: containerize or run with Node and configure env vars.

Security
- Do NOT store long-lived tokens in client-side storage. Use server env vars or platform secrets.
- Optionally require per-request token: the server will use `token` field from form if server env token missing (less secure).

Usage from frontend
- The frontend will POST a `FormData` with field `site` (ZIP file) to the server's `/deploy` endpoint. Example response includes `url` pointing to the repo.

Limitations
- This server commits each file individually using `createOrUpdateFileContents`.
- For large uploads this may be slow; a better approach is to create a Git tree using Git data API and push a single commit.

