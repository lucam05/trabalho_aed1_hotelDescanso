// 1. Lógica para mostrar/esconder os formulários ao trocar o Select
document.addEventListener('change', function(event) {
    if (event.target && event.target.id === 'seletor-cadastro') {
        // Esconde todos
        const containers = document.querySelectorAll('.form-container');
        containers.forEach(container => container.style.display = 'none');
        
        // Mostra apenas o selecionado
        const selecionado = document.getElementById(event.target.value);
        if(selecionado) selecionado.style.display = 'block';
    }
});

// 2. Lógica para interceptar os envios dos formulários (Submits)
document.addEventListener('submit', async function(event) {
    
    // Verifica se o evento de submit veio de algum dos nossos 3 formulários
    if (!event.target || !['formCliente', 'formFuncionario', 'formQuarto'].includes(event.target.id)) {
        return; // Se não for nosso formulário, ignora.
    }

    event.preventDefault(); // Impede o reload da página

    try {
        // ==========================================
        // CADASTRO DE CLIENTE
        // ==========================================
        if (event.target.id === 'formCliente') {
            const cliente = {
                nome: document.getElementById('nome').value,
                endereco: document.getElementById('endereco').value,
                telefone: document.getElementById('telefone').value
            };
            const msgDiv = document.getElementById('mensagem-cliente');

            const response = await fetch('http://localhost:8080/api/clientes', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(cliente)
            });

            if (response.ok) {
                const salvo = await response.json();
                msgDiv.style.color = "green";
                msgDiv.innerText = `Cliente salvo com sucesso! Código gerado: ${salvo.codigo}`;
                event.target.reset();
            } else {
                msgDiv.style.color = "red";
                msgDiv.innerText = "Erro ao cadastrar o cliente.";
            }
            setTimeout(() => msgDiv.innerText = "", 6000);
        }

        // ==========================================
        // CADASTRO DE FUNCIONÁRIO
        // ==========================================
        else if (event.target.id === 'formFuncionario') {
            const funcionario = {
                nome: document.getElementById('nome-func').value,
                telefone: document.getElementById('telefone-func').value,
                salario: parseFloat(document.getElementById('salario-func').value),
                cargo: document.getElementById('cargo-func').value
            };
            const msgDiv = document.getElementById('mensagem-func');

            const response = await fetch('http://localhost:8080/api/funcionarios', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(funcionario)
            });

            if (response.ok) {
                const salvo = await response.json();
                msgDiv.style.color = "green";
                msgDiv.innerText = `Funcionário salvo com sucesso! Código gerado: ${salvo.codigo}`;
                event.target.reset();
            } else {
                msgDiv.style.color = "red";
                msgDiv.innerText = "Erro ao cadastrar o funcionário.";
            }
            setTimeout(() => msgDiv.innerText = "", 6000);
        }

        // ==========================================
        // CADASTRO DE QUARTO
        // ==========================================
        else if (event.target.id === 'formQuarto') {
            const quarto = {
                quantidadeHospedes: parseInt(document.getElementById('capacidade-quarto').value),
                valorDiaria: parseFloat(document.getElementById('valor-quarto').value)
            };
            const msgDiv = document.getElementById('mensagem-quarto');

            const response = await fetch('http://localhost:8080/api/quartos', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(quarto)
            });

            if (response.ok) {
                const salvo = await response.json();
                msgDiv.style.color = "green";
                msgDiv.innerText = `Quarto salvo com sucesso! Número gerado: ${salvo.numero}`;
                event.target.reset();
            } else {
                msgDiv.style.color = "red";
                msgDiv.innerText = "Erro ao cadastrar o quarto. O número pode já existir.";
            }
            setTimeout(() => msgDiv.innerText = "", 6000);
        }

    } catch (error) {
        console.error("Erro na requisição:", error);
        alert("Erro de conexão com o servidor. Verifique se o backend está rodando.");
    }
});