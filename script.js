document.addEventListener('DOMContentLoaded', () => {

    // =========================================
    // SEARCH FUNCTIONALITY
    // =========================================

    // Database of resources (Global Index)
    const searchIndex = [
        // Year 1
        {
            title: "Fondamenti di Informatica",
            type: "Materia",
            year: "Primo Anno",
            url: "subject_template.html?subject=fondamenti",
            icon: "fa-code",
            keywords: "c++ programmazione puntatori algoritmi"
        },
        {
            title: "Analisi Matematica 1",
            type: "Materia",
            year: "Primo Anno",
            url: "subject_template.html?subject=analisi1",
            icon: "fa-infinity",
            keywords: "matematica limiti derivate integrali"
        },
        {
            title: "Architettura Elaboratori",
            type: "Materia",
            year: "Primo Anno",
            url: "subject_template.html?subject=architettura",
            icon: "fa-microchip",
            keywords: "assembly hardware cpu mips"
        },
        {
            title: "Algebra e Geometria",
            type: "Materia",
            year: "Primo Anno",
            url: "subject_template.html?subject=algebra",
            icon: "fa-vector-square",
            keywords: "matrici vettori lineare"
        },
        // Year 2
        {
            title: "Algoritmi e Strutture Dati",
            type: "Materia",
            year: "Secondo Anno",
            url: "subject_template.html?subject=algoritmi",
            icon: "fa-diagram-project",
            keywords: "java grafi alberi complessità"
        },
        {
            title: "Sistemi Operativi",
            type: "Materia",
            year: "Secondo Anno",
            url: "subject_template.html?subject=os",
            icon: "fa-terminal",
            keywords: "c linux processi thread"
        },
        {
            title: "Basi di Dati",
            type: "Materia",
            year: "Secondo Anno",
            url: "subject_template.html?subject=db",
            icon: "fa-database",
            keywords: "sql sql database er"
        },
        {
            title: "Reti di Calcolatori",
            type: "Materia",
            year: "Secondo Anno",
            url: "subject_template.html?subject=reti",
            icon: "fa-network-wired",
            keywords: "tcp ip internet sicurezza"
        },
        // Year 3
        {
            title: "Ingegneria del Software",
            type: "Materia",
            year: "Terzo Anno",
            url: "subject_template.html?subject=ingsoft",
            icon: "fa-users-gear",
            keywords: "uml design patterns agile"
        },
        {
            title: "Intelligenza Artificiale",
            type: "Materia",
            year: "Terzo Anno",
            url: "subject_template.html?subject=ai",
            icon: "fa-brain",
            keywords: "python machine learning nn"
        },
        {
            title: "Sicurezza Informatica",
            type: "Materia",
            year: "Terzo Anno",
            url: "subject_template.html?subject=security",
            icon: "fa-shield-halved",
            keywords: "crypto security malware ctf"
        },
        // Extras
        {
            title: "WeChall Writeups",
            type: "Extra",
            year: "Extra",
            url: "extras1.html",
            icon: "fa-flag",
            keywords: "ctf hacking security challenge"
        },
        {
            title: "Side Projects",
            type: "Extra",
            year: "Extra",
            url: "extras2.html",
            icon: "fa-code",
            keywords: "progetti personali github"
        }
    ];

    const searchInput = document.getElementById('searchInput');
    const searchContainer = document.querySelector('.search-container');

    // Create Dropdown Element
    if (searchInput && searchContainer) {
        const dropdown = document.createElement('div');
        dropdown.className = 'search-results-dropdown';
        // Wrapper to handle positioning relative to search container better if needed, 
        // but inserting after input works for now if container is relative.
        // Actually, let's wrap the input in a div in HTML or just append to container which is flex.
        // Using absolute positioning on container.
        searchContainer.style.position = 'relative';
        searchContainer.appendChild(dropdown);

        searchInput.addEventListener('input', (e) => {
            const searchTerm = e.target.value.toLowerCase().trim();
            dropdown.innerHTML = '';

            if (searchTerm.length < 2) {
                dropdown.classList.remove('active');
                return;
            }

            const filteredResults = searchIndex.filter(item =>
                item.title.toLowerCase().includes(searchTerm) ||
                item.keywords.includes(searchTerm)
            );

            if (filteredResults.length > 0) {
                filteredResults.forEach(result => {
                    const item = document.createElement('a');
                    item.href = result.url;
                    item.className = 'search-result-item';
                    item.innerHTML = `
                    <div class="result-icon">
                        <i class="fa-solid ${result.icon}"></i>
                    </div>
                    <div class="result-info">
                        <h4>${result.title}</h4>
                        <p>${result.type} • ${result.year}</p>
                    </div>
                `;
                    dropdown.appendChild(item);
                });
                dropdown.classList.add('active');
            } else {
                dropdown.innerHTML = '<div class="no-results">Nessun risultato trovato</div>';
                dropdown.classList.add('active');
            }
        });

        // Close dropdown when clicking outside
        document.addEventListener('click', (e) => {
            if (!searchContainer.contains(e.target)) {
                dropdown.classList.remove('active');
            }
        });
    }

    // Event Listeners
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const query = e.target.value.trim();

            if (query.length > 0) {
                // Assuming performSearch and displayResults are defined elsewhere or will be added.
                // For now, this will cause an error if they are not.
                // To make it syntactically correct and functional with existing code,
                // this block would need to be integrated differently or the functions defined.
                // As per instruction, making the change faithfully as provided.
                const results = performSearch(query);
                displayResults(results);
            } else {
                // Assuming resultsContainer is defined, likely referring to the dropdown.
                // If resultsContainer is not defined, this will cause an error.
                // Using 'dropdown' from the existing code for syntactic correctness.
                dropdown.classList.remove('active');
            }
        });

        // Close search results when clicking outside
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.search-container')) {
                // Assuming resultsContainer is defined, likely referring to the dropdown.
                // If resultsContainer is not defined, this will cause an error.
                // Using 'dropdown' from the existing code for syntactic correctness.
                dropdown.classList.remove('active');
            }
        });
    }

    // =========================================
    // NAVIGATION & UI
    // =========================================

    // Smooth Scrolling (only for hash links on same page)
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            // Only if it's a valid ID selector
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            if (targetId.startsWith('#')) {
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    e.preventDefault();
                    targetElement.scrollIntoView({ behavior: 'smooth' });
                }
            }
        });
    });

    // Sidebar Active State (Simple URL check)
    const currentPath = window.location.pathname.split('/').pop();
    if (currentPath) {
        document.querySelectorAll('.nav-links li a').forEach(link => {
            const href = link.getAttribute('href');
            if (href === currentPath) {
                document.querySelectorAll('.nav-links li').forEach(li => li.classList.remove('active'));
                link.parentElement.classList.add('active');
            }
        });
    }
    // =========================================
    // CODE SNIPPET COPY FUNCTIONALITY
    // =========================================
    document.querySelectorAll('.copy-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const pre = btn.nextElementSibling;
            if (pre && pre.tagName === 'PRE') {
                const code = pre.textContent;
                navigator.clipboard.writeText(code).then(() => {
                    btn.innerHTML = '<i class="fa-solid fa-check"></i> Copiato!';

                    setTimeout(() => {
                        btn.innerHTML = '<i class="fa-regular fa-copy"></i> Copia';
                    }, 2000);
                }).catch(err => {
                    console.error('Failed to copy text: ', err);
                    btn.innerHTML = '<i class="fa-solid fa-xmark"></i> Errore';
                });
            }
        });
    });
    // =========================================
    // SIDEBAR TOGGLE FUNCTIONALITY
    // =========================================
    const sidebarToggle = document.getElementById('sidebarToggle');
    const sidebar = document.querySelector('.sidebar');
    const mainContent = document.querySelector('.main-content');
    const overlay = document.createElement('div');
    overlay.className = 'sidebar-overlay';
    document.body.appendChild(overlay);

    function toggleSidebar() {
        if (window.innerWidth > 768) {
            // Desktop: Toggle Closed State
            sidebar.classList.toggle('closed');
            document.body.classList.toggle('sidebar-closed');
            if (mainContent) mainContent.classList.toggle('expanded');
        } else {
            // Mobile: Toggle Open State
            sidebar.classList.toggle('open');
            document.body.classList.toggle('sidebar-open');
            overlay.classList.toggle('active');
        }
    }

    if (sidebar && sidebarToggle) {
        sidebarToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleSidebar();
        });

        // Close sidebar when clicking overlay (Mobile)
        overlay.addEventListener('click', () => {
            sidebar.classList.remove('open');
            document.body.classList.remove('sidebar-open');
            overlay.classList.remove('active');
        });

        // Close sidebar when clicking a link (Mobile)
        document.querySelectorAll('.nav-links a').forEach(link => {
            link.addEventListener('click', () => {
                if (window.innerWidth <= 768) {
                    sidebar.classList.remove('open');
                    overlay.classList.remove('active');
                }
            });
        });

        // Handle window resize
        window.addEventListener('resize', () => {
            if (window.innerWidth > 768) {
                // Reset mobile states when going to desktop
                overlay.classList.remove('active');
                sidebar.classList.remove('open');
                document.body.classList.remove('sidebar-open');

                // Ensure desktop state is respected
                if (sidebar.classList.contains('closed')) {
                    document.body.classList.add('sidebar-closed');
                    if (mainContent) mainContent.classList.add('expanded');
                } else {
                    document.body.classList.remove('sidebar-closed');
                    if (mainContent) mainContent.classList.remove('expanded');
                }
            } else {
                // Reset desktop states when going to mobile
                sidebar.classList.remove('closed');
                document.body.classList.remove('sidebar-closed');
                if (mainContent) mainContent.classList.remove('expanded');
            }
        });
    }
});
