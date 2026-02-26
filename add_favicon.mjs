import fs from 'fs/promises';
import path from 'path';

async function processHtmlFiles(dir, isRoot) {
    const files = await fs.readdir(dir);
    for (const file of files) {
        const filePath = path.join(dir, file);
        const stat = await fs.stat(filePath);
        if (stat.isDirectory() && !file.startsWith('.') && file !== 'node_modules') {
            await processHtmlFiles(filePath, false);
        } else if (file.endsWith('.html')) {
            let content = await fs.readFile(filePath, 'utf-8');
            let modified = false;

            const prefix = isRoot ? '' : '../';
            const faviconTag1 = `<link rel="icon" href="${prefix}favicon.png" type="image/png">`;
            const faviconTag2 = `<link rel="apple-touch-icon" href="${prefix}favicon.png">`;

            // Check if already has favicon.png
            if (!content.includes('favicon.png')) {
                // Find <head> or similar tag inside <head>
                if (content.includes('</head>')) {
                    content = content.replace('</head>', `    ${faviconTag1}\n    ${faviconTag2}\n</head>`);
                    modified = true;
                }
            } else if (content.includes('href="/favicon.png"')) {
                // To support local browsing perfectly based on prefix constraint
                if (!isRoot) {
                    content = content.replace(/href="\/favicon\.png"/g, `href="${prefix}favicon.png"`);
                    modified = true;
                } else if (isRoot) {
                    content = content.replace(/href="\/favicon\.png"/g, `href="favicon.png"`);
                    modified = true;
                }
            }

            if (modified) {
                await fs.writeFile(filePath, content, 'utf-8');
                console.log(`Added/Updated favicon tags in ${filePath}`);
            }
        }
    }
}

processHtmlFiles('.', true).catch(console.error);
