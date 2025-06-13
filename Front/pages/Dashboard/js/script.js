// Declara a variável do gráfico FORA do listener, para que possamos acessá-la globalmente no script
let meuGraficoSaidas = null;

console.log('>>> script.js (Dashboard): Script carregado. <<<');

document.addEventListener('DOMContentLoaded', () => {
    console.log('>>> script.js (Dashboard): DOMContentLoaded disparado. <<<');

    // --- DADOS FALSOS PARA O GRÁFICO (Cores ajustadas para mais distinção) ---
    const dadosSaidas = {
        labels: ['Resistor 10k', 'LED Vermelho', 'Cabo USB', 'Protoboard', 'ESP32'],
        quantidades: [50, 45, 30, 20, 15] // Quantidades de saída
    };

    const ctx = document.getElementById('saidasChart').getContext('2d');
    
    if (ctx) {
        console.log('>>> script.js (Dashboard): Canvas context encontrado. <<<');
        
        // --- Destroi o gráfico existente se ele já foi criado ---
        if (meuGraficoSaidas) {
            console.log('>>> script.js (Dashboard): Destruindo instância de gráfico existente. <<<');
            meuGraficoSaidas.destroy();
        } else {
            console.log('>>> script.js (Dashboard): Nenhuma instância de gráfico existente. Criando nova. <<<');
        }

        meuGraficoSaidas = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: dadosSaidas.labels,
                datasets: [{
                    label: 'Quantidade Saída',
                    data: dadosSaidas.quantidades,
                    backgroundColor: [
                        '#00CED1', // Azul Turquesa (mais distinto)
                        '#7FFF00', // Verde Chartreuse (mais vibrante)
                        '#FFD700', // Dourado (forte contraste)
                        '#FF4500', // Laranja Vermelho (para prejuízo/alerta)
                        '#8A2BE2'  // Azul Violeta (bem diferente)
                    ],
                    borderColor: 'rgba(30, 30, 30, 1)', // Borda escura para as fatias
                    borderWidth: 2
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: true,
                        position: 'right',
                        labels: {
                            color: 'var(--brancov1)'
                        }
                    },
                    title: {
                        display: true,
                        text: 'Distribuição de Saídas de Componentes',
                        color: 'var(--azuleletricov2)',
                        font: {
                            size: 18
                        }
                    }
                }
            }
        });
        console.log('>>> script.js (Dashboard): Nova instância do Chart criada. <<<');
    } else {
        console.error(">>> script.js (Dashboard): Canvas para o gráfico não encontrado. <<<");
    }

    // --- DADOS FALSOS DOS COMPONENTES (Mock JSON - Removido imageUrl) ---
    const mockComponentes = [
        {
            id: 'COMP-001',
            nome: 'Resistor 10k Ohm',
            codigo: 'RES-10K',
            quantidade: 150,
            localizacao: 'Prateleira A1',
            categoria: 'Passivo',
            observacoes: 'Usado em circuitos de polarização'
            // imageUrl removido
        },
        {
            id: 'COMP-002',
            nome: 'LED Vermelho 5mm',
            codigo: 'LED-RED',
            quantidade: 200,
            localizacao: 'Gaveta B3',
            categoria: 'Ativo',
            observacoes: 'Luminosidade padrão'
            // imageUrl removido
        },
        {
            id: 'COMP-003',
            nome: 'Protoboard 400p',
            codigo: 'PROTO-400',
            quantidade: 30,
            localizacao: 'Armário P2',
            categoria: 'Ferramenta',
            observacoes: 'Para prototipagem rápida'
            // imageUrl removido
        },
        {
            id: 'COMP-004',
            nome: 'Placa ESP32',
            codigo: 'ESP32-DEV',
            quantidade: 15,
            localizacao: 'Prateleira C2',
            categoria: 'Microcontrolador',
            observacoes: 'Com Wi-Fi e Bluetooth'
            // imageUrl removido
        },
        {
            id: 'COMP-005',
            nome: 'Multímetro Digital',
            codigo: 'MULTI-DIG',
            quantidade: 5,
            localizacao: 'Bancada 1',
            categoria: 'Equipamento',
            observacoes: 'Para medições de tensão e corrente'
            // imageUrl removido
        }
    ];

    function loadMockComponents() {
        const stockTable = document.getElementById('componentesTable');
        const tableBody = stockTable.querySelector('tbody');
        const errorMessage = document.getElementById('errorMessage');

        tableBody.innerHTML = '';

        if (mockComponentes.length === 0) {
            errorMessage.textContent = "Nenhum componente cadastrado (mock).";
            errorMessage.style.display = 'block';
        } else {
            mockComponentes.forEach(item => {
                const row = tableBody.insertRow();
                // Linhas de código para a imagem REMOVIDAS
                // const imgCell = row.insertCell();
                // const img = document.createElement('img');
                // img.src = item.imageUrl || 'https://via.placeholder.com/50x50?text=No+Img';
                // img.alt = item.nome;
                // img.style.width = '50px';
                // img.style.height = '50px';
                // img.style.objectFit = 'cover';
                // img.style.borderRadius = '5px';
                // imgCell.appendChild(img);

                row.insertCell().textContent = item.id;
                row.insertCell().textContent = item.nome;
                row.insertCell().textContent = item.codigo;
                row.insertCell().textContent = item.quantidade;
                row.insertCell().textContent = item.localizacao;
                row.insertCell().textContent = item.categoria;
            });
            stockTable.style.display = 'table';
        }
    }

    loadMockComponents();
});