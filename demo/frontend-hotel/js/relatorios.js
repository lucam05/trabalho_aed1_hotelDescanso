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


function desenharGraficoQuartos(quartos) {
    const ocupados = quartos.filter(q => q.ocupado).length;
    const livres = quartos.filter(q => !q.ocupado).length;

    new Chart(document.getElementById('graficoQuartos'), {
        type: 'pie',
        data: {
            labels: ['Ocupados', 'Livres'],
            datasets: [{
                data: [ocupados, livres],
                backgroundColor: ['#D9534F', '#2B4C7E'] 
            }]
        }
    });
}


function desenharGraficoClientes(clientes) {
    
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
                backgroundColor: '#D9CBB8' 
            }]
        },
        options: { indexAxis: 'y' } 
    });
}


function desenharGraficoFuncionarios(funcionarios) {
    
    const gastosPorCargo = {};
    funcionarios.forEach(f => {
        if (!gastosPorCargo[f.cargo]) gastosPorCargo[f.cargo] = 0;
        gastosPorCargo[f.cargo] += f.salario;
    });

    new Chart(document.getElementById('graficoFuncionarios'), {
        type: 'bar',
        data: {
            labels: Object.keys(gastosPorCargo), 
            datasets: [{
                label: 'Custo Total (R$)',
                data: Object.values(gastosPorCargo), 
                backgroundColor: '#567EBB' 
            }]
        }
    });
}


function desenharGraficoFinanceiro(funcionarios, estadias, quartos) {
   
    const despesas = funcionarios.reduce((acc, f) => acc + f.salario, 0);

    
    estadias.filter(e => !e.ativa).forEach(estadia => { 
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
                backgroundColor: ['#28a745', '#D9534F'] 
            }]
        }
    });
}