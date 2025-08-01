/**
 * PARTE 1: MANIPULAÇÃO DA INTERFACE (UI)
 * Esta função é responsável APENAS por adicionar a linha na tabela.
 * Ela não se comunica com o backend.
 */
function adicionarMovimentacaoAoHistorico(id, dataHora, tipo, componente, quantidade, usuario) {
    const tabelaBody = document.querySelector('#historicoTable tbody');
    if (!tabelaBody) {
        console.error('ERRO: O corpo da tabela de histórico (#historicoTable tbody) não foi encontrado.');
        return;
    }
    const novaLinha = document.createElement('tr');
    novaLinha.innerHTML = `
        <td>${id}</td>
        <td>${dataHora}</td>
        <td>${tipo}</td>
        <td>${componente}</td>
        <td>${quantidade}</td>
        <td>${usuario}</td>
    `;
    tabelaBody.prepend(novaLinha);
}


/**
 * PARTE 2: COMUNICAÇÃO COM O BACKEND
 * Esta função envia os dados para a API e retorna a resposta do servidor.
 * Usamos async/await para trabalhar com a promessa do fetch de forma mais limpa.
 *
 * @param {object} dadosMovimentacao Objeto com os dados a serem enviados.
 */
async function enviarMovimentacaoParaBackend(dadosMovimentacao) {
    // IMPORTANTE: Substitua pela URL real do seu endpoint no Spring Boot
    const endpoint = '/api/historico/movimentacoes'; 

    try {
        const response = await fetch(endpoint, {
            method: 'POST', // Método HTTP para criar um novo recurso
            headers: {
                'Content-Type': 'application/json', // Informa ao backend que estamos enviando JSON
            },
            body: JSON.stringify(dadosMovimentacao), // Converte o objeto JS em uma string JSON
        });

        // Verifica se a resposta do servidor foi bem-sucedida (status 2xx)
        if (!response.ok) {
            // Se não foi, lança um erro com o status para ser pego pelo catch
            throw new Error(`Erro na requisição: ${response.status} ${response.statusText}`);
        }

        // Se a resposta foi OK, converte a resposta do backend (que também deve ser JSON) para um objeto JS
        const movimentacaoSalva = await response.json();
        return movimentacaoSalva;

    } catch (error) {
        // Captura erros de rede ou os erros que lançamos acima
        console.error('Falha ao enviar movimentação para o backend:', error);
        // Retorna null ou lança o erro novamente, dependendo de como você quer tratar a falha
        throw error; 
    }
}


/**
 * PARTE 3: ORQUESTRADOR E EXEMPLO DE USO
 * Esta é a função que você chamará a partir do seu formulário de cadastro.
 * Ela junta a lógica de backend e a de UI.
 */
async function cadastrarNovaMovimentacao(dados) {
    try {
        console.log('Enviando dados para o backend...', dados);

        // 1. Envia os dados para o backend e aguarda a resposta
        const movimentacaoConfirmada = await enviarMovimentacaoParaBackend(dados);
        
        console.log('Backend confirmou e retornou:', movimentacaoConfirmada);

        // 2. Se o backend confirmou, usa os dados retornados para atualizar a tabela na tela
        adicionarMovimentacaoAoHistorico(
            movimentacaoConfirmada.id,       // Use os dados retornados, pois o backend
            new Date(movimentacaoConfirmada.dataHora).toLocaleString('pt-BR'), // pode ter gerado o ID e a data/hora
            movimentacaoConfirmada.tipo,
            movimentacaoConfirmada.componente.nome, // Exemplo se o componente for um objeto aninhado
            movimentacaoConfirmada.quantidade,
            movimentacaoConfirmada.usuario.nome // Exemplo se o usuário for um objeto aninhado
        );
        
        alert('Movimentação registrada com sucesso!');

    } catch (error) {
        // Se ocorrer qualquer erro no processo, exibe um alerta para o usuário
        console.error('Ocorreu um erro no processo de cadastro:', error);
        alert('Não foi possível registrar a movimentação. Verifique o console para mais detalhes.');
    }
}

// --- EXEMPLO DE COMO VOCÊ CHAMARIA A FUNÇÃO ---
// Geralmente, isso viria de um evento de clique em um botão "Salvar" de um formulário.
document.addEventListener('DOMContentLoaded', () => {
    // Dados simulados que viriam de um formulário
    const dadosDoFormulario = {
        tipo: '🔧 Saída',
        quantidade: 5,
        componenteId: 'COMP-001', // Enviamos o ID para o backend
        usuarioId: 'USER-002'      // Enviamos o ID para o backend
    };
    
    // Você chamaria a função orquestradora assim:
    // cadastrarNovaMovimentacao(dadosDoFormulario); 
    // A linha acima está comentada para não executar automaticamente.
    // Descomente para testar.
});