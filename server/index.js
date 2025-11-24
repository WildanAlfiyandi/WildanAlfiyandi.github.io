require('dotenv').config();
const express = require('express');
const multer = require('multer');
const AdmZip = require('adm-zip');
const fs = require('fs');
const path = require('path');
const { Octokit } = require('@octokit/rest');

const upload = multer({ storage: multer.memoryStorage() });
const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;

// Expect env vars: GITHUB_TOKEN, GITHUB_OWNER, GITHUB_REPO, GITHUB_BRANCH
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const OWNER = process.env.GITHUB_OWNER;
const REPO = process.env.GITHUB_REPO;
const BRANCH = process.env.GITHUB_BRANCH || 'main';

if (!GITHUB_TOKEN || !OWNER || !REPO) {
  console.warn('Warning: GITHUB_TOKEN, GITHUB_OWNER or GITHUB_REPO not set. Server can still run but deploys will fail.');
}

const octokit = new Octokit({ auth: GITHUB_TOKEN });

app.post('/deploy', upload.single('site'), async (req, res) => {
  try {
    const token = req.body.token || null; // optional per-request token
    // If server has no env token but token provided in request, try to use it
    let client = octokit;
    if (!GITHUB_TOKEN && token) {
      client = new Octokit({ auth: token });
    }

    if (!client) return res.status(500).json({ message: 'No GitHub client available' });

    if (!req.file) return res.status(400).json({ message: 'Missing file upload (field: site)' });

    // Unzip in memory
    const zip = new AdmZip(req.file.buffer);
    const zipEntries = zip.getEntries();

    // Iterate entries and upload each file using createOrUpdateFileContents
    for (const entry of zipEntries) {
      if (entry.isDirectory) continue;
      const entryName = entry.entryName; // preserves folder path
      const content = entry.getData().toString('base64');

      // Get existing file to find sha
      let sha = undefined;
      try {
        const getResp = await client.repos.getContent({ owner: OWNER, repo: REPO, path: entryName, ref: BRANCH });
        if (getResp && getResp.data && getResp.data.sha) sha = getResp.data.sha;
      } catch (err) {
        // file may not exist, ignore
      }

      await client.repos.createOrUpdateFileContents({
        owner: OWNER,
        repo: REPO,
        path: entryName,
        message: `Server deploy: add/update ${entryName}`,
        content: content,
        branch: BRANCH,
        sha: sha
      });
    }

    // Return a success message and (optional) URL to the repo
    const repoUrl = `https://github.com/${OWNER}/${REPO}`;
    res.json({ success: true, message: 'Deploy finished', url: repoUrl });
  } catch (err) {
    console.error('Deploy error', err);
    res.status(500).json({ success: false, message: err.message });
  }
});

app.get('/', (req, res) => res.send('Admin Deploy Server running'));

app.listen(PORT, () => console.log(`Server listening on ${PORT}`));
