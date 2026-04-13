@echo off
echo ========================================
echo   TREINO OTIMIZADO - Setup
echo ========================================
echo.

echo Verificando se Node.js esta instalado...
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERRO: Node.js nao esta instalado!
    echo.
    echo Baixe e instale o Node.js de: https://nodejs.org
    echo.
    pause
    exit /b 1
)

echo Node.js encontrado! Versao:
node --version
echo.

echo Instalando dependencias...
npm install

if %errorlevel% neq 0 (
    echo ERRO: Falha ao instalar dependencias!
    pause
    exit /b 1
)

echo.
echo ========================================
echo   Dependencias instaladas com sucesso!
echo ========================================
echo.
echo Para iniciar o servidor, execute:
echo   npm start
echo.
echo Ou para desenvolvimento:
echo   cnao
echo.
echo Acesse: http://localhost:3000
echo.
pause