document.addEventListener('DOMContentLoaded', () => {

  // Lógica do Sidebar Retrátil
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }
  const toggleButton = document.getElementById('sidebar-toggle');
  const sidebar = document.querySelector('.sidebar');
  const mainContent = document.querySelector('.main-content');
  if (toggleButton) {
    toggleButton.addEventListener('click', () => {
      sidebar.classList.toggle('retracted');
      mainContent.classList.toggle('expanded');
    });
  }

  // Lógica de Submissão do Formulário
  const componentForm = document.getElementById('componentForm');
  componentForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const dadosComponente = {
      nome: document.getElementById('entradaComponente').value,
      codigoPatrimonio: document.getElementById('entradaCodigo').value,
      quantidade: parseInt(document.getElementById('entradaQuantidade').value),
      localizacao: document.getElementById('entradaLocalizacao').value,
      categoria: document.getElementById('entradaCategoria').value,
      observacoes: document.getElementById('entradaObservacao').value
    };

    try {
      const response = await fetch('http://localhost:8080/api/componentes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(dadosComponente)
      });

      const data = await response.json();

      if (response.ok) {
        console.log('Sucesso:', data.message);
        alert("✅ Componente Cadastrado com Sucesso!");
        componentForm.reset();
      } else {
        console.error('Erro:', data.error);
        alert('❌ Erro ao cadastrar componente: ' + (data.message || 'Erro desconhecido.'));
      }
    } catch (error) {
      console.error('Erro na requisição:', error);
      alert('❌ Erro de conexão com o servidor. Verifique se o back-end está rodando.');
    }
  });

  // Lógica para os botões "Nova"
  document.getElementById('novaLocalizacaoBtn').addEventListener('click', () => {
    alert("Funcionalidade de 'Nova Localização' não implementada.");
  });

  document.getElementById('novaCategoriaBtn').addEventListener('click', () => {
    alert("Funcionalidade de 'Nova Categoria' não implementada.");
  });
});