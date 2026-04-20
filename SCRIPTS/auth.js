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
        window.location.href = 'DADOS_PESSOAIS.html';
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

// Adicionar logo do usuário no canto superior
function adicionarLogoUsuario() {
    const usuario = obterUsuarioLogado();
    if (!usuario || !usuario.email) return;
    
    const imagemUrl = obterImagemUsuario(usuario.email);
    if (!imagemUrl) return;
    
    // Verificar se logo já existe
    if (document.querySelector('.user-logo')) return;
    
    // Criar elemento da logo
    const logoContainer = document.createElement('div');
    logoContainer.className = 'user-logo';
    logoContainer.innerHTML = `
        <img src="${imagemUrl}" alt="Logo do usuário" title="${usuario.email}">
    `;
    
    // Adicionar ao início do body
    document.body.insertBefore(logoContainer, document.body.firstChild);
    
    // Adicionar estilos se não existirem
    if (!document.querySelector('#logo-styles')) {
        const style = document.createElement('style');
        style.id = 'logo-styles';
        style.textContent = `
            .user-logo {
                position: fixed;
                top: 30px;
                right: 30px;
                z-index: 1000;
                cursor: pointer;
                transition: transform 0.3s ease;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            
            .user-logo:hover {
                transform: scale(1.1);
            }
            
            .user-logo img {
                width: 60px;
                height: 60px;
                border-radius: 50%;
                border: 2px solid var(--cyan);
                box-shadow: 0 0 20px rgba(43, 240, 255, 0.4);
                background: rgba(0, 0, 0, 0.3);
                object-fit: cover;
                object-position: center;
            }
        `;
        document.head.appendChild(style);
    }

    // Adicionar evento de clique para upload
    logoContainer.onclick = () => fazerUploadLogo(usuario.email);
}

// Obter URL de imagem do usuário (verifica imagem personalizada primeiro)
function obterImagemUsuario(email, tamanho = 80) {
    if (!email) return null;
    
    // Verificar se há imagem personalizada salva
    const imagemPersonalizada = localStorage.getItem(`userLogo_${email}`);
    if (imagemPersonalizada) {
        return imagemPersonalizada;
    }
    
    // Converter email para lowercase e remover espaços
    const emailLimpo = email.toLowerCase().trim();
    
    // Criar hash MD5 do email (simplificado - usando hash simples)
    const hash = btoa(emailLimpo).replace(/=/g, '').substring(0, 32);
    
    // URL do Gravatar
    return `https://www.gravatar.com/avatar/${hash}?d=identicon&s=${tamanho}`;
}

// Fazer upload de logo personalizada
function fazerUploadLogo(email) {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    
    input.onchange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        
        const reader = new FileReader();
        reader.onload = (event) => {
            const imageData = event.target.result;
            localStorage.setItem(`userLogo_${email}`, imageData);
            
            // Remover logo atual e adicionar nova
            const logoExistente = document.querySelector('.user-logo');
            if (logoExistente) logoExistente.remove();
            
            // Adicionar nova logo
            adicionarLogoUsuario();
            
            alert('Foto atualizada com sucesso!');
        };
        reader.readAsDataURL(file);
    };
    
    input.click();
}
