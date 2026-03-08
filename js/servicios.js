/* =========================================
   SERVICIOS LOGIC
   ========================================= */

// Hardcoded list of files from img/servicios
const servicesFiles = [
    "encias(periodancia)_general.png",
    "encias_SUB_limpieza_profunda_(curetaje).png",
    "encias_SUB_tratamiento_de_gingivitis_y_periodontisis.png",
    "endodoncia_general.png",
    "endonancia_SUB_retratamiento_endodontico.png", // Typo in filename 'endonancia'
    "endonancia_SUB_tratamiento_de_nervio.png",
];

document.addEventListener('DOMContentLoaded', () => {
    renderServices();
    initModal();
});

function normalizeText(text) {
    if (!text) return "";
    return text.replace(/_/g, ' ')
        .replace(/\.png/g, '')
        .replace(/\(periodancia\)/, '(Periodoncia)') // Fix spelling
        .replace(/endonancia/, 'Endodoncia') // Fix spelling
        .replace(/\b\w/g, c => c.toUpperCase()); // Capitalize
}

function renderServices() {
    const container = document.getElementById('services-container');
    if (!container) return;

    // Group files by Category
    const categories = {};

    servicesFiles.forEach(file => {
        let category, name, isGeneral;

        // Normalize filename for processing (fix known typos for grouping)
        let processedFile = file.replace('endonancia', 'endodoncia');

        if (processedFile.includes('_SUB_')) {
            const parts = processedFile.split('_SUB_');
            category = normalizeText(parts[0]);
            name = normalizeText(parts[1]);
            isGeneral = false;
        } else if (processedFile.includes('_general')) {
            category = normalizeText(processedFile.replace('_general.png', ''));
            name = "General"; // Or reuse category name
            isGeneral = true;
        } else {
            // Fallback
            category = "Otros";
            name = normalizeText(processedFile);
            isGeneral = false;
        }

        if (!categories[category]) {
            categories[category] = {
                generalImg: null,
                items: []
            };
        }

        if (isGeneral) {
            categories[category].generalImg = file;
            // Also add as an item if you want it clickable
            categories[category].items.unshift({ name: "Visión General", file: file, isTitle: true });
        } else {
            categories[category].items.push({ name: name, file: file });
        }
    });

    // Render HTML
    container.innerHTML = '';

    for (const [catName, data] of Object.entries(categories)) {
        const section = document.createElement('div');
        section.className = 'service-category';

        // Header
        const header = document.createElement('div');
        header.className = 'category-title';
        header.innerHTML = `<span>${catName}</span>`;
        section.appendChild(header);

        // Grid
        const grid = document.createElement('div');
        grid.className = 'services-grid-inner';

        data.items.forEach(item => {
            const card = document.createElement('div');
            card.className = 'service-card';
            card.innerHTML = `
                <div class="service-img-wrapper">
                    <img src="img/servicios/${item.file}" loading="lazy" alt="${item.name}">
                </div>
                <div class="service-info">
                    <h4>${item.name}</h4>
                    <button class="btn btn-secondary" style="padding: 0.5rem 1rem; font-size: 0.8rem;" 
                        onclick="openModal('${item.name}', 'img/servicios/${item.file}', '${catName}')">
                        Detalles
                    </button>
                </div>
            `;
            grid.appendChild(card);
        });

        section.appendChild(grid);
        container.appendChild(section);
    }
}

function initModal() {
    const modal = document.getElementById('modal-overlay');
    const closeBtn = document.getElementById('modal-close');

    if (!modal) return;

    closeBtn.addEventListener('click', () => {
        modal.classList.remove('active');
    });

    modal.addEventListener('click', (e) => {
        if (e.target === modal) modal.classList.remove('active');
    });
}

// Global function for onclick
window.openModal = function (title, imgSrc, category) {
    const modal = document.getElementById('modal-overlay');
    const mTitle = document.getElementById('modal-title');
    const mImg = document.getElementById('modal-img');
    const mDesc = document.getElementById('modal-desc');
    const mWhat = document.getElementById('modal-whatsapp');

    mTitle.innerText = title;
    mImg.src = imgSrc;
    mDesc.innerText = `Consulta con nuestros especialistas sobre el tratamiento de ${title}. Garantizamos la mejor atención en ${category}.`;

    const text = encodeURIComponent(`Hola, estoy interesado en el servicio de ${title} (${category}).`);
    mWhat.href = `https://wa.me/50688888888?text=${text}`;

    modal.classList.add('active');
};
