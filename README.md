# TREINO OTIMIZADO - Sistema de Avaliação Física

Sistema completo para coleta de dados de usuários para personalização de treinos, com análise postural e banco de dados.

## 🚀 Como Usar (Windows)

### 1. Verificar se Node.js está instalado
Abra o Prompt de Comando e digite:
```cmd
node --version
```
Se não estiver instalado, baixe de: https://nodejs.org

### 2. Executar Setup
Clique duas vezes no arquivo `setup.bat` ou execute:
```cmd
setup.bat
```

### 3. Iniciar Servidor
Clique duas vezes no arquivo `start.bat` ou execute:
```cmd
start.bat
```

### 4. Acessar no Navegador
Abra: http://localhost:3000

**Administração**: http://localhost:3000/admin.html

## � Início Rápido (Windows)

### Opção 1: Scripts Automáticos (Recomendado)
1. **Clique duas vezes** em `setup.bat` (instala dependências)
2. **Clique duas vezes** em `start.bat` (inicia servidor)
3. Abra http://localhost:3000

### Opção 2: Passo a Passo Detalhado
Consulte o arquivo `INSTRUCOES.txt` para guia completo.

### Opção 3: Checklist
Use `CHECKLIST.txt` para marcar cada passo.

## �📋 Funcionalidades

### Formulários Disponíveis:
1. **Dados Pessoais** (HOME.html)
   - Nome, idade, gênero
   - Altura, peso, nível de condicionamento

2. **Anamnese** (ANAMNESE.html)
   - Hábitos alimentares e consumo de álcool
   - Dores, pressão arterial, sono
   - Condições médicas específicas
   - Objetivos de treino (perda de peso, hipertrofia, etc.)

3. **Análise Postural** (POSTURA.html)
   - Upload de 4 imagens (frontal, laterais, costas)
   - Identificação de desvios posturais
   - Recomendações específicas

## 🗄️ Banco de Dados

### Tabelas Criadas:
- `dados_pessoais` - Informações básicas do usuário
- `anamnese` - Dados de saúde e hábitos
- `analise_postural` - Desvios posturais e imagens

### Tecnologias:
- **Backend**: Node.js + Express
- **Banco**: SQLite3
- **Upload**: Multer (para imagens)
- **Frontend**: HTML5 + CSS3 + JavaScript

## �‍💼 Administração

Acesse `admin.html` para visualizar todos os cadastros:

- **Lista completa** de usuários cadastrados
- **Status** de anamnese e análise postural
- **Visualização** de imagens posturais
- **Filtros** por status (completos/incompletos)
- **Detalhes** completos de cada cadastro

## �📁 Estrutura do Projeto

```
/
├── HOME.html              # Página inicial (dados pessoais)
├── ANAMNESE.html          # Formulário de anamnese
├── POSTURA.html           # Análise postural com upload
├── admin.html             # Painel administrativo
├── STYLE HOME.css         # Estilos CSS
├── server.js              # Servidor Express
├── database.js            # Configuração do banco
├── package.json           # Dependências
├── README.md              # Este arquivo
├── INSTRUCOES.txt         # Guia passo a passo detalhado
├── CHECKLIST.txt          # Lista de verificação
├── TROUBLESHOOTING.txt    # Solução de problemas comuns
├── setup.bat              # Script de instalação (Windows)
├── start.bat              # Script para iniciar servidor
├── .gitignore             # Arquivos ignorados
├── exemplo-dados.sql      # Dados de exemplo para teste
├── uploads/               # Pasta para imagens (criada automaticamente)
└── database.db           # Banco SQLite (criado automaticamente)
```

## 🔧 API Endpoints

### POST /submit-dados-pessoais
Salva dados pessoais no banco.

### POST /submit-anamnese
Salva dados da anamnese.

### POST /submit-postural
Salva análise postural com imagens.

### GET /api/cadastros
Lista todos os cadastros (para admin).

### GET /uploads/:filename
Serve imagens salvas.

### GET /admin.html
Página de administração.

## 🧪 Dados de Exemplo

Para testar o sistema, use o arquivo `exemplo-dados.sql` que contém:
- 3 usuários de exemplo
- Dados completos de anamnese
- Análise postural com desvios identificados

Para inserir os dados de exemplo no banco:
```bash
sqlite3 database.db < exemplo-dados.sql
```

## 📸 Upload de Imagens

- **Limite**: 5MB por imagem
- **Formatos**: JPG, PNG, GIF, WebP
- **Pasta**: `uploads/`
- **Nomes**: Timestamp + nome original

## 🎨 Design

- **Tema**: Cyberpunk (ciano + verde)
- **Responsivo**: Funciona em mobile e desktop
- **Glass Morphism**: Efeito de vidro nos formulários
- **Animações**: Hover effects suaves

## 🔒 Segurança

- Validação de tipos de arquivo
- Limite de tamanho de upload
- Sanitização de dados
- CORS habilitado

## � Comandos Essenciais

### Verificar Instalação
```cmd
node --version
npm --version
```

### Iniciar Sistema
```cmd
# Opção 1: Scripts automáticos
setup.bat    # Instalar dependências
start.bat    # Iniciar servidor

# Opção 2: Manual
npm install  # Instalar
npm start    # Iniciar
```

### Desenvolvimento
```cmd
npm run dev  # Servidor com auto-restart
```

### Banco de Dados
```cmd
sqlite3 database.db                    # Abrir banco
.schema                               # Ver estrutura
SELECT * FROM dados_pessoais;         # Ver dados
.read exemplo-dados.sql              # Inserir exemplos
```

Para mais comandos, consulte `COMANDOS.txt`.

## 🤖 Geração de Treino com IA (Novo!)

Sistema integrado com **Google Gemini** para gerar planos de treino personalizados baseados em dados científicos.

### Como Usar:
1. Complete a avaliação completa (Dados Pessoais → Anamnese → Análise Postural)
2. Após a análise postural, será redirecionado para **TREINO.html**
3. Insira sua chave de API do Google Gemini
4. O sistema gerará um plano de treino personalizado automaticamente

### Obter Chave de API:
- Acesse: https://ai.google.dev/
- Faça login com sua conta Google
- Clique em "Create API key"
- Copie a chave e insira em TREINO.html

### O Plano Inclui:
- ✅ Análise do perfil físico e médico
- ✅ Estrutura do treino (dias, frequência, tipo)
- ✅ Exercícios específicos com séries/repetições
- ✅ Recomendações de alimentação e recuperação
- ✅ Prevenção de lesões baseada em postura
- ✅ Progressão ao longo do tempo

Para mais detalhes, consulte `GUIA_IA_TREINO.txt`.

## 🌐 URLs Importantes

| Página | URL | Função |
|--------|-----|--------|
| Início | http://localhost:3000 | Formulário de dados pessoais |
| Anamnese | http://localhost:3000/ANAMNESE.html | Histórico médico |
| Postura | http://localhost:3000/POSTURA.html | Análise postural |
| **Treino com IA** | http://localhost:3000/TREINO.html | Geração automática |
| Dashboard | http://localhost:3000/DASHBOARD.html | Visualizar dados |
| Admin | http://localhost:3000/admin.html | Administração |

## 🆕 Próximos Passos

- [x] Dashboard administrativo ✅
- [x] Geração automática de treinos com IA ✅
- [ ] Exportação de treino em PDF
- [ ] Histórico de avaliações
- [ ] Relatórios com gráficos de progresso
- [ ] Autenticação de usuários
- [ ] Backup automático do banco de dados
- [ ] Suporte a múltiplos usuários simultâneos

Para mais ajuda, consulte:
- `INSTRUCOES.txt` - Guia passo a passo detalhado
- `CHECKLIST.txt` - Lista de verificação
- `TROUBLESHOOTING.txt` - Solução de problemas comuns

---

**Desenvolvido para otimizar a personalização de treinos através de dados completos e análise postural profissional.** 💪