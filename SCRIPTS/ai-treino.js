require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');

async function gerarTreino(dadosAvaliacao, apiKey) {
    try {
        const chaveAPI = apiKey || process.env.GEMINI_API_KEY;
        if (!chaveAPI) {
            throw new Error('GEMINI_API_KEY não fornecida. Configure em .env ou no navegador.');
        }

        const modelos = [
            'gemini-2.5-pro',
            'gemini-2.5-flash',
            'gemini-2.0-flash',
            'gemini-2.0-flash-lite',
            'gemini-2.5-flash-lite'
        ];

        const prompt = construirPrompt(dadosAvaliacao);
        let ultimoErro = null;

        for (const modelo of modelos) {
            try {
                console.log(`Tentando gerar treino com o modelo: ${modelo}`);
                const genAI = new GoogleGenerativeAI(chaveAPI);
                const generativeModel = genAI.getGenerativeModel({ model: modelo });
                const result = await generativeModel.generateContent(prompt);
                const response = result.response;
                const texto = response.text();

                return {
                    sucesso: true,
                    planoTreino: texto,
                    dataCriacao: new Date(),
                    modeloUtilizado: modelo
                };
            } catch (error) {
                ultimoErro = error;
                const mensagem = error.message || '';
                const podeTentarProximo = mensagem.includes('Too Many Requests') || mensagem.includes('quota') || mensagem.includes('not found') || mensagem.includes('not found for API version v1') || mensagem.includes('Service Unavailable') || mensagem.includes('503');
                console.warn(`Falha no modelo ${modelo}: ${mensagem}`);
                if (!podeTentarProximo) {
                    throw error;
                }
            }
        }

        if (ultimoErro) {
            throw ultimoErro;
        }

        throw new Error('Não foi possível gerar o treino com nenhum modelo disponível.');
    } catch (error) {
        console.error('Erro ao gerar treino com IA:', error.message);
        return {
            sucesso: false,
            erro: error.message
        };
    }
}

function construirPrompt(dados) {
    const { pessoal, anamnese, postural } = dados;

    const prompt = `
Você é um profissional experiente em Educação Física. Gere um plano de treino CONCISO e DIRETO.

=== DADOS PESSOAIS ===
Nome: ${pessoal.nome}
Idade: ${pessoal.idade} anos
Gênero: ${pessoal.genero}
Altura: ${pessoal.altura}m
Peso: ${pessoal.peso}kg
Nível de Condicionamento: ${pessoal.nivel_condicionamento}

=== ANAMNESE ===
Hábitos Alimentares: ${anamnese.habitos_alimentares || 'Não informado'}
Consumo de Álcool: ${anamnese.consumo_alcool || 'Não informado'}
Dores/Limitações Atuais: ${anamnese.dores || 'Nenhuma'}
Pressão Arterial: ${anamnese.pressao_arterial || 'Não informado'}
Descanso/Repouso: ${anamnese.descanso_repouso || 'Não informado'}
Horas de Sono: ${anamnese.horas_sono || 'Não informado'}
Sono Regular: ${anamnese.sono_regular || 'Não informado'}
Dias de Treino por Semana: ${anamnese.dias_treino || '3'}
Observações de Saúde: ${anamnese.observacoes_saude || 'Nenhuma'}
Condições de Saúde: ${anamnese.condicoes_saude || 'Nenhuma'}
Outras Doenças: ${anamnese.outras_doencas || 'Nenhuma'}
Objetivos: ${anamnese.objetivos || 'Geral'}
Restrições/Lesões: ${anamnese.restricoes_lesoes || 'Nenhuma'}

=== ANÁLISE POSTURAL ===
Desvios da Cabeça: ${postural.desvios_cabeca || 'Normal'}
Desvios dos Ombros: ${postural.desvios_ombros || 'Normal'}
Desvios da Coluna: ${postural.desvios_coluna || 'Normal'}
Desvios da Pelve: ${postural.desvios_pelve || 'Normal'}
Desvios dos MMII: ${postural.desvios_mmii || 'Normal'}
Observações Posturais: ${postural.observacoes_postura || 'Nenhuma'}
Recomendações: ${postural.recomendacoes || 'Nenhuma'}

=== ESTRUTURA DO TREINO (SIGA ESTA ORDEM EXATA) ===

=== METODOLOGIA DE TREINO (OBRIGATÓRIO SEGUIR) ===

**IDENTIFICAÇÃO DO NÍVEL:**
- Iniciante: Nunca treinou ou menos de 6 meses de treino
- Intermediário: 6 meses a 2 anos de treino
- Avançado: Mais de 2 anos de treino
- Atleta: Atleta profissional ou amador com alto nível de condicionamento

**ESTRUTURA POR NÍVEL:**
- Iniciante (Full Body): Crie treino A e treino B (alternar entre os dias)
- Intermediário: Crie treino A, B e C (rotina de 3 dias)
- Avançado: Crie treino A, B e C (rotina de 3 dias)
- Atleta: Crie treino A, B, C e D (rotina de 4 dias com foco em performance)

**PARA CADA TREINO (A, B, C, D):**
- Inclua exercícios de: Alongamentos + Treino Principal + Cardio
- Adapte exercícios conforme desvios posturais e limitações
- Para iniciante Full Body: adicione exercício complementar conforme dominância:
  * Dominância Quadril: + Puxada (costas, bíceps)
  * Dominância Joelho: + Empurrar (peito, tríceps, ombros)
  * Dominância Quadríceps: + Costa
  * Dominância Glúteo: + Peito
  * 
- Para Atleta
  * Pliometria (saltos, drops, box jumps)
  * Explosão (sprints, kettlebell swings, power cleans)
  * Anti-rotação (pallof press, russian twists com carga, planks rotacionais)
  * Força máxima (agachamentos, deadlifts, bench press, overhead press)

**1. ALONGAMENTOS E MOBILIDADE:**
- 5-10 exercícios de alongamento e mobilidade
- Para cada: nome, séries, repetições/tempo
- Adapte para desvios posturais e limitações

**2. TREINO DO DIA:**
- Exercícios de força principais
- Para cada: nome, séries, repetições, carga, descanso
- Cuidado com as limitações do aluno

**3. CARDIO DO DIA:**
- Exercício cardiovascular
- Duração, intensidade, frequência cardíaca alvo
- Adapte para dores articulares se necessário

=== IMPORTANTE - PERSONALIZAÇÃO OBRIGATÓRIA ===
- Seja CONCISO mas ESPECÍFICO para este aluno
- Use o PESO (${pessoal.peso}kg) e ALTURA (${pessoal.altura}m) para calcular cargas apropriadas
- Adapte cargas baseadas no NÍVEL (${pessoal.nivel_condicionamento})
- FOQUE nos OBJETIVOS específicos: ${anamnese.objetivos || 'Geral'}
- Use os DIAS DE TREINO (${anamnese.dias_treino || '3'}) para estruturar a rotina
- Adapte exercícios para DESVIOS POSTURAIS específicos mencionados
- Considere CONDIÇÕES MÉDICAS: ${anamnese.condicoes_saude || 'Nenhuma'}
- Ajuste intensidade baseada na IDADE (${pessoal.idade} anos)
- Para dores específicas (${anamnese.dores || 'Nenhuma'}), ofereça alternativas
- NÃO use treinos genéricos - personalize para este aluno específico
- NÃO inclua análises extensas, progressão detalhada ou recomendações gerais
`;

    return prompt;
}

module.exports = { gerarTreino };
