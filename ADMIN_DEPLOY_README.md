Admin Deploy & Build Guide

Overview
- This project includes a browser-based admin dashboard that can upload files and (optionally) push them directly to a GitHub repository using a Personal Access Token stored in browser localStorage.
- The Android app lives in `android-app/` and can be built with the included Gradle wrapper.

Recommended (secure) deployment flow
1. Do NOT store long-lived tokens in browser localStorage on shared machines.
2. Preferred approach: create a server-side endpoint (serverless function) that receives an uploaded ZIP and performs a GitHub commit using a token stored securely in the server environment or GitHub Actions secrets.

Quick start — GitHub direct deploy (browser)
1. Open the app and login as admin (create via "Buat Akun Admin" on the login page).
2. Open Settings (⚙️) and provide:
   - GitHub Personal Access Token (repo scope for private repos or public_repo for public repos)
   - Owner (username or organization)
   - Repo (repository name)
   - Branch (optional, default `main`)
3. Upload files in the Upload area and press `Start Deploy`. Files will be PUT to `/contents/{path}` using GitHub REST API.

Notes & limitations
- The browser-based uploader writes each file by its filename to the repo root. Subfolders are not created by default (filename only). For folder support, a hierarchical path must be provided or a zip/unpack server-side flow used.
- Token security: tokens stored in `localStorage` are accessible to scripts on that origin. Only use this on your trusted machine.
 - Token security: tokens stored in `localStorage` are accessible to scripts on that origin. Only use this on your trusted machine.
 - For production, prefer server-side deploy or GitHub Actions that reads a source branch and publishes to `gh-pages` using secrets.

Server-based deploy (recommended)
1. A simple server scaffold is included in `server/`. It accepts a ZIP file in field `site`, unpacks it, and commits files to the configured GitHub repository using a token in server environment variables.
2. Deploy that server to Vercel, Cloud Run, or similar and set `GITHUB_TOKEN`, `GITHUB_OWNER`, `GITHUB_REPO`, and `GITHUB_BRANCH` as secrets.
3. In the admin Settings, set the "Server Deploy Endpoint" to `https://your-server.example.com/deploy` and optionally a per-request token if you want that extra check.

Security note: this server is a scaffold for demo/prototyping. For production use, add authentication, rate limiting, request validation, and use a single commit via Git trees for efficiency.

GitHub Action
- A workflow file is included at `.github/workflows/admin-deploy.yml` to assist with automatic deploys to `gh-pages` when `main` is pushed.
- If you prefer that approach: push files/changes via a server-side process or use the GitHub REST API but store the token in `Secrets` and trigger a push. Avoid placing tokens in repo files.

Android build
- Build debug APK locally (Linux/macOS container):

```bash
cd android-app
./gradlew assembleDebug
```
- Built debug APK path: `android-app/app/build/outputs/apk/debug/app-debug.apk`
- To install on a connected device:

```bash
adb install -r android-app/app/build/outputs/apk/debug/app-debug.apk
```

Further help
- I can add a serverless function to accept a ZIP upload and commit with a secure token (recommended). Tell me if you want: "Add serverless deploy endpoint" and I will scaffold it and show how to wire secrets.
