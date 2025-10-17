#!/usr/bin/env node
/*
 Create a simple coverage checklist by scanning React Navigation routes and screen files.
 Optionally include Figma pages/frames if design JSON is available.

 Usage: node scripts/audit-coverage.js
 Output: docs/coverage_screens.md
*/

const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const screensDir = path.join(root, 'src', 'screens');
const navigatorPath = path.join(root, 'src', 'navigation', 'AppNavigator.js');
const figmaFilePath = path.join(root, 'design', 'figma', 'file.json');

function walk(dir, list = []) {
  if (!fs.existsSync(dir)) return list;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, list);
    else if (entry.isFile() && /\.(jsx?|tsx?)$/.test(entry.name)) list.push(full);
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

function tryReadJson(p) {
  try {
    const raw = fs.readFileSync(p, 'utf8');
    const json = JSON.parse(raw);
    return json;
  } catch (e) {
    return null;
  }
}

function extractFigmaOutline(fileJson) {
  if (!fileJson) return { pages: [] };
  // Figma file format: document: { children: [ { id, name, type: 'CANVAS', children: [frames...] } ] }
  const pages = [];
  const doc = fileJson.document;
  if (!doc || !Array.isArray(doc.children)) return { pages: [] };
  for (const p of doc.children) {
    if (p.type !== 'CANVAS') continue;
    const page = { name: p.name, frames: [] };
    const frames = (p.children || []).filter((x) => x.type === 'FRAME' || x.type === 'COMPONENT_SET' || x.type === 'COMPONENT');
    for (const f of frames.slice(0, 100)) {
      page.frames.push(f.name);
    }
    pages.push(page);
  }
  return { pages };
}

function writeCoverage({ screenFiles, routes, figma }) {
  const outPath = path.join(root, 'docs', 'coverage_screens.md');
  const lines = [];
  lines.push('# UI Coverage Checklist');
  lines.push('');
  lines.push('## Detected Screen Files');
  screenFiles
    .sort()
    .forEach((p) => {
      const rel = path.relative(root, p);
      lines.push(`- [ ] ${rel}`);
    });
  lines.push('');
  lines.push('## Navigator Routes');
  routes.forEach((r) => {
    lines.push(`- [ ] (${r.type}) ${r.name} -> ${r.component}`);
  });
  lines.push('');
  if (figma && figma.pages && figma.pages.length) {
    lines.push('## Figma Pages/Frames (top 100 per page)');
    figma.pages.forEach((p) => {
      lines.push(`- ${p.name}`);
      p.frames.forEach((f) => lines.push(`  - [ ] ${f}`));
    });
  } else {
    lines.push('## Figma Pages/Frames');
    lines.push('- (No Figma outline found. Ensure design/figma/file.json is valid — your token/file key may be wrong.)');
  }
  fs.mkdirSync(path.join(root, 'docs'), { recursive: true });
  fs.writeFileSync(outPath, lines.join('\n'));
  return outPath;
}

const screenFiles = walk(screensDir);
const navSrc = fs.existsSync(navigatorPath) ? fs.readFileSync(navigatorPath, 'utf8') : '';
const routes = parseNavigatorRoutes(navSrc);
const figmaFile = tryReadJson(figmaFilePath);
const figmaOutline = extractFigmaOutline(figmaFile);
const out = writeCoverage({ screenFiles, routes, figma: figmaOutline });
console.log('Wrote checklist to', path.relative(root, out));

