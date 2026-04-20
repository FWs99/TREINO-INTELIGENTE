const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'database.db');

const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Erro ao conectar ao banco:', err.message);
        process.exit(1);
    } else {
        console.log('Conectado ao banco SQLite.');
        
        // Verificar estrutura da tabela dados_pessoais
        db.all('PRAGMA table_info(dados_pessoais)', [], (err, rows) => {
            if (err) {
                console.error('Erro ao verificar estrutura:', err);
            } else {
                console.log('Estrutura da tabela dados_pessoais:');
                console.log(rows);
                
                // Verificar se campo treino_gerado existe
                const hasTreinoGerado = rows.some(row => row.name === 'treino_gerado');
                console.log('\nCampo treino_gerado existe?', hasTreinoGerado ? 'SIM' : 'NÃO');
                
                if (!hasTreinoGerado) {
                    console.log('Adicionando campo treino_gerado...');
                    db.run('ALTER TABLE dados_pessoais ADD COLUMN treino_gerado INTEGER DEFAULT 0', (err) => {
                        if (err) {
                            console.error('Erro ao adicionar campo:', err);
                        } else {
                            console.log('Campo treino_gerado adicionado com sucesso!');
                        }
                        db.close();
                    });
                } else {
                    // Verificar dados
                    db.all('SELECT id, nome, treino_gerado FROM dados_pessoais', [], (err, rows) => {
                        if (err) {
                            console.error('Erro ao buscar dados:', err);
                        } else {
                            console.log('\nDados da tabela dados_pessoais:');
                            console.log(rows);
                        }
                        db.close();
                    });
                }
            }
        });
    }
});
