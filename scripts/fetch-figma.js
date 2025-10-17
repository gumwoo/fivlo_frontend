#!/usr/bin/env node
/**
 * Fetch basic data from a Figma file and (optionally) generate Colors from Variables.
 *
 * Usage:
 *   FIGMA_TOKEN=xxxxx FIGMA_FILE_KEY=yyyyy node scripts/fetch-figma.js
 *
 * Output:
 *   - design/figma/file.json
 *   - design/figma/styles.json (best-effort)
 *   - design/figma/variables.json (best-effort)
 *   - src/styles/color.js (generated from color variables, if present)
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

// Load local env if present (.env.local > .env)
try {
  const dotenv = require('dotenv');
  const cwd = process.cwd();
  const localPath = path.join(cwd, '.env.local');
  const envPath = path.join(cwd, '.env');
  if (fs.existsSync(localPath)) dotenv.config({ path: localPath });
  else if (fs.existsSync(envPath)) dotenv.config({ path: envPath });
} catch (_) {
  // dotenv optional
}

const FIGMA_TOKEN = process.env.FIGMA_TOKEN;
const FIGMA_FILE_KEY = process.env.FIGMA_FILE_KEY;

if (!FIGMA_TOKEN || !FIGMA_FILE_KEY) {
  console.error('[figma] Missing FIGMA_TOKEN or FIGMA_FILE_KEY environment variables.');
  console.error('Example: FIGMA_TOKEN=xxxxx FIGMA_FILE_KEY=yyyyy node scripts/fetch-figma.js');
  process.exit(1);
}

function getJson(url) {
  return new Promise((resolve, reject) => {
    const req = https.request(
      url,
      {
        method: 'GET',
        headers: {
          // Send both headers to avoid env-specific behavior
          'Authorization': `Bearer ${FIGMA_TOKEN}`,
          'X-Figma-Token': FIGMA_TOKEN,
        },
      },
      (res) => {
        let data = '';
        res.on('data', (chunk) => (data += chunk));
        res.on('end', () => {
          try {
            const json = JSON.parse(data);
            resolve(json);
          } catch (e) {
            reject(new Error(`Failed to parse JSON from ${url}: ${e.message}`));
          }
        });
      }
    );
    req.on('error', reject);
    req.end();
  });
}

function ensureDir(p) {
  fs.mkdirSync(p, { recursive: true });
}

function writeJson(p, obj) {
  fs.writeFileSync(p, JSON.stringify(obj, null, 2));
}

function toCamelCase(name) {
  return name
    .replace(/[^a-zA-Z0-9]+(.)/g, (m, chr) => chr.toUpperCase())
    .replace(/^[^a-zA-Z]+/, '')
    .replace(/^(.)/, (m, chr) => chr.toLowerCase());
}

function colorObjToHex(c) {
  const r = Math.round(((c.r ?? c.red ?? 0) * 255));
  const g = Math.round(((c.g ?? c.green ?? 0) * 255));
  const b = Math.round(((c.b ?? c.blue ?? 0) * 255));
  const a = c.a ?? c.alpha;
  const hex = (n) => n.toString(16).padStart(2, '0');
  if (typeof a === 'number' && a >= 0 && a < 1) {
    const alpha = Math.round(a * 255);
    return `#${hex(r)}${hex(g)}${hex(b)}${hex(alpha)}`;
  }
  return `#${hex(r)}${hex(g)}${hex(b)}`;
}

function tryGenerateColorsFromVariables(variablesJson) {
  // Figma Variables API shape (simplified): { meta: { variables: [ { id, name, resolvedType, valuesByMode | valueByMode | resolvedValuesByMode, ... } ], variableCollections: [ { id, modes: [ { modeId } ] } ] } }
  const meta = variablesJson?.meta || variablesJson;
  const variables = meta?.variables;
  const collections = meta?.variableCollections || meta?.collections;
  if (!Array.isArray(variables) || variables.length === 0) return null;

  // Choose first mode per collection
  const modeByCollection = new Map();
  (collections || []).forEach((c) => {
    const mode = (c.modes && c.modes[0]?.modeId) || c.defaultModeId || c.modes?.[0]?.mode_id;
    if (mode) modeByCollection.set(c.id, mode);
  });

  const colors = {};
  variables.forEach((v) => {
    const type = v.resolvedType || v.type;
    if (type !== 'COLOR') return;
    const modeId = modeByCollection.get(v.variableCollectionId || v.collection_id) || Object.keys(v.valuesByMode || v.valueByMode || v.resolvedValuesByMode || {})[0];
    const byMode = v.valuesByMode || v.valueByMode || v.resolvedValuesByMode;
    const value = byMode ? byMode[modeId] : v.value;
    if (!value) return;

    // The value can be a color object or nested under .r/.g/.b
    const color = value?.r !== undefined ? value : value?.color || value?.value || value;
    if (!color) return;
    const hex = colorObjToHex(color);
    const key = toCamelCase(v.name.replace(/\//g, ' '));
    if (key) colors[key] = hex;
  });

  if (Object.keys(colors).length === 0) return null;
  const file = `// generated from Figma Variables\nexport const Colors = ${JSON.stringify(colors, null, 2)};\n`;
  return file;
}

(async () => {
  const base = `https://api.figma.com/v1/files/${FIGMA_FILE_KEY}`;
  const outDir = path.join(__dirname, '..', 'design', 'figma');
  ensureDir(outDir);

  console.log('[figma] Fetching file, styles, variables...');
  const file = await getJson(base);
  writeJson(path.join(outDir, 'file.json'), file);
  if (!file || file.err || file.status >= 400 || !file.document) {
    console.error('[figma] Failed to fetch file.json');
    console.error('[figma] Hint: Check FIGMA_TOKEN (account must have view access) and FIGMA_FILE_KEY.');
    console.error('[figma] file.json first bytes:', JSON.stringify(file).slice(0, 120));
    process.exit(1);
  }

  try {
    const styles = await getJson(`${base}/styles`);
    writeJson(path.join(outDir, 'styles.json'), styles);
  } catch (e) {
    console.warn('[figma] styles fetch skipped:', e.message);
  }

  let variables = null;
  try {
    variables = await getJson(`${base}/variables`);
    writeJson(path.join(outDir, 'variables.json'), variables);
  } catch (e) {
    console.warn('[figma] variables fetch skipped:', e.message);
  }

  // Generate Colors from variables
  const colorsJs = tryGenerateColorsFromVariables(variables);
  if (colorsJs) {
    const colorsPath = path.join(__dirname, '..', 'src', 'styles', 'color.js');
    fs.writeFileSync(colorsPath, colorsJs);
    console.log('[figma] Generated Colors at', path.relative(path.join(__dirname, '..'), colorsPath));
  } else {
    console.log('[figma] No color variables found. Skipping color.js generation.');
  }

  console.log('[figma] Done.');
})();
