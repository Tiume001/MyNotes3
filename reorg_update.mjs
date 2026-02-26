import fs from 'fs/promises';
import path from 'path';

// Mapping old paths to new paths
const pathMap = {
    // CSS
    'style.css': 'css/style.css',
    'animations.css': 'css/animations.css',
    'auth.css': 'css/auth.css',

    // JS
    'script.js': 'js/script.js',
    'animations.js': 'js/animations.js',
    'auth.js': 'js/auth.js',
    'auth-guard.js': 'js/auth-guard.js',
    'firebase-config.js': 'js/firebase-config.js',
    'navbar-auth.js': 'js/navbar-auth.js',
    'nerd-stats.js': 'js/nerd-stats.js',
    'notes.js': 'js/notes.js',
    'personal.js': 'js/personal.js',
    'theme-switcher.js': 'js/theme-switcher.js',
    'year-pages.js': 'js/year-pages.js',

    // Assets
    'CV.pdf': 'assets/CV.pdf',

    // HTML Pages
    'project-email.html': 'pages/projects/project-email.html',
    'project-fileflow.html': 'pages/projects/project-fileflow.html',
    'project-json.html': 'pages/projects/project-json.html',
    'project-tetris.html': 'pages/projects/project-tetris.html',

    'year1.html': 'pages/notes/year1.html',
    'year2.html': 'pages/notes/year2.html',
    'year3.html': 'pages/notes/year3.html',
    'Analisi2.html': 'pages/notes/Analisi2.html',
    'IAP.html': 'pages/notes/IAP.html',
    'RO.html': 'pages/notes/RO.html',
    'extras1.html': 'pages/notes/extras1.html',
    'extras2.html': 'pages/notes/extras2.html'
};

async function getFiles(dir, fileList = []) {
    const files = await fs.readdir(dir);
    for (const file of files) {
        if (file === 'node_modules' || file.startsWith('.') || file === 'reorg_move.mjs' || file === 'reorg_update.mjs' || file === 'scripts') continue;

        const filePath = path.join(dir, file);
        const stat = await fs.stat(filePath);

        if (stat.isDirectory()) {
            await getFiles(filePath, fileList);
        } else if (filePath.endsWith('.html') || filePath.endsWith('.js') || filePath.endsWith('.css')) {
            fileList.push(filePath);
        }
    }
    return fileList;
}

function getRelativePath(fromPath, toPath) {
    const fromDir = path.dirname(fromPath);
    let rel = path.relative(fromDir, toPath);
    if (!rel.startsWith('.')) rel = './' + rel;
    // Standardize to forward slash depending on OS
    return rel.replace(/\\/g, '/').replace(/^\.\//, '');
}

async function updateFile(filePath) {
    let content = await fs.readFile(filePath, 'utf-8');
    let original = content;

    for (const [oldName, newLoc] of Object.entries(pathMap)) {
        // Calculate relative path from current file to the new location
        const relPath = getRelativePath(filePath, newLoc);

        // Regex definition: Looks for href="oldName", src="oldName", url('oldName'), or just bare oldName in imports
        // Ensures it doesn't match something like "css/style.css" already

        // 1. SRC and HREF attributes exact matches
        const exactMatchRegex = new RegExp(`(href|src)=["']([^"']*)?${oldName}["']`, 'g');
        content = content.replace(exactMatchRegex, (match, attr, prefix) => {
            // Se c'è già un prefisso relativo giusto ignoriamo
            if (prefix && prefix.includes('css/') || prefix && prefix.includes('js/')) return match;
            return `${attr}="${relPath}"`;
        });

        // 2. JS Imports (e.g. import from './auth.js' or import from 'auth.js')
        const importRegex = new RegExp(`from\\s+["']\\.?/?${oldName}["']`, 'g');
        content = content.replace(importRegex, `from '${relPath.startsWith('.') ? relPath : './' + relPath}'`);

        // 3. CSS URL
        const urlRegex = new RegExp(`url\\(["']?\\.?/?${oldName}["']?\\)`, 'g');
        content = content.replace(urlRegex, `url('${relPath}')`);
    }

    // Also fix Certificazioni paths
    content = content.replace(/(href|src)=["']Certificazioni\/([^"']+)["']/g, (match, attr, file) => {
        const relPath = getRelativePath(filePath, `assets/Certificazioni/${file}`);
        return `${attr}="${relPath}"`;
    });

    if (content !== original) {
        await fs.writeFile(filePath, content, 'utf-8');
        console.log(`Updated paths in ${filePath}`);
    }
}

async function run() {
    console.log('--- Scanning for files to update ---');
    const files = await getFiles('.');
    for (const file of files) {
        await updateFile(file);
    }
    console.log('--- Update Complete ---');
}

run().catch(console.error);
