#!/usr/bin/env node
/*
 Generate a mapping template between Navigator routes/components and screen files,
 with an empty column for Figma frame names and status.

 Output: docs/figma_mapping.md
*/

const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const screensDir = path.join(root, 'src', 'screens');
const navigatorPath = path.join(root, 'src', 'navigation', 'AppNavigator.js');

function walk(dir, list = []) {
  if (!fs.existsSync(dir)) return list;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, list);
    else if (entry.isFile() && /\.jsx?$/.test(entry.name)) list.push(full);
  }
  return list;
}

function parseNavigatorRoutes(src) {
  const routes = [];
  const screenRegex = /<\s*Stack\.Screen\s+name=\"([^\"]+)\"\s+component=\{?([^\}\s>]+)\}?/g;
  const tabRegex = /<\s*Tab\.Screen\s+name=\"([^\"]+)\"\s+component=\{?([^\}\s>]+)\}?/g;
  let m;
  while ((m = screenRegex.exec(src))) routes.push({ type: 'Stack', name: m[1], component: m[2] });
  while ((m = tabRegex.exec(src))) routes.push({ type: 'Tab', name: m[1], component: m[2] });
  return routes;
}

function indexScreens(files) {
  const map = new Map();
  for (const f of files) {
    const base = path.basename(f, path.extname(f));
    map.set(base, f);
  }
  return map;
}

const screenFiles = walk(screensDir);
const navSrc = fs.readFileSync(navigatorPath, 'utf8');
const routes = parseNavigatorRoutes(navSrc);
const index = indexScreens(screenFiles);

const out = [];
out.push('# Figma Mapping Template');
out.push('');
out.push('- Edit the last two columns (FigmaFrame, Status).');
out.push('- Status values: planned | in-progress | styled | wired | done');
out.push('');
out.push('| Route | Component | File | FigmaFrame | Status |');
out.push('|---|---|---|---|---|');

for (const r of routes) {
  const file = index.get(r.component) || '';
  const rel = file ? path.relative(path.join(__dirname, '..'), file) : '';
  out.push(`| ${r.name} | ${r.component} | ${rel} |  |  |`);
}

const outPath = path.join(root, 'docs', 'figma_mapping.md');
fs.mkdirSync(path.dirname(outPath), { recursive: true });
fs.writeFileSync(outPath, out.join('\n'));
console.log('Wrote', path.relative(root, outPath));

