import fs from 'fs/promises';
import path from 'path';

// Define the new structure
const structure = {
    'css': ['style.css', 'animations.css', 'auth.css'],
    'js': [
        'script.js', 'animations.js', 'auth.js', 'auth-guard.js',
        'firebase-config.js', 'navbar-auth.js', 'nerd-stats.js',
        'notes.js', 'personal.js', 'theme-switcher.js', 'year-pages.js'
    ],
    'scripts': ['add_favicon.mjs', 'replace_html.mjs'],
    'assets': ['CV.pdf', 'Certificazioni'],
    'pages/projects': [
        'project-email.html', 'project-fileflow.html',
        'project-json.html', 'project-tetris.html'
    ],
    'pages/notes': [
        'year1.html', 'year2.html', 'year3.html',
        'Analisi2.html', 'IAP.html', 'RO.html',
        'extras1.html', 'extras2.html',
        'Analisi2', 'IAP', 'RO'
    ],
    'pages/templates': [
        'subject_template.html', 'subject_template copy.html'
    ]
};

// Files that stay in the root
const rootFiles = [
    'index.html', '404.html', 'auth.html', 'notes.html', 'nerd-stats.html',
    'favicon.png', 'favicon.ico', 'sitemap.xml',
    '.DS_Store', '.firebase', '.firebaserc', '.git', '.github', '.gitignore',
    '.kiro', '.vscode', 'FIREBASE_SETUP.md', 'TESTING_SETUP.md',
    'node_modules', 'package-lock.json', 'package.json', 'vitest.config.js', 'reorg.mjs'
];

async function fileExists(filePath) {
    try {
        await fs.access(filePath);
        return true;
    } catch {
        return false;
    }
}

async function createDirs() {
    for (const dir of Object.keys(structure)) {
        await fs.mkdir(dir, { recursive: true });
        console.log(`Created directory: ${dir}`);
    }
}

async function moveFiles() {
    for (const [dir, files] of Object.entries(structure)) {
        for (const file of files) {
            if (await fileExists(file)) {
                // Determine if it's a file or directory
                const stat = await fs.stat(file);
                const destPath = path.join(dir, file);

                await fs.rename(file, destPath);
                console.log(`Moved ${file} -> ${destPath}`);
            } else {
                console.log(`Warning: ${file} not found in root.`);
            }
        }
    }
}

async function run() {
    console.log('--- Starting Reorganization ---');
    await createDirs();
    await moveFiles();
    console.log('--- Move Complete ---');
}

run().catch(console.error);
