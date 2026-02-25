// Função global chamada pelo app.js quando a tela de relatórios é injetada
window.carregarGraficos = async function() {
    try {
        // 1. Busca todos os dados do seu Spring Boot em paralelo (muito mais rápido)
        const [resQuartos, resClientes, resFuncionarios, resEstadias] = await Promise.all([
            fetch('http://localhost:8080/api/quartos'),
            fetch('http://localhost:8080/api/clientes'),
            fetch('http://localhost:8080/api/funcionarios'),
            fetch('http://localhost:8080/api/estadias')
        ]);

        const quartos = await resQuartos.json();
        const clientes = await resClientes.json();
        const funcionarios = await resFuncionarios.json();
        const estadias = await resEstadias.json();

        desenharGraficoQuartos(quartos);
        desenharGraficoClientes(clientes);
        desenharGraficoFuncionarios(funcionarios);
        desenharGraficoFinanceiro(funcionarios, estadias, quartos);

    } catch (error) {
        console.error("Erro ao carregar dados para os gráficos:", error);
    }
};

// ==========================================
// 1. OCUPAÇÃO DE QUARTOS (Gráfico de Pizza)
// ==========================================
function desenharGraficoQuartos(quartos) {
    const ocupados = quartos.filter(q => q.ocupado).length;
    const livres = quartos.filter(q => !q.ocupado).length;

    new Chart(document.getElementById('graficoQuartos'), {
        type: 'pie',
        data: {
            labels: ['Ocupados', 'Livres'],
            datasets: [{
                data: [ocupados, livres],
                backgroundColor: ['#D9534F', '#2B4C7E'] // Vermelho e Azul
            }]
        }
    });
}

// ==========================================
// 2. TOP CLIENTES (Gráfico de Barras Horizontais)
// ==========================================
function desenharGraficoClientes(clientes) {
    // Ordena os clientes do maior para o menor ponto e pega os 5 primeiros
    const topClientes = clientes.sort((a, b) => (b.pontosFidelidade || 0) - (a.pontosFidelidade || 0)).slice(0, 5);
    
    const nomes = topClientes.map(c => c.nome);
    const pontos = topClientes.map(c => c.pontosFidelidade || 0);

    new Chart(document.getElementById('graficoClientes'), {
        type: 'bar',
        data: {
            labels: nomes,
            datasets: [{
                label: 'Pontos de Fidelidade',
                data: pontos,
                backgroundColor: '#D9CBB8' // Bege do tema
            }]
        },
        options: { indexAxis: 'y' } // Deixa a barra na horizontal
    });
}

// ==========================================
// 3. GASTOS POR CARGO (Gráfico de Barras)
// ==========================================
function desenharGraficoFuncionarios(funcionarios) {
    // Agrupa e soma os salários por cargo
    const gastosPorCargo = {};
    funcionarios.forEach(f => {
        if (!gastosPorCargo[f.cargo]) gastosPorCargo[f.cargo] = 0;
        gastosPorCargo[f.cargo] += f.salario;
    });

    new Chart(document.getElementById('graficoFuncionarios'), {
        type: 'bar',
        data: {
            labels: Object.keys(gastosPorCargo), // Nomes dos cargos
            datasets: [{
                label: 'Custo Total (R$)',
                data: Object.values(gastosPorCargo), // Valores somados
                backgroundColor: '#567EBB' // Azul secundário
            }]
        }
    });
}

// ==========================================
// 4. FATURAMENTO VS DESPESAS (Gráfico Doughnut)
// ==========================================
function desenharGraficoFinanceiro(funcionarios, estadias, quartos) {
    // Calcula Despesas (Soma dos Salários Totais)
    const despesas = funcionarios.reduce((acc, f) => acc + f.salario, 0);

    // Calcula Faturamento Estimado (Multiplica diárias das estadias concluídas pelo valor do quarto)
    let faturamento = 0;
    estadias.filter(e => !e.ativa).forEach(estadia => { // Pega só estadias finalizadas (baixa dada)
        const quarto = quartos.find(q => q.numero === estadia.numeroQuarto);
        if (quarto) {
            faturamento += (estadia.quantidadeDiarias * quarto.valorDiaria);
        }
    });

    new Chart(document.getElementById('graficoFinanceiro'), {
        type: 'doughnut',
        data: {
            labels: ['Faturamento (Entrada)', 'Salários (Saída)'],
            datasets: [{
                data: [faturamento, despesas],
                backgroundColor: ['#28a745', '#D9534F'] // Verde e Vermelho
            }]
        }
    });
}