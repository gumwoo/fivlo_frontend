#!/usr/bin/env node
/*
 Compare declared Navigator routes vs. existing screen files.
 Output a short report to docs/coverage_diff.md
*/

const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const screensDir = path.join(root, 'src', 'screens');
const navigatorPath = path.join(root, 'src', 'navigation', 'AppNavigator.js');

function walkScreens(dir, acc = []) {
  if (!fs.existsSync(dir)) return acc;
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, ent.name);
    if (ent.isDirectory()) walkScreens(full, acc);
    else if (ent.isFile() && /\.(jsx?|tsx?)$/.test(ent.name)) acc.push(full);
  }
  return acc;
}

function parseRoutes(src) {
  const routes = [];
  const screenRegex = /<\s*Stack\.Screen\s+name=\"([^\"]+)\"\s+component=\{?([^\}\s>]+)\}?/g;
  const tabRegex = /<\s*Tab\.Screen\s+name=\"([^\"]+)\"\s+component=\{?([^\}\s>]+)\}?/g;
  let m;
  while ((m = screenRegex.exec(src))) routes.push({ type: 'Stack', name: m[1], component: m[2] });
  while ((m = tabRegex.exec(src))) routes.push({ type: 'Tab', name: m[1], component: m[2] });
  return routes;
}

function basenameNoExt(p) {
  return path.basename(p, path.extname(p));
}

const screenFiles = walkScreens(screensDir);
const screenNames = new Set(screenFiles.map(basenameNoExt));
const navSrc = fs.existsSync(navigatorPath) ? fs.readFileSync(navigatorPath, 'utf8') : '';
const routes = parseRoutes(navSrc);

const routeComponents = new Set(routes.map((r) => r.component));

const filesNotInNavigator = Array.from(screenNames).filter((n) => !routeComponents.has(n));
const routesWithoutFile = Array.from(routeComponents).filter((c) => !screenNames.has(c));

const out = [];
out.push('# Code Coverage Diff');
out.push('');
out.push('## Screens not referenced by any route');
filesNotInNavigator.sort().forEach((n) => {
  const file = screenFiles.find((f) => basenameNoExt(f) === n);
  out.push(`- ${n} (${path.relative(root, file)})`);
});
if (filesNotInNavigator.length === 0) out.push('- (none)');

out.push('');
out.push('## Routes pointing to missing files');
routesWithoutFile.sort().forEach((c) => out.push(`- ${c}`));
if (routesWithoutFile.length === 0) out.push('- (none)');

out.push('');
out.push('## All routes');
routes.forEach((r) => out.push(`- (${r.type}) ${r.name} -> ${r.component}`));

const outPath = path.join(root, 'docs', 'coverage_diff.md');
fs.mkdirSync(path.dirname(outPath), { recursive: true });
fs.writeFileSync(outPath, out.join('\n'));
console.log('Wrote', path.relative(root, outPath));

