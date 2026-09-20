/**
 * GENTILEZA GERA GENTILEZA NO TRÂNSITO
 * Sistema de Interatividade e Experiência Visual
 */

// Estado Global do Projeto
const state = {
    kindnessIndex: 0,
    currentScenario: 0,
    isAccessible: false
};

document.addEventListener('DOMContentLoaded', () => {
    initBackground();
    initOpening();
    initNavigation();
    initIntersectionObserver();
    initStars();
});

// --- FUNDO CINEMATOGRÁFICO ---
function initBackground() {
    const particlesContainer = document.getElementById('particles');
    if (!particlesContainer) return;
    for (let i = 0; i < 50; i++) {
        const p = document.createElement('div');
        p.className = 'particle';
        p.style.width = Math.random() * 3 + 'px';
        p.style.height = p.style.width;
        p.style.left = Math.random() * 100 + 'vw';
        p.style.animationDuration = (Math.random() * 10 + 5) + 's';
        p.style.animationDelay = Math.random() * 5 + 's';
        particlesContainer.appendChild(p);
    }
}

// --- TELA DE ABERTURA ---
function initOpening() {
    const btnInit = document.getElementById('btn-init');
    const screen = document.getElementById('opening-screen');

    btnInit.addEventListener('click', () => {
        screen.style.transform = 'translateY(-100%)';
        screen.style.opacity = '0';

        setTimeout(() => {
            screen.classList.add('hidden');
            document.getElementById('main-nav').classList.remove('hidden');
            document.getElementById('main-content').classList.remove('hidden');
            document.getElementById('kindness-meter').classList.remove('hidden');
        }, 1000);
    });
}

// --- NAVEGAÇÃO ---
function initNavigation() {
    const sections = document.querySelectorAll('.section');
    const navItems = document.querySelectorAll('.nav-item');

    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            if (pageYOffset >= sectionTop - 100) {
                current = section.getAttribute('id');
            }
        });

        navItems.forEach(item => {
            item.classList.remove('active');
            if (item.getAttribute('href') === `#${current}`) {
                item.classList.add('active');
            }
        });
    });

    // Acessibilidade
    document.getElementById('btn-accessibility').addEventListener('click', () => {
        state.isAccessible = !state.isAccessible;
        document.body.classList.toggle('accessible');
    });
}

// --- INTERSECTION OBSERVER ---
function initIntersectionObserver() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
}

// --- GRUPO 1: PAINEL INTERATIVO ---
function handleAttitude(type, text) {
    const feedbackBox = document.getElementById('attitude-feedback');
    const feedbackText = document.getElementById('feedback-text');

    feedbackText.innerText = text;
    feedbackBox.classList.remove('hidden');

    incrementKindness(10);
}

// --- GRUPO 2: IMERSÃO ---
const scenarios = [
    {
        text: "Um pedestre aguarda para atravessar a faixa.",
        element: "🚶",
        pos: "Você deu passagem! O pedestre sorriu e o trânsito fluiu com respeito.",
        neg: "Você ignorou o pedestre. O estresse aumentou e a segurança diminuiu.",
        points: 15
    },
    {
        text: "Um motorista tenta entrar na sua faixa com a seta ligada.",
        element: "🚗",
        pos: "Você facilitou a manobra! Um gesto simples que evita acidentes.",
        neg: "Você fechou o motorista. A agressividade agora se espalha pela via.",
        points: 15
    },
    {
        text: "Um ciclista está pedalando ao seu lado em uma via estreita.",
        element: "🚲",
        pos: "Você manteve a distância segura. A vida do ciclista foi preservada.",
        neg: "Você passou colado no ciclista. O medo substituiu a cooperação.",
        points: 15
    }
];

function initImmersion() {
    updateScenario();
    document.getElementById('opt-positive').addEventListener('click', () => resolveScenario(true));
    document.getElementById('opt-negative').addEventListener('click', () => resolveScenario(false));
}

function updateScenario() {
    const s = scenarios[state.currentScenario];
    document.getElementById('scenario-text').innerText = s.text;
    document.getElementById('scene-element').innerText = s.element;
    document.getElementById('scenario-result').classList.add('hidden');
    document.querySelector('.options-group').classList.remove('hidden');
}

function resolveScenario(isPositive) {
    const s = scenarios[state.currentScenario];
    const resultBox = document.getElementById('scenario-result');
    const resultText = document.getElementById('result-text');

    resultText.innerText = isPositive ? s.pos : s.neg;
    resultBox.classList.remove('hidden');
    document.querySelector('.options-group').classList.add('hidden');

    if (isPositive) incrementKindness(s.points);
}

function nextScenario() {
    state.currentScenario++;
    if (state.currentScenario >= scenarios.length) state.currentScenario = 0;
    updateScenario();
}

// --- AVALIAÇÃO DA SALA ---
function initStars() {
    const stars = document.querySelectorAll('.star-rating i');
    const feedback = document.getElementById('rating-feedback');
    const feedbackText = document.getElementById('rating-text');

    const messages = {
        1: "Obrigado pela avaliação!",
        2: "Obrigado! Sua opinião é importante.",
        3: "Obrigado! Ficamos felizes com sua participação.",
        4: "Que bom que você gostou!",
        5: "Excelente! Obrigado por participar!"
    };

    stars.forEach(star => {
        star.addEventListener('mouseover', () => highlightStars(star.dataset.value));
        star.addEventListener('mouseout', () => highlightStars(0));
        star.addEventListener('click', () => {
            const val = star.dataset.value;
            feedbackText.innerText = `Você avaliou nossa apresentação com ${val} estrelas. ${messages[val]}`;
            feedback.classList.remove('hidden');
            highlightStars(val, true);
        });
    });

    function highlightStars(val, fixed = false) {
        stars.forEach(s => {
            s.classList.remove('active');
            if (s.dataset.value <= val) s.classList.add('active');
        });
    }
}

// --- SISTEMA DE ÍNDICE DE GENTILEZA ---
function incrementKindness(amount) {
    state.kindnessIndex += amount;
    if (state.kindnessIndex > 100) state.kindnessIndex = 100;

    const fill = document.getElementById('meter-fill');
    const valueText = document.getElementById('kindness-value');

    if (fill && valueText) {
        fill.style.width = state.kindnessIndex + '%';
        valueText.innerText = state.kindnessIndex + '%';
    }

    if (state.kindnessIndex === 100) {
        alert("✨ VOCÊ ESPALHOU GENTILEZA POR TODA A CIDADE! ✨");
    }
}

// Inicializa imersão separadamente
initImmersion();
