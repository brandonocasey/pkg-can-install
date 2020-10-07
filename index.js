#!/usr/bin/env node

/* eslint-disable no-console */

const path = require('path');
const spawnSync = require('child_process').spawnSync;
const crypto = require('crypto');
const os = require('os');
const WORKING_DIR = path.join(os.tmpdir(), crypto.randomBytes(20).toString('hex'));
const fs = require('fs');
const exitHook = require('exit-hook');
const shell = require('shelljs');

exitHook(() => shell.rm('-rf', WORKING_DIR));

// create the working dir with a package.json
fs.mkdirSync(WORKING_DIR);
fs.writeFileSync(path.join(WORKING_DIR, 'package.json'), JSON.stringify({
  name: 'pkg-can-install-test',
  version: '1.0.0',
  description: '',
  main: 'index.js',
  scripts: {
    test: 'echo "Error: no test specified" && exit 1'
  },
  keywords: [],
  author: '',
  license: 'ISC'
}));

// try to install the current directory package into WORKING_DIR
const result = spawnSync('npm', [
  'i',
  '--prefer-online',
  '--production',
  '--no-audit',
  '--progress=false',
  process.cwd()
], {cwd: WORKING_DIR});

if (result.status !== 0) {
  const error = result.stderr.toString().trim();

  console.error(`pkg-can-install: error during install:\n\n${error}\n`);
}

process.exit(result.status);
