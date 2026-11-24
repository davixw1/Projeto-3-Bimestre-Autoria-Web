let xpDavi = 120;
let xpDarlan = 120;
const maxXP = 300;
let currentSelectedLevel = null;

const modal = document.getElementById('stage-modal');
const closeModalBtn = document.getElementById('close-modal-btn');
const completeStageBtn = document.getElementById('complete-stage-btn');
const stageNodes = document.querySelectorAll('.stage-node');

function openModal(dataset) {
    currentSelectedLevel = dataset.level;
    
    document.getElementById('modal-level-num').innerText = `FASE ${dataset.level}`;
    document.getElementById('modal-title').innerText = dataset.title;
    document.getElementById('modal-desc').innerText = dataset.desc;
    
    const linkBtn = document.getElementById('modal-link');
    if (dataset.link) {
        linkBtn.href = dataset.link;
    }

    modal.style.display = 'flex';
    modal.setAttribute('aria-hidden', 'false');
}

function closeModal() {
    modal.style.display = 'none';
    modal.setAttribute('aria-hidden', 'true');
}

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

closeModalBtn.addEventListener('click', closeModal);

completeStageBtn.addEventListener('click', () => {
    const xpBarDavi = document.getElementById('xp-bar-davi');
    const xpCounterDavi = document.getElementById('xp-counter-davi');
    const xpBarDarlan = document.getElementById('xp-bar-darlan');
    const xpCounterDarlan = document.getElementById('xp-counter-darlan');

    if (xpDavi < maxXP) {
        xpDavi += 30;
        xpDarlan += 30;

        if (xpDavi > maxXP) xpDavi = maxXP;
        if (xpDarlan > maxXP) xpDarlan = maxXP;

        const percentage = (xpDavi / maxXP) * 100;

        if (xpBarDavi && xpCounterDavi) {
            xpBarDavi.style.width = `${percentage}%`;
            xpCounterDavi.innerText = `${xpDavi} / ${maxXP} XP`;
            xpBarDavi.parentElement.setAttribute('aria-valuenow', xpDavi);
        }

        if (xpBarDarlan && xpCounterDarlan) {
            xpBarDarlan.style.width = `${percentage}%`;
            xpCounterDarlan.innerText = `${xpDarlan} / ${maxXP} XP`;
            xpBarDarlan.parentElement.setAttribute('aria-valuenow', xpDarlan);
        }
    }

    if (currentSelectedLevel) {
        const targetNode = document.querySelector(`.stage-node[data-level="${currentSelectedLevel}"]`);
        if (targetNode) {
            targetNode.classList.add('completed', 'animating');

            setTimeout(() => {
                targetNode.classList.remove('animating');
            }, 800);
        }
    }

    closeModal();
});

window.addEventListener('click', (event) => {
    if (event.target === modal) {
        closeModal();
    }
});

window.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && modal.style.display === 'flex') {
        closeModal();
    }
});