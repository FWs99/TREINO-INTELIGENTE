const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Caminho do banco de dados
const dbPath = path.join(__dirname, 'database.db');

// Criar conexão com o banco
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Erro ao conectar ao banco:', err.message);
    } else {
        console.log('Conectado ao banco SQLite.');
        initDatabase();
    }
});

// Inicializar tabelas
function initDatabase() {
    // Tabela para dados pessoais
    db.run(`
        CREATE TABLE IF NOT EXISTS dados_pessoais (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nome TEXT NOT NULL,
            idade INTEGER NOT NULL,
            genero TEXT NOT NULL,
            altura REAL NOT NULL,
            peso REAL NOT NULL,
            nivel_condicionamento TEXT NOT NULL,
            data_cadastro DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `);

    // Tabela para anamnese
    db.run(`
        CREATE TABLE IF NOT EXISTS anamnese (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            id_pessoa INTEGER,
            habitos_alimentares TEXT,
            consumo_alcool TEXT,
            dores TEXT,
            pressao_arterial TEXT,
            descanso_repouso TEXT,
            horas_sono INTEGER,
            sono_regular TEXT,
            observacoes_saude TEXT,
            condicoes_saude TEXT,
            outras_doencas TEXT,
            objetivos TEXT,
            restricoes_lesoes TEXT,
            data_cadastro DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (id_pessoa) REFERENCES dados_pessoais (id)
        )
    `);

    // Tabela para análise postural
    db.run(`
        CREATE TABLE IF NOT EXISTS analise_postural (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            id_pessoa INTEGER,
            imagem_frontal TEXT,
            imagem_lateral_direita TEXT,
            imagem_lateral_esquerda TEXT,
            imagem_costas TEXT,
            desvios_cabeca TEXT,
            desvios_ombros TEXT,
            desvios_coluna TEXT,
            desvios_pelve TEXT,
            desvios_mmii TEXT,
            observacoes_postura TEXT,
            recomendacoes TEXT,
            data_cadastro DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (id_pessoa) REFERENCES dados_pessoais (id)
        )
    `);

    console.log('Tabelas criadas/verficadas com sucesso!');
}

module.exports = db;