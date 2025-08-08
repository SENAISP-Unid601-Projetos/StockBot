document.addEventListener('DOMContentLoaded', () => {
    console.log('>>> script.js (Cadastro): DOMContentLoaded disparado. <<<'); // Log no início

    // Referências aos elementos do formulário
    const form = document.getElementById('componentForm');
    const successMessage = document.getElementById('successMessage');
    const okSuccessBtn = document.getElementById('okSuccessBtn'); 

    const inputNome = document.getElementById('entradaComponente');
    const inputCodigo = document.getElementById('entradaCodigo');
    const inputQuantidade = document.getElementById('entradaQuantidade');
    const selectLocalizacao = document.getElementById('entradaLocalizacao');
    const selectCategoria = document.getElementById('entradaCategoria');
    const textareaObservacao = document.getElementById('entradaObservacao');

    // Referências às mensagens de erro
    const errorNome = document.getElementById('error-entradaComponente');
    const errorCodigo = document.getElementById('error-entradaCodigo');
    const errorQuantidade = document.getElementById('error-entradaQuantidade');
    const errorLocalizacao = document.getElementById('error-entradaLocalizacao');
    const errorCategoria = document.getElementById('error-entradaCategoria'); // Confirme se o ID é 'error-entradaCategoria' no HTML

    // Mapeamento dos inputs com suas respectivas mensagens de erro
    const fields = [
        { input: inputNome, errorSpan: errorNome, validate: (value) => value.trim() !== '', message: 'O nome do componente é obrigatório.' },
        { input: inputCodigo, errorSpan: errorCodigo, validate: (value) => value.trim() !== '', message: 'O código de patrimônio é obrigatório.' },
        { input: inputQuantidade, errorSpan: errorQuantidade, validate: (value) => !isNaN(parseInt(value)) && parseInt(value) > 0, message: 'A quantidade deve ser um número positivo.' },
        { input: selectLocalizacao, errorSpan: errorLocalizacao, validate: (value) => value !== '', message: 'Selecione uma localização.' },
        { input: selectCategoria, errorSpan: errorCategoria, validate: (value) => value !== '', message: 'Selecione uma categoria.' },
    ];

    // Adiciona listeners para cada campo para esconder a mensagem de erro
    fields.forEach(field => {
        field.input.addEventListener('input', () => {
            if (field.validate(field.input.value)) {
                hideValidationMessage(field.errorSpan);
            }
        });
        if (field.input.tagName === 'SELECT') {
            field.input.addEventListener('change', () => {
                if (field.validate(field.input.value)) {
                    hideValidationMessage(field.errorSpan);
                }
            });
        }
    });

    // Listener para o botão Salvar
    form.addEventListener('submit', (event) => {
        console.log('>>> script.js (Cadastro): Botão Salvar clicado, evento de submit disparado. <<<'); // Log no início do submit
        event.preventDefault(); // Impede o comportamento padrão de recarregar a página

        hideSuccessMessage(); // Esconde mensagem de sucesso se já estiver visível

        let isValid = true; 

        // Roda a validação para todos os campos
        fields.forEach(field => {
            if (!field.validate(field.input.value)) {
                showValidationMessage(field.errorSpan, field.message);
                isValid = false;
            } else {
                hideValidationMessage(field.errorSpan);
            }
        });

        console.log('>>> script.js (Cadastro): Estado de validação isValid =', isValid, '<<<'); // Log do resultado da validação

        if (isValid) {
            console.log('>>> script.js (Cadastro): Formulário válido. Simulando cadastro. <<<'); // Log de sucesso
            console.log('Dados do formulário (simulados):', {
                nome: inputNome.value,
                codigo: inputCodigo.value,
                quantidade: parseInt(inputQuantidade.value),
                localizacao: selectLocalizacao.value,
                categoria: selectCategoria.value,
                observacoes: textareaObservacao.value
            });
            showSuccessMessage(); 
            form.reset(); 
            clearValidationMessages(); 
        } else {
            console.log('>>> script.js (Cadastro): Formulário inválido. Exibindo mensagens de erro. <<<'); // Log de falha
        }
    });

    // Função para exibir uma mensagem de validação específica
    function showValidationMessage(element, message) {
        element.textContent = message;
        element.style.display = 'block'; 
        setTimeout(() => { 
            element.classList.add('show');
        }, 10);
        console.log('Mostrando validação para:', element.id, 'Mensagem:', message); // Log de validação
    }

    // Função para esconder UMA mensagem de validação específica
    function hideValidationMessage(element) {
        element.classList.remove('show');
        setTimeout(() => { 
            element.textContent = ''; 
            element.style.display = 'none'; 
        }, 400); 
        console.log('Escondendo validação para:', element.id); // Log de validação
    }

    // Função para limpar TODAS as mensagens de validação
    function clearValidationMessages() {
        document.querySelectorAll('.validation-message').forEach(span => {
            hideValidationMessage(span);
        });
        console.log('Todas as mensagens de validação limpas.'); // Log de limpeza
    }


    // Função para mostrar a mensagem de sucesso
    function showSuccessMessage() {
        successMessage.style.display = 'flex'; 
        setTimeout(() => {
            successMessage.classList.add('show');
        }, 10);
        console.log('Mensagem de sucesso exibida.'); // Log de sucesso
    }

    // Função para esconder a mensagem de sucesso
    function hideSuccessMessage() {
        successMessage.classList.remove('show');
        setTimeout(() => {
            successMessage.style.display = 'none';
        }, 800); 
        console.log('Mensagem de sucesso escondida.'); // Log de esconder sucesso
    }

    // Listener para o botão OK da mensagem de sucesso
    if (okSuccessBtn) { // Adicionei esta verificação
        okSuccessBtn.addEventListener('click', () => {
            console.log('>>> script.js (Cadastro): Botão OK da mensagem de sucesso clicado. <<<'); // Log do clique OK
            hideSuccessMessage();
        });
    } else {
        console.error('>>> script.js (Cadastro): ERRO: Botão OK da mensagem de sucesso (id="okSuccessBtn") não encontrado no HTML! <<<'); // Erro se o botão não for achado
    }

    // Listener para o botão Cancelar
    document.getElementById('cancelarBtn').addEventListener('click', () => {
        form.reset();
        clearValidationMessages();
        hideSuccessMessage();
        console.log('Botão Cancelar clicado. Formulário resetado.'); // Log do cancelar
    });

    // Inicialização do Lucide Icons
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
        console.log('Ícones Lucide criados.'); // Log de ícones
    }
});