name: Update trial manifest

on:
  push:
    branches:
      - main
    paths:
      - 'src/content/**'
      - 'scripts/generate-trial-manifest.js'
      - '.github/workflows/update-trial-manifest.yml'
  pull_request:
    branches:
      - main
    paths:
      - 'src/content/**'
      - 'scripts/generate-trial-manifest.js'
      - '.github/workflows/update-trial-manifest.yml'

permissions:
  contents: write

jobs:
  regenerate-manifest:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout repository
        uses: actions/checkout@v4
        with:
          fetch-depth: 0

      - name: Set up Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'

      - name: Generate manifest
        run: node scripts/generate-trial-manifest.js

      - name: Commit updated manifest
        if: github.event_name == 'push'
        uses: stefanzweifel/git-auto-commit-action@v5
        with:
          commit_message: "chore: update trial manifest"
          file_pattern: public/trial-manifest.js
