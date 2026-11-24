// Estado inicial salvo no navegador (para funcionar entre index.html e trajetoria.html)
const maxXP = 300;
let xpDavi = parseInt(localStorage.getItem('levelup_xp')) || 120;
let xpDarlan = parseInt(localStorage.getItem('levelup_xp')) || 120;
let completedStages = JSON.parse(localStorage.getItem('levelup_stages')) || [];
let currentSelectedLevel = null;

// =========================================
// 1. MENU DE NAVEGAÇÃO INTERATIVO (MOBILE)
// =========================================
const mobileMenuBtn = document.getElementById('mobile-menu-btn');
const navMenu = document.getElementById('nav-menu');

if (mobileMenuBtn && navMenu) {
    mobileMenuBtn.addEventListener('click', () => {
        const isOpen = navMenu.classList.toggle('open');
        mobileMenuBtn.setAttribute('aria-expanded', isOpen);
        mobileMenuBtn.innerText = isOpen ? '✕' : '☰';
    });
}

// =========================================
// 2. ATUALIZAÇÃO DE XP E NÍVEL EM AMBAS AS PÁGINAS
// =========================================
function updateXPUI() {
    const percentage = (xpDavi / maxXP) * 100;
    const currentLevel = Math.floor(xpDavi / 30) + 1;
    const formattedLvl = currentLevel < 10 ? `LVL 0${currentLevel}` : `LVL ${currentLevel}`;

    // Atualiza HUD do Menu Superior
    const navXpDisplay = document.getElementById('nav-xp-display');
    if (navXpDisplay) {
        navXpDisplay.innerText = `${xpDavi}/${maxXP}`;
    }

    // Atualiza Card Davi (se estiver na página index.html)
    const xpBarDavi = document.getElementById('xp-bar-davi');
    const xpCounterDavi = document.getElementById('xp-counter-davi');
    const lvlBadgeDavi = document.getElementById('lvl-badge-davi');

    if (xpBarDavi && xpCounterDavi) {
        xpBarDavi.style.width = `${percentage}%`;
        xpCounterDavi.innerText = `${xpDavi} / ${maxXP} XP`;
        xpBarDavi.parentElement.setAttribute('aria-valuenow', xpDavi);
    }
    if (lvlBadgeDavi) lvlBadgeDavi.innerText = formattedLvl;

    // Atualiza Card Darlan (se estiver na página index.html)
    const xpBarDarlan = document.getElementById('xp-bar-darlan');
    const xpCounterDarlan = document.getElementById('xp-counter-darlan');
    const lvlBadgeDarlan = document.getElementById('lvl-badge-darlan');

    if (xpBarDarlan && xpCounterDarlan) {
        xpBarDarlan.style.width = `${percentage}%`;
        xpCounterDarlan.innerText = `${xpDarlan} / ${maxXP} XP`;
        xpBarDarlan.parentElement.setAttribute('aria-valuenow', xpDarlan);
    }
    if (lvlBadgeDarlan) lvlBadgeDarlan.innerText = formattedLvl;

    // Marca fases já concluídas no mapa (se estiver na página trajetoria.html)
    completedStages.forEach(level => {
        const node = document.querySelector(`.stage-node[data-level="${level}"]`);
        if (node) node.classList.add('completed');
    });
}

// Executa ao carregar qualquer uma das páginas
updateXPUI();

// =========================================
// 3. INTERATIVIDADE DO MAPA E MODAL (trajetoria.html)
// =========================================
const modal = document.getElementById('stage-modal');
const closeModalBtn = document.getElementById('close-modal-btn');
const completeStageBtn = document.getElementById('complete-stage-btn');
const resetProgressBtn = document.getElementById('reset-progress-btn');
const stageNodes = document.querySelectorAll('.stage-node');

function openModal(dataset) {
    if (!modal) return;
    currentSelectedLevel = dataset.level;
    
    document.getElementById('modal-level-num').innerText = `FASE ${dataset.level}`;
    document.getElementById('modal-title').innerText = dataset.title;
    document.getElementById('modal-desc').innerText = dataset.desc;
    
    const linkBtn = document.getElementById('modal-link');
    if (dataset.link) {
        linkBtn.href = dataset.link;
    }

    // Ajusta botão caso a fase já tenha sido concluída
    if (completeStageBtn) {
        if (completedStages.includes(currentSelectedLevel)) {
            completeStageBtn.innerText = 'Fase Concluída ✓';
            completeStageBtn.disabled = true;
            completeStageBtn.style.opacity = '0.6';
        } else {
            completeStageBtn.innerText = 'Concluir Fase (+30 XP)';
            completeStageBtn.disabled = false;
            completeStageBtn.style.opacity = '1';
        }
    }

    modal.style.display = 'flex';
    modal.setAttribute('aria-hidden', 'false');
}

function closeModal() {
    if (!modal) return;
    modal.style.display = 'none';
    modal.setAttribute('aria-hidden', 'true');
}

if (stageNodes.length > 0) {
    stageNodes.forEach(node => {
        node.addEventListener('click', (e) => {
            openModal(e.currentTarget.dataset);
        });

        node.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                openModal(e.currentTarget.dataset);
            }
        });
    });
}

if (closeModalBtn) {
    closeModalBtn.addEventListener('click', closeModal);
}

if (completeStageBtn) {
    completeStageBtn.addEventListener('click', () => {
        if (currentSelectedLevel && !completedStages.includes(currentSelectedLevel)) {
            completedStages.push(currentSelectedLevel);
            localStorage.setItem('levelup_stages', JSON.stringify(completedStages));

            if (xpDavi < maxXP) {
                xpDavi = Math.min(xpDavi + 30, maxXP);
                xpDarlan = Math.min(xpDarlan + 30, maxXP);
                localStorage.setItem('levelup_xp', xpDavi);
            }

            updateXPUI();

            const targetNode = document.querySelector(`.stage-node[data-level="${currentSelectedLevel}"]`);
            if (targetNode) {
                targetNode.classList.add('completed', 'animating');
                setTimeout(() => targetNode.classList.remove('animating'), 800);
            }
        }
        closeModal();
    });
}

if (resetProgressBtn) {
    resetProgressBtn.addEventListener('click', () => {
        localStorage.removeItem('levelup_xp');
        localStorage.removeItem('levelup_stages');
        xpDavi = 120;
        xpDarlan = 120;
        completedStages = [];
        stageNodes.forEach(node => node.classList.remove('completed'));
        updateXPUI();
    });
}

window.addEventListener('click', (event) => {
    if (modal && event.target === modal) {
        closeModal();
    }
});

window.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && modal && modal.style.display === 'flex') {
        closeModal();
    }
});