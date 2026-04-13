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
                const podeTentarProximo = mensagem.includes('Too Many Requests') || mensagem.includes('quota') || mensagem.includes('not found') || mensagem.includes('not found for API version v1');
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
Você é um profissional experiente em Educação Física e Treinamento Personalizado. 
Com base na seguinte avaliação completa, crie um plano de treino detalhado e personalizado.

=== DADOS PESSOAIS ===
Nome: ${pessoal.nome}
Idade: ${pessoal.idade} anos
Gênero: ${pessoal.genero}
Altura: ${pessoal.altura} cm
Peso: ${pessoal.peso} kg
Nível de Condicionamento: ${pessoal.nivel_condicionamento}
${pessoal.imc ? `IMC: ${pessoal.imc.toFixed(1)}` : ''}

=== ANAMNESE ===
Hábitos Alimentares: ${anamnese.habitos_alimentares || 'Não informado'}
Consumo de Álcool: ${anamnese.consumo_alcool || 'Não informado'}
Dores Atuais: ${anamnese.dores_atuais || 'Nenhuma'}
Horas de Sono: ${anamnese.horas_sono || 'Não informado'}
Pressão Arterial: ${anamnese.pressao_arterial || 'Não informado'}
Histórico Médico: ${anamnese.saude || 'Sem condições relatadas'}
Condições Médicas: ${anamnese.condicoes || 'Nenhuma'}
Objetivos: ${anamnese.objetivos_treino || 'Geral'}

=== ANÁLISE POSTURAL ===
Desvios na Cabeça: ${postural.desvios_cabeca || 'Normal'}
Desvios nos Ombros: ${postural.desvios_ombros || 'Normal'}
Desvios na Coluna: ${postural.desvios_coluna || 'Normal'}
Desvios na Pelve: ${postural.desvios_pelve || 'Normal'}
Desvios nos MMII: ${postural.desvios_mmii || 'Normal'}
Observações: ${postural.observacoes_postura || 'Nenhuma'}

=== INSTRUÇÕES PARA GERAR O TREINO ===

Com base nesses dados, por favor, gere um plano de treino SEGUINDO EXATAMENTE esta estrutura:

1. **ANÁLISE INICIAL:**
   - Avalie o perfil geral (físico, médico, postural)
   - Identifique as principais limitações e pontos fortes
   - Considere fatores de risco

2. **ESTRUTURA OBRIGATÓRIA DO TREINO (SEGUIR ORDEM EXATA):**

   **📋 ETAPA 1 - ALONGAMENTOS E AQUECIMENTO:**
   - Alongamentos específicos para os desvios posturais identificados
   - Exercícios de mobilidade articular
   - Aquecimento cardiovascular leve (5-10 minutos)
   - Para cada exercício: séries, repetições, tempo de manutenção

   **📋 ETAPA 2 - MOBILIDADE ARTICULAR:**
   - Exercícios de mobilidade para coluna, ombros e quadris
   - Trabalho específico para as limitações encontradas
   - Mobilidade funcional para atividades diárias
   - Para cada exercício: séries, repetições, amplitude de movimento

   **📋 ETAPA 3 - TREINO PRINCIPAL:**
   - Exercícios de força focados nos objetivos
   - Adaptações para os desvios posturais
   - Treino respeitando as limitações médicas
   - Para cada exercício: séries, repetições, carga, descanso

   **📋 ETAPA 4 - CARDIO FINAL:**
   - Exercícios cardiovasculares ao final do treino
   - Intensidade adequada ao nível de condicionamento
   - Duração e frequência cardíaca alvo
   - Opções de impacto baixo se houver dores articulares

3. **PROGRESSÃO:**
   - Como progredir cada etapa ao longo das semanas
   - Quando aumentar intensidade em cada fase
   - Quando mudar os exercícios

4. **RECOMENDAÇÕES GERAIS:**
   - Alimentação
   - Hidratação
   - Descanso e recuperação
   - Suplementação (se necessário)
   - Prevenção de lesões

5. **ACOMPANHAMENTO:**
   - Como medir progresso
   - Quando fazer reavaliação

**IMPORTANTE:** Siga RIGOROSAMENTE a ordem: Alongamentos → Mobilidade → Treino Principal → Cardio. Cada etapa deve ser claramente separada e detalhada.

Forneça um plano detalhado, científico e personalizado seguindo esta estrutura exata.
`;

    return prompt;
}

module.exports = { gerarTreino };
