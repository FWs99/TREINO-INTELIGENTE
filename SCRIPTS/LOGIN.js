// ===== TOGGLE PASSWORD VISIBILITY =====
const togglePasswordBtn = document.getElementById('togglePassword');
const senhaInput = document.getElementById('senha');

togglePasswordBtn.addEventListener('click', function() {
    const type = senhaInput.getAttribute('type') === 'password' ? 'text' : 'password';
    senhaInput.setAttribute('type', type);
    
    // Muda o ícone
    this.textContent = type === 'password' ? '👁️' : '🙈';
});

// ===== FORM SUBMISSION =====
const loginForm = document.getElementById('loginForm');

loginForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const email = document.getElementById('email').value.trim();
    const senha = document.getElementById('senha').value;
    const lembrar = document.getElementById('lembrar').checked;
    
    // Validações básicas
    if (!email || !senha) {
        mostrarNotificacao('Por favor, preencha todos os campos', 'error');
        return;
    }
    
    // Validar formato de email
    if (!isValidEmail(email)) {
        mostrarNotificacao('Por favor, insira um email válido', 'error');
        return;
    }
    
    // Simulando o envio
    mostrarNotificacao('Entrando...', 'info');
    
    // Aqui você faria a requisição para o servidor
    console.log('Login:', {
        email: email,
        senha: senha,
        lembrar: lembrar
    });
    
    // Salvar sessão usando função do auth.js
    salvarSessao(email, lembrar);
    
    // Simular delay de login
    setTimeout(() => {
        mostrarNotificacao('Login realizado com sucesso! 🎉', 'success');
        
        // Redirecionar para HOME.html após 1 segundo
        setTimeout(() => {
            window.location.href = '/HOME.html';
        }, 800);
    }, 1500);
});

// ===== VALIDAR EMAIL =====
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// ===== LINK DE ESQUECEU SENHA =====
document.querySelector('.forgot-password').addEventListener('click', function(e) {
    e.preventDefault();
    
    const email = document.getElementById('email').value.trim();
    
    if (!email) {
        mostrarNotificacao('Por favor, insira seu email primeiro', 'error');
        return;
    }
    
    if (!isValidEmail(email)) {
        mostrarNotificacao('Por favor, insira um email válido', 'error');
        return;
    }
    
    mostrarNotificacao('Email de recuperação enviado! Verifique sua caixa de entrada.', 'success');
    // Aqui você faria a requisição para o backend enviar o email
});

// ===== LINK DE CADASTRO =====
document.querySelector('.link-signup').addEventListener('click', function(e) {
    e.preventDefault();
    
    mostrarNotificacao('Funcionalidade de cadastro em breve!', 'info');
    // Aqui você redirecionaria para a página de cadastro
    // window.location.href = '/signup';
});


// ===== ESTILOS DE NOTIFICAÇÃO VIA CSS =====
// Adicionar estilos das notificações que vêm do auth.js
const style = document.createElement('style');
style.textContent = `
    .notification {
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 16px 24px;
        border-radius: 12px;
        border-left: 4px solid;
        backdrop-filter: blur(10px);
        z-index: 9999;
        animation: slideInRight 0.3s ease-out;
        max-width: 90%;
    }
    @keyframes slideInRight {
        from { opacity: 0; transform: translateX(400px); }
        to { opacity: 1; transform: translateX(0); }
    }
    .notification.fade-out { animation: slideOutRight 0.3s ease-out forwards; }
    @keyframes slideOutRight {
        from { opacity: 1; transform: translateX(0); }
        to { opacity: 0; transform: translateX(400px); }
    }
    .notification-success { background: rgba(125, 247, 142, 0.15); color: #7df78e; border-left-color: #7df78e; }
    .notification-error { background: rgba(255, 107, 107, 0.15); color: #ff6b6b; border-left-color: #ff6b6b; }
    .notification-info { background: rgba(43, 240, 255, 0.15); color: #2bf0ff; border-left-color: #2bf0ff; }
    @media (max-width: 640px) { .notification { right: 10px; left: 10px; max-width: none; } }
`;
document.head.appendChild(style);
