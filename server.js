require('dotenv').config();
const express = require('express');
const multer = require('multer');
const path = require('path');
const cors = require('cors');
const db = require('./SCRIPTS/database');
const { gerarTreino } = require('./SCRIPTS/ai-treino');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir arquivos estáticos das pastas TELAS, CSS TELAS, SCRIPTS e uploads
app.use('/TELAS', express.static(path.join(__dirname, 'TELAS')));
app.use('/CSS-TELAS', express.static(path.join(__dirname, 'CSS-TELAS')));
app.use('/SCRIPTS', express.static(path.join(__dirname, 'SCRIPTS')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Redirecionar rotas principais para arquivos HTML
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'TELAS', 'LOGIN.html'));
});
app.get('/home', (req, res) => {
    res.sendFile(path.join(__dirname, 'TELAS', 'DADOS_PESSOAIS.html'));
});
app.get('/anamnese', (req, res) => {
    res.sendFile(path.join(__dirname, 'TELAS', 'ANAMNESE.html'));
});
app.get('/postura', (req, res) => {
    res.sendFile(path.join(__dirname, 'TELAS', 'POSTURA.html'));
});
app.get('/treino', (req, res) => {
    res.sendFile(path.join(__dirname, 'TELAS', 'TREINO.html'));
});
app.get('/dashboard', (req, res) => {
    res.sendFile(path.join(__dirname, 'TELAS', 'DASHBOARD.html'));
});
app.get('/admin', (req, res) => {
    res.sendFile(path.join(__dirname, 'TELAS', 'admin.html'));
});

// Rotas para arquivos HTML diretos (com extensão)
app.get('/LOGIN.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'TELAS', 'LOGIN.html'));
});
app.get('/DADOS_PESSOAIS.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'TELAS', 'DADOS_PESSOAIS.html'));
});
app.get('/ANAMNESE.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'TELAS', 'ANAMNESE.html'));
});
app.get('/POSTURA.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'TELAS', 'POSTURA.html'));
});
app.get('/TREINO.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'TELAS', 'TREINO.html'));
});
app.get('/DASHBOARD.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'TELAS', 'DASHBOARD.html'));
});
app.get('/admin.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'TELAS', 'admin.html'));
});

// Configuração do multer para upload de imagens
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Pasta para salvar imagens
    },
    filename: (req, file, cb) => {
        // Nome único para cada arquivo
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limite
    },
    fileFilter: (req, file, cb) => {
        // Aceitar apenas imagens
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Apenas arquivos de imagem são permitidos!'), false);
        }
    }
});

// Criar pasta uploads se não existir
const fs = require('fs');
if (!fs.existsSync('uploads')) {
    fs.mkdirSync('uploads');
}

// Rota para processar dados pessoais
app.post('/submit-dados-pessoais', (req, res) => {
    const { nome, idade, genero, altura, peso, nivel } = req.body;

    const sql = `
        INSERT INTO dados_pessoais (nome, idade, genero, altura, peso, nivel_condicionamento)
        VALUES (?, ?, ?, ?, ?, ?)
    `;

    db.run(sql, [nome, idade, genero, altura, peso, nivel], function(err) {
        if (err) {
            console.error('Erro ao salvar dados pessoais:', err);
            return res.status(500).json({ error: 'Erro ao salvar dados' });
        }

        // Retornar o ID do registro criado
        res.json({
            success: true,
            id: this.lastID,
            message: 'Dados pessoais salvos com sucesso!'
        });
    });
});

// Rota para processar anamnese
app.post('/submit-anamnese', (req, res) => {
    const {
        habitos, alcool, dores, pressao, repouso, sono, sonoregular,
        saude, dias_treino, condicao, outras_doencas, objetivos, condicoes
    } = req.body;

    // Converter arrays para string (checkboxes múltiplos)
    const doresStr = Array.isArray(dores) ? dores.join(', ') : dores || '';
    const condicaoStr = Array.isArray(condicao) ? condicao.join(', ') : condicao || '';
    const objetivosStr = Array.isArray(objetivos) ? objetivos.join(', ') : objetivos || '';

    const sql = `
        INSERT INTO anamnese (
            habitos_alimentares, consumo_alcool, dores, pressao_arterial,
            descanso_repouso, horas_sono, sono_regular, observacoes_saude,
            dias_treino, condicoes_saude, outras_doencas, objetivos, restricoes_lesoes
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    db.run(sql, [
        habitos, alcool, doresStr, pressao, repouso, sono, sonoregular, saude, dias_treino || 3,
        condicaoStr, outras_doencas, objetivosStr, condicoes
    ], function(err) {
        if (err) {
            console.error('Erro ao salvar anamnese:', err);
            return res.status(500).json({ error: 'Erro ao salvar anamnese' });
        }

        res.json({
            success: true,
            id: this.lastID,
            message: 'Anamnese salva com sucesso!'
        });
    });
});

// Rota para processar análise postural com upload de imagens
app.post('/submit-postural', upload.fields([
    { name: 'imagem_frontal', maxCount: 1 },
    { name: 'imagem_lateral_direita', maxCount: 1 },
    { name: 'imagem_lateral_esquerda', maxCount: 1 },
    { name: 'imagem_costas', maxCount: 1 }
]), (req, res) => {
    const {
        observacoes_postura
    } = req.body;

    // Caminhos das imagens salvas
    const imagens = {
        frontal: req.files.imagem_frontal ? req.files.imagem_frontal[0].filename : null,
        lateral_direita: req.files.imagem_lateral_direita ? req.files.imagem_lateral_direita[0].filename : null,
        lateral_esquerda: req.files.imagem_lateral_esquerda ? req.files.imagem_lateral_esquerda[0].filename : null,
        costas: req.files.imagem_costas ? req.files.imagem_costas[0].filename : null
    };

    // Campos de desvios posturais (opcional, se não enviado ficam vazios)
    const cabecaStr = req.body.desvio_cabeca ? (Array.isArray(req.body.desvio_cabeca) ? req.body.desvio_cabeca.join(', ') : req.body.desvio_cabeca) : '';
    const ombrosStr = req.body.desvio_ombro ? (Array.isArray(req.body.desvio_ombro) ? req.body.desvio_ombro.join(', ') : req.body.desvio_ombro) : '';
    const colunaStr = req.body.desvio_coluna ? (Array.isArray(req.body.desvio_coluna) ? req.body.desvio_coluna.join(', ') : req.body.desvio_coluna) : '';
    const pelveStr = req.body.desvio_pelvis ? (Array.isArray(req.body.desvio_pelvis) ? req.body.desvio_pelvis.join(', ') : req.body.desvio_pelvis) : '';
    const mmiiStr = req.body.desvio_mmii ? (Array.isArray(req.body.desvio_mmii) ? req.body.desvio_mmii.join(', ') : req.body.desvio_mmii) : '';

    const sql = `
        INSERT INTO analise_postural (
            imagem_frontal, imagem_lateral_direita, imagem_lateral_esquerda, imagem_costas,
            desvios_cabeca, desvios_ombros, desvios_coluna, desvios_pelve,
            desvios_mmii, observacoes_postura
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    db.run(sql, [
        imagens.frontal, imagens.lateral_direita, imagens.lateral_esquerda, imagens.costas,
        cabecaStr, ombrosStr, colunaStr, pelveStr, mmiiStr, observacoes_postura
    ], function(err) {
        if (err) {
            console.error('Erro ao salvar análise postural:', err);
            return res.status(500).json({ error: 'Erro ao salvar análise postural' });
        }

        res.json({
            success: true,
            id: this.lastID,
            message: 'Análise postural salva com sucesso!',
            imagens: imagens
        });
    });
});

// Rota para listar todos os cadastros (para admin)
app.get('/api/cadastros', (req, res) => {
    const sql = `
        SELECT
            dp.*,
            a.*,
            ap.*
        FROM dados_pessoais dp
        LEFT JOIN anamnese a ON dp.id = a.id_pessoa
        LEFT JOIN analise_postural ap ON dp.id = ap.id_pessoa
        ORDER BY dp.data_cadastro DESC
    `;

    db.all(sql, [], (err, rows) => {
        if (err) {
            console.error('Erro ao buscar cadastros:', err);
            return res.status(500).json({ error: 'Erro ao buscar dados' });
        }

        console.log('Dados retornados para admin:', rows.length, 'cadastros');
        if (rows.length > 0) {
            console.log('Primeiro cadastro - treino_gerado:', rows[0].treino_gerado);
        }
        res.json(rows);
    });
});

// Rota para apagar cadastro incompleto
app.delete('/api/cadastro/:id', (req, res) => {
    const id = req.params.id;
    
    // Apagar dados pessoais (cascade vai apagar anamnese e postural)
    const sql = 'DELETE FROM dados_pessoais WHERE id = ?';
    
    db.run(sql, [id], function(err) {
        if (err) {
            console.error('Erro ao apagar cadastro:', err);
            return res.status(500).json({ error: 'Erro ao apagar cadastro' });
        }
        
        res.json({ success: true, message: 'Cadastro apagado com sucesso' });
    });
});

// Rota para apagar todos os cadastros incompletos
app.delete('/api/cadastros-incompletos', (req, res) => {
    console.log('Recebida requisição para apagar cadastros incompletos');
    
    const sql = `
        DELETE FROM dados_pessoais 
        WHERE id NOT IN (
            SELECT dp.id FROM dados_pessoais dp
            INNER JOIN anamnese a ON dp.id = a.id_pessoa
            INNER JOIN analise_postural ap ON dp.id = ap.id_pessoa
        )
    `;
    
    db.run(sql, function(err) {
        if (err) {
            console.error('Erro ao apagar cadastros incompletos:', err);
            return res.status(500).json({ error: 'Erro ao apagar cadastros incompletos' });
        }
        
        console.log(`Sucesso: ${this.changes} cadastros incompletos apagados`);
        res.json({ success: true, message: `${this.changes} cadastros incompletos apagados` });
    });
});

// Rota para servir imagens
app.get('/uploads/:filename', (req, res) => {
    const filename = req.params.filename;
    const filepath = path.join(__dirname, 'uploads', filename);

    if (fs.existsSync(filepath)) {
        res.sendFile(filepath);
    } else {
        res.status(404).json({ error: 'Imagem não encontrada' });
    }
});

// Rota para obter todos os dados coletados
app.get('/api/all-data', (req, res) => {
    let allData = {
        pessoal: [],
        anamnese: [],
        postural: []
    };

    // Coletar dados pessoais
    db.all('SELECT * FROM dados_pessoais', (err, rows) => {
        if (err) {
            console.error('Erro ao consultar dados_pessoais:', err);
        } else {
            allData.pessoal = rows || [];
        }

        // Coletar anamnese
        db.all('SELECT * FROM anamnese', (err, rows) => {
            if (err) {
                console.error('Erro ao consultar anamnese:', err);
            } else {
                allData.anamnese = rows || [];
            }

            // Coletar análise postural
            db.all('SELECT * FROM analise_postural', (err, rows) => {
                if (err) {
                    console.error('Erro ao consultar analise_postural:', err);
                } else {
                    allData.postural = rows || [];
                }

                res.json(allData);
            });
        });
    });
});

// Rota para gerar treino com IA baseado nos dados coletados
app.post('/api/gerar-treino', async (req, res) => {
    try {
        const { id_pessoa } = req.body;

        // Se houver ID específico, buscar dados daquela pessoa
        // Se não, usar os dados mais recentes
        db.get('SELECT * FROM dados_pessoais ORDER BY id DESC LIMIT 1', async (err, pessoal) => {
            if (err || !pessoal) {
                return res.status(400).json({ 
                    sucesso: false, 
                    erro: 'Nenhum dado pessoal encontrado' 
                });
            }

            db.get('SELECT * FROM anamnese ORDER BY id DESC LIMIT 1', async (err, anamnese) => {
                const anamneseData = anamnese || {
                    habitos_alimentares: 'Não informado',
                    consumo_alcool: 'Não informado',
                    dores_atuais: 'Nenhuma',
                    horas_sono: 'Não informado',
                    pressao_arterial: 'Não informado',
                    observacoes_saude: '',
                    condicoes_saude: '',
                    objetivos: 'Geral'
                };

                db.get('SELECT * FROM analise_postural ORDER BY id DESC LIMIT 1', async (err, postural) => {
                    const posturalData = postural || {
                        desvios_cabeca: 'Normal',
                        desvios_ombros: 'Normal',
                        desvios_coluna: 'Normal',
                        desvios_pelve: 'Normal',
                        desvios_mmii: 'Normal',
                        observacoes_postura: 'Nenhuma'
                    };

                    // Formatar dados para IA
                    const dadosAvaliacao = {
                        pessoal: pessoal,
                        anamnese: anamneseData,
                        postural: posturalData
                    };

                    // Obter chave de API do cliente (enviada no body)
                    const { apiKey } = req.body;
                    
                    // Chamar função de IA com a chave fornecida
                    const resultado = await gerarTreino(dadosAvaliacao, apiKey);

                    if (resultado.sucesso) {
                        // Marcar treino como gerado no banco de dados
                        console.log('Tentando marcar treino como gerado para pessoa ID:', pessoal.id);
                        db.run('UPDATE dados_pessoais SET treino_gerado = 1 WHERE id = ?', [pessoal.id], function(err) {
                            if (err) {
                                console.error('Erro ao marcar treino como gerado:', err);
                            } else {
                                console.log('Treino marcado como gerado para pessoa ID:', pessoal.id, 'Linhas afetadas:', this.changes);
                            }
                        });

                        res.json({
                            sucesso: true,
                            planoTreino: resultado.planoTreino,
                            dataCriacao: resultado.dataCriacao,
                            dadosPessoa: pessoal.nome
                        });
                    } else {
                        res.status(500).json({
                            sucesso: false,
                            erro: resultado.erro
                        });
                    }
                });
            });
        });
    } catch (error) {
        console.error('Erro ao processar geração de treino:', error);
        res.status(500).json({
            sucesso: false,
            erro: error.message
        });
    }
});

// Rota para verificar estrutura do banco e valor de treino_gerado
app.get('/api/check-treino-gerado', (req, res) => {
    db.all('SELECT id, nome, treino_gerado FROM dados_pessoais', [], (err, rows) => {
        if (err) {
            console.error('Erro ao verificar treino_gerado:', err);
            return res.status(500).json({ error: 'Erro ao verificar dados' });
        }
        res.json(rows);
    });
});

// Tratamento de erros do multer
app.use((error, req, res, next) => {
    if (error instanceof multer.MulterError) {
        if (error.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({ error: 'Arquivo muito grande. Máximo 5MB.' });
        }
    }

    if (error.message === 'Apenas arquivos de imagem são permitidos!') {
        return res.status(400).json({ error: error.message });
    }

    res.status(500).json({ error: 'Erro interno do servidor' });
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`\ud83d\ude80 Servidor rodando em http://localhost:${PORT}`);
    console.log(`\ud83d\udcc1 Arquivos estáticos servidos da pasta: ${__dirname}`);
});

process.on('SIGINT', () => {
    db.close((err) => {
        if (err) {
            console.error('Erro ao fechar banco:', err.message);
        } else {
            console.log('Conexão com banco fechada.');
        }
        process.exit(0);
    });
});
