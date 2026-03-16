import fs from 'fs/promises';
import path from 'path';

async function processHtmlFiles(dir, isRoot) {
    const files = await fs.readdir(dir);
    for (const file of files) {
        const filePath = path.join(dir, file);
        const stat = await fs.stat(filePath);
        if (stat.isDirectory() && !file.startsWith('.') && file !== 'node_modules') {
            await processHtmlFiles(filePath, false);
        } else if (file.endsWith('.html') && file !== 'auth.html') {
            let content = await fs.readFile(filePath, 'utf-8');
            let modified = false;

            // Remove sidebar toggle button
            if (content.includes('<!-- Floating Sidebar Toggle -->')) {
                content = content.replace(/<!-- Floating Sidebar Toggle -->[\s\S]*?<\/button>\s*/, '');
                modified = true;
            }

            // Match sidebar
            const sidebarRegex = /<!-- Navigation Sidebar -->[\s\S]*?<\/nav>\s*/;

            if (sidebarRegex.test(content)) {
                let prefix = isRoot ? '' : '../';

                let isIndex = file === 'index.html';
                let isNotes = file === 'notes.html';
                let isStats = file === 'nerd-stats.html';

                let newNavbar = `<!-- Top Navigation Bar -->
        <nav class="top-navbar">
            <div class="nav-left">
                <div class="logo">
                    <i class="fa-solid fa-graduation-cap"></i>
                    <span>MyNotes</span>
                </div>
            </div>
            
            <div class="top-nav">
                <ul class="nav-links">
                    <li class="${isIndex ? 'active' : ''}"><a href="${prefix}index.html"><i class="fa-solid fa-house"></i> Home</a></li>
                    <li class="${isNotes ? 'active' : ''}"><a href="${prefix}notes.html"><i class="fa-solid fa-book"></i> Archivio Appunti <i id="authPadlock" class="fa-solid fa-lock" title="Stato Accesso"></i></a></li>
                    <li class="${isStats ? 'active' : ''}"><a href="${prefix}nerd-stats.html"><i class="fa-solid fa-chart-line"></i> Stats</a></li>
                </ul>
            </div>

            <div class="nav-right">
                <a href="https://links.mattiascarpa.it" target="_blank" style="color: var(--text-secondary); font-size: 1.2rem; transition: 0.2s;"><i class="fa-solid fa-link"></i></a>
                <a href="mailto:tiume00@gmail.com" style="color: var(--text-secondary); font-size: 1.2rem; transition: 0.2s;"><i class="fa-solid fa-envelope"></i></a>
            </div>
        </nav>\n\n        `;

                content = content.replace(sidebarRegex, newNavbar);
                modified = true;
            }

            if (modified) {
                await fs.writeFile(filePath, content, 'utf-8');
                console.log(`Replaced sidebar in ${filePath}`);
            }
        }
    }
}

processHtmlFiles('.', true).catch(console.error);
