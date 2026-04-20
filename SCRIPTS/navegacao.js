/**
 * NAVEGACAO.JS - Sistema de navegação entre páginas
 * Controla o fluxo: Login -> Dados -> Anamnese -> Postura -> Treino
 */

// Verificar em qual etapa o usuário está
function verificarEtapaAtual() {
    const idPessoa = localStorage.getItem('idPessoa');
    const anamneseCompleta = localStorage.getItem('anamneseCompleta');
    const posturalCompleta = localStorage.getItem('posturalCompleta');
    
    if (!idPessoa) return 'dados-pessoais';
    if (!anamneseCompleta) return 'anamnese';
    if (!posturalCompleta) return 'postura';
    return 'treino';
}

// Salvar progresso
function salvarProgresso(etapa, dados) {
    switch(etapa) {
        case 'dados-pessoais':
            localStorage.setItem('idPessoa', dados.id);
            localStorage.removeItem('anamneseCompleta');
            localStorage.removeItem('posturalCompleta');
            break;
        case 'anamnese':
            localStorage.setItem('anamneseCompleta', 'true');
            localStorage.removeItem('posturalCompleta');
            break;
        case 'postura':
            localStorage.setItem('posturalCompleta', 'true');
            break;
    }
}

// Navegar para próxima etapa
function proximaEtapa() {
    const atual = verificarEtapaAtual();
    
    switch(atual) {
        case 'dados-pessoais':
            window.location.href = '/ANAMNESE.html';
            break;
        case 'anamnese':
            window.location.href = '/POSTURA.html';
            break;
        case 'postura':
            window.location.href = '/TREINO.html';
            break;
        case 'treino':
            alert('Você já completou todas as etapas!');
            break;
    }
}

// Navegar para etapa anterior
function etapaAnterior() {
    const atual = verificarEtapaAtual();
    
    switch(atual) {
        case 'anamnese':
            window.location.href = '/DADOS_PESSOAIS.html';
            break;
        case 'postura':
            window.location.href = '/ANAMNESE.html';
            break;
        case 'treino':
            window.location.href = '/POSTURA.html';
            break;
        default:
            window.location.href = '/DADOS_PESSOAIS.html';
    }
}

// Resetar progresso (novo treino)
function resetarProgresso() {
    localStorage.removeItem('idPessoa');
    localStorage.removeItem('anamneseCompleta');
    localStorage.removeItem('posturalCompleta');
    window.location.href = '/DADOS_PESSOAIS.html';
}

// Adicionar indicador de progresso
function criarIndicadorProgresso() {
    const container = document.createElement('div');
    container.className = 'progress-indicator';
    
    const etapas = [
        { nome: 'Dados Pessoais', id: 'dados', url: 'DADOS_PESSOAIS.html' },
        { nome: 'Anamnese', id: 'anamnese', url: 'ANAMNESE.html' },
        { nome: 'Postura', id: 'postura', url: 'POSTURA.html' },
        { nome: 'Treino', id: 'treino', url: 'TREINO.html' }
    ];
    
    const atual = verificarEtapaAtual();
    let html = '<div class="progress-steps">';
    
    etapas.forEach((etapa, index) => {
        const completed = index < etapas.findIndex(e => e.id === atual) || 
                         (etapa.id === atual && etapa.id !== 'treino');
        const current = etapa.id === atual;
        
        html += `
            <div class="progress-step ${completed ? 'completed' : ''} ${current ? 'current' : ''}">
                <div class="step-number">${index + 1}</div>
                <div class="step-label">${etapa.nome}</div>
            </div>
        `;
    });
    
    html += '</div>';
    container.innerHTML = html;
    
    // Adicionar ao início do body
    document.body.insertBefore(container, document.body.firstChild);
    
    // Adicionar estilos se não existirem
    if (!document.querySelector('#progress-styles')) {
        const style = document.createElement('style');
        style.id = 'progress-styles';
        style.textContent = `
            .progress-indicator {
                background: rgba(107, 114, 128, 0.1);
                border: 1px solid rgba(107, 114, 128, 0.3);
                border-radius: 12px;
                padding: 20px;
                margin-bottom: 30px;
                backdrop-filter: blur(10px);
            }
            
            .progress-steps {
                display: flex;
                justify-content: space-between;
                align-items: center;
                max-width: 600px;
                margin: 0 auto;
            }
            
            .progress-step {
                display: flex;
                flex-direction: column;
                align-items: center;
                flex: 1;
                position: relative;
            }
            
            .progress-step:not(:last-child)::after {
                content: '';
                position: absolute;
                top: 20px;
                right: -50%;
                width: 100%;
                height: 2px;
                background: rgba(107, 114, 128, 0.2);
                z-index: 1;
            }
            
            .progress-step.completed:not(:last-child)::after {
                background: var(--cyan);
            }
            
            .step-number {
                width: 40px;
                height: 40px;
                border-radius: 50%;
                background: rgba(107, 114, 128, 0.2);
                border: 2px solid rgba(107, 114, 128, 0.4);
                display: flex;
                align-items: center;
                justify-content: center;
                font-weight: bold;
                color: var(--text);
                margin-bottom: 8px;
                position: relative;
                z-index: 2;
            }
            
            .progress-step.completed .step-number {
                background: var(--cyan);
                border-color: var(--cyan);
                color: #000;
            }
            
            .progress-step.current .step-number {
                background: var(--green);
                border-color: var(--green);
                color: #000;
                box-shadow: 0 0 20px rgba(75, 85, 99, 0.5);
            }
            
            .step-label {
                font-size: 0.8em;
                color: var(--muted);
                text-align: center;
            }
            
            .progress-step.completed .step-label,
            .progress-step.current .step-label {
                color: var(--text);
                font-weight: 600;
            }
            
            @media (max-width: 600px) {
                .progress-steps {
                    flex-direction: column;
                    gap: 15px;
                }
                
                .progress-step:not(:last-child)::after {
                    display: none;
                }
                
                .progress-step {
                    flex-direction: row;
                    justify-content: flex-start;
                    gap: 15px;
                }
                
                .step-number {
                    margin-bottom: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }
}

// Inicializar navegação
document.addEventListener('DOMContentLoaded', function() {
    // Adicionar indicador de progresso em todas as páginas (exceto login)
    if (!window.location.pathname.includes('LOGIN.html')) {
        criarIndicadorProgresso();
    }
    
    // REMOVIDO: Não redirecionar automaticamente para permitir que o usuário escolha
    // O usuário agora pode acessar qualquer página diretamente
});

// Exportar funções para uso global
window.navegacao = {
    proximaEtapa,
    etapaAnterior,
    resetarProgresso,
    verificarEtapaAtual,
    salvarProgresso
};
