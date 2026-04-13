/**
 * AUTH.JS - Sistema de autenticação compartilhado
 * Use esse arquivo em qualquer página que precise verificar autenticação
 */

// Verificar autenticação
function verificarAutenticacao() {
    return localStorage.getItem('userSession') !== null;
}

// Obter dados do usuário logado
function obterUsuarioLogado() {
    const userSession = localStorage.getItem('userSession');
    return userSession ? JSON.parse(userSession) : null;
}

// Fazer logout
function fazerLogout() {
    localStorage.removeItem('userSession');
    window.location.href = '/LOGIN.html';
}

// Redirecionar se não autenticado
function redirecionarSeNaoAutenticado() {
    if (!verificarAutenticacao()) {
        window.location.href = '/LOGIN.html';
    }
}

// Redirecionar se já autenticado (para página de login)
function redirecionarSeAutenticado() {
    if (verificarAutenticacao()) {
        window.location.href = 'HOME.html';
    }
}

// Exibir notificação
function mostrarNotificacao(mensagem, tipo = 'info') {
    const notificacaoExistente = document.querySelector('.notification');
    if (notificacaoExistente) {
        notificacaoExistente.remove();
    }
    
    const notificacao = document.createElement('div');
    notificacao.className = `notification notification-${tipo}`;
    notificacao.textContent = mensagem;
    
    document.body.appendChild(notificacao);
    
    setTimeout(() => {
        notificacao.classList.add('fade-out');
        setTimeout(() => notificacao.remove(), 300);
    }, 4000);
}

// Guardar dados de sessão
function salvarSessao(email, lembrar = false) {
    const dados = {
        email: email,
        loginTime: new Date().toISOString(),
        lembrar: lembrar
    };
    localStorage.setItem('userSession', JSON.stringify(dados));
}
