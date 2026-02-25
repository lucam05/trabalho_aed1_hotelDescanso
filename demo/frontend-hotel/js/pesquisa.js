document.addEventListener("DOMContentLoaded", () => {
    const formPesquisaGeral = document.getElementById('formPesquisaGeral');
    const resultadoDiv = document.getElementById('resultado-pesquisa');

    if (formPesquisaGeral) {
        formPesquisaGeral.addEventListener('submit', async function(event) {
            event.preventDefault();

            const tipo = document.getElementById('tipo-pesquisa').value;
            const termo = document.getElementById('termo-pesquisa').value.toLowerCase().trim();
            
            resultadoDiv.innerHTML = "<p>Buscando...</p>";

            try {
                // Lógica para Clientes e Funcionários (Busca na lista e filtra por nome ou código)
                if (tipo === 'clientes' || tipo === 'funcionarios') {
                    const response = await fetch(`http://localhost:8080/api/${tipo}`);
                    const dados = await response.json();

                    // Filtra por código exato ou se o nome contém o que foi digitado
                    const filtrados = dados.filter(item => 
                        item.codigo.toString() === termo || 
                        item.nome.toLowerCase().includes(termo)
                    );

                    renderizarTabelaGenerica(filtrados, tipo);
                } 
                
                // Lógica para Estadias (Precisa achar o cliente primeiro para pegar o código dele)
                else if (tipo === 'estadias') {
                    // 1. Primeiro busca todos os clientes para ver se o termo é um nome de cliente
                    const resClientes = await fetch(`http://localhost:8080/api/clientes`);
                    const clientes = await resClientes.json();
                    
                    const clienteEncontrado = clientes.find(c => 
                        c.codigo.toString() === termo || c.nome.toLowerCase().includes(termo)
                    );

                    if (!clienteEncontrado) {
                        resultadoDiv.innerHTML = `<p style="color: red;">Nenhum cliente encontrado com esse nome ou código.</p>`;
                        return;
                    }

                    // 2. Com o código do cliente em mãos, busca as estadias dele
                    const resEstadias = await fetch(`http://localhost:8080/api/estadias/cliente/${clienteEncontrado.codigo}`);
                    if (resEstadias.status === 204) {
                        resultadoDiv.innerHTML = `<p>O cliente <b>${clienteEncontrado.nome}</b> não possui estadias ativas.</p>`;
                        return;
                    }
                    
                    const estadias = await resEstadias.json();
                    renderizarTabelaEstadias(estadias, clienteEncontrado.nome);
                }

            } catch (error) {
                console.error("Erro na busca:", error);
                resultadoDiv.innerHTML = `<p style="color: red;">Erro ao conectar com o servidor.</p>`;
            }
        });
    }

    // Função para desenhar a tabela de Clientes ou Funcionários
    function renderizarTabelaGenerica(dados, tipo) {
        if (dados.length === 0) {
            resultadoDiv.innerHTML = `<p>Nenhum resultado encontrado.</p>`;
            return;
        }

        let html = `<table style="width: 100%; border-collapse: collapse; text-align: left;">
                        <tr style="background-color: var(--light-grey); border-bottom: 2px solid #ccc;">
                            <th style="padding: 10px;">Código</th>
                            <th style="padding: 10px;">Nome</th>
                            <th style="padding: 10px;">Telefone</th>
                            ${tipo === 'clientes' ? '<th style="padding: 10px;">Pontos</th>' : '<th style="padding: 10px;">Cargo</th><th style="padding: 10px;">Salário</th>'}
                        </tr>`;
        
        dados.forEach(item => {
            html += `<tr style="border-bottom: 1px solid #eee;">
                        <td style="padding: 10px;">${item.codigo}</td>
                        <td style="padding: 10px;">${item.nome}</td>
                        <td style="padding: 10px;">${item.telefone}</td>
                        ${tipo === 'clientes' ? 
                            `<td style="padding: 10px;">${item.pontosFidelidade}</td>` : 
                            `<td style="padding: 10px;">${item.cargo}</td><td style="padding: 10px;">R$ ${item.salario.toFixed(2)}</td>`}
                     </tr>`;
        });
        html += `</table>`;
        resultadoDiv.innerHTML = html;
    }

    // Função para desenhar a tabela de Estadias com o botão de Dar Baixa
    function renderizarTabelaEstadias(estadias, nomeCliente) {
        let html = `<h4 style="margin-bottom: 15px;">Estadias ativas de: ${nomeCliente}</h4>
                    <table style="width: 100%; border-collapse: collapse; text-align: left;">
                        <tr style="background-color: var(--light-grey); border-bottom: 2px solid #ccc;">
                            <th style="padding: 10px;">Cód. Estadia</th>
                            <th style="padding: 10px;">Quarto</th>
                            <th style="padding: 10px;">Entrada</th>
                            <th style="padding: 10px;">Saída</th>
                            <th style="padding: 10px;">Ação</th>
                        </tr>`;
        
        estadias.forEach(est => {
            html += `<tr style="border-bottom: 1px solid #eee;">
                        <td style="padding: 10px;">${est.codigo}</td>
                        <td style="padding: 10px;">${est.numeroQuarto}</td>
                        <td style="padding: 10px;">${est.dataEntrada}</td>
                        <td style="padding: 10px;">${est.dataSaida}</td>
                        <td style="padding: 10px;">
                            <button onclick="darBaixaCentral(${est.codigo})" class="btn-primary" style="background-color: var(--danger); padding: 5px 10px; font-size: 0.8rem;">Dar Baixa</button>
                        </td>
                     </tr>`;
        });
        html += `</table>`;
        resultadoDiv.innerHTML = html;
    }
});

// Função global para dar baixa a partir da Central de Pesquisas
window.darBaixaCentral = async function(codigoEstadia) {
    if(confirm(`Deseja realizar o checkout da estadia ${codigoEstadia}?`)) {
        try {
            const response = await fetch(`http://localhost:8080/api/estadias/${codigoEstadia}/checkout`, { method: 'POST' });
            if (response.ok) {
                const resultado = await response.json();
                alert(`Checkout realizado com sucesso!\nValor Total: R$ ${resultado.valorTotal.toFixed(2)}\nPontos Ganhos: ${resultado.pontosGanhos}`);
                // Refaz a pesquisa para atualizar a tabela
                document.getElementById('formPesquisaGeral').dispatchEvent(new Event('submit'));
            } else {
                alert("Erro ao realizar o checkout.");
            }
        } catch (error) {
            console.error('Erro:', error);
        }
    }
};
// O espião global para o formulário de pesquisa
document.addEventListener('submit', async function(event) {
    if (event.target && event.target.id === 'formPesquisaGeral') {
        event.preventDefault();

        const tipo = document.getElementById('tipo-pesquisa').value;
        const termo = document.getElementById('termo-pesquisa').value.toLowerCase().trim();
        const resultadoDiv = document.getElementById('resultado-pesquisa');

        resultadoDiv.innerHTML = "<p>A procurar...</p>";

        try {
            // Lógica para Clientes e Funcionários
            if (tipo === 'clientes' || tipo === 'funcionarios') {
                const response = await fetch(`http://localhost:8080/api/${tipo}`);
                const dados = await response.json();

                // Filtra a lista: se o código for igual ou se o nome contiver o texto digitado
                const filtrados = dados.filter(item => 
                    item.codigo.toString() === termo || 
                    item.nome.toLowerCase().includes(termo)
                );

                renderizarTabelaGenerica(filtrados, tipo, resultadoDiv);
            } 
            
            // Lógica para Estadias (É necessário encontrar o cliente primeiro)
            else if (tipo === 'estadias') {
                const resClientes = await fetch(`http://localhost:8080/api/clientes`);
                const clientes = await resClientes.json();
                
                const clienteEncontrado = clientes.find(c => 
                    c.codigo.toString() === termo || c.nome.toLowerCase().includes(termo)
                );

                if (!clienteEncontrado) {
                    resultadoDiv.innerHTML = `<p style="color: red;">Nenhum cliente encontrado com esse nome ou código.</p>`;
                    return;
                }

                // Busca as estadias ativas do cliente encontrado
                const resEstadias = await fetch(`http://localhost:8080/api/estadias/cliente/${clienteEncontrado.codigo}`);
                if (resEstadias.status === 204) {
                    resultadoDiv.innerHTML = `<p>O cliente <b>${clienteEncontrado.nome}</b> não possui estadias ativas.</p>`;
                    return;
                }
                
                const estadias = await resEstadias.json();
                renderizarTabelaEstadias(estadias, clienteEncontrado.nome, resultadoDiv);
            }

        } catch (error) {
            console.error("Erro na pesquisa:", error);
            resultadoDiv.innerHTML = `<p style="color: red;">Erro ao ligar ao servidor.</p>`;
        }
    }
});

// Função auxiliar para desenhar a tabela de Clientes ou Funcionários
function renderizarTabelaGenerica(dados, tipo, resultadoDiv) {
    if (dados.length === 0) {
        resultadoDiv.innerHTML = `<p>Nenhum resultado encontrado.</p>`;
        return;
    }

    let html = `<table style="width: 100%; border-collapse: collapse; text-align: left;">
                    <tr style="background-color: var(--light-grey); border-bottom: 2px solid #ccc;">
                        <th style="padding: 10px;">Código</th>
                        <th style="padding: 10px;">Nome</th>
                        <th style="padding: 10px;">Telefone</th>
                        ${tipo === 'clientes' ? '<th style="padding: 10px;">Pontos Fidelidade</th>' : '<th style="padding: 10px;">Cargo</th><th style="padding: 10px;">Salário</th>'}
                    </tr>`;
    
    dados.forEach(item => {
        html += `<tr style="border-bottom: 1px solid #eee;">
                    <td style="padding: 10px;">${item.codigo}</td>
                    <td style="padding: 10px;">${item.nome}</td>
                    <td style="padding: 10px;">${item.telefone}</td>
                    ${tipo === 'clientes' ? 
                        `<td style="padding: 10px;">${item.pontosFidelidade || 0}</td>` : 
                        `<td style="padding: 10px;">${item.cargo}</td><td style="padding: 10px;">R$ ${item.salario.toFixed(2)}</td>`}
                 </tr>`;
    });
    html += `</table>`;
    resultadoDiv.innerHTML = html;
}

// Função auxiliar para desenhar a tabela de Estadias
function renderizarTabelaEstadias(estadias, nomeCliente, resultadoDiv) {
    let html = `<h4 style="margin-bottom: 15px;">Estadias ativas de: ${nomeCliente}</h4>
                <table style="width: 100%; border-collapse: collapse; text-align: left;">
                    <tr style="background-color: var(--light-grey); border-bottom: 2px solid #ccc;">
                        <th style="padding: 10px;">Cód. Estadia</th>
                        <th style="padding: 10px;">Quarto</th>
                        <th style="padding: 10px;">Entrada</th>
                        <th style="padding: 10px;">Saída</th>
                        <th style="padding: 10px;">Ação</th>
                    </tr>`;
    
    estadias.forEach(est => {
        html += `<tr style="border-bottom: 1px solid #eee;">
                    <td style="padding: 10px;">${est.codigo}</td>
                    <td style="padding: 10px;">${est.numeroQuarto}</td>
                    <td style="padding: 10px;">${est.dataEntrada}</td>
                    <td style="padding: 10px;">${est.dataSaida}</td>
                    <td style="padding: 10px;">
                        <button onclick="darBaixaCentral(${est.codigo})" class="btn-primary" style="background-color: var(--danger); padding: 5px 10px; font-size: 0.8rem;">Dar Baixa</button>
                    </td>
                 </tr>`;
    });
    html += `</table>`;
    resultadoDiv.innerHTML = html;
}

// Função global para realizar o checkout a partir do botão da tabela
window.darBaixaCentral = async function(codigoEstadia) {
    if(confirm(`Deseja realizar o checkout da estadia ${codigoEstadia}?`)) {
        try {
            const response = await fetch(`http://localhost:8080/api/estadias/${codigoEstadia}/checkout`, { method: 'POST' });
            if (response.ok) {
                const resultado = await response.json();
                alert(`Checkout realizado com sucesso!\nValor Total: R$ ${resultado.valorTotal.toFixed(2)}\nPontos Ganhos: ${resultado.pontosGanhos}`);
                
                // Simula um clique no botão de pesquisa para atualizar a tabela na hora
                const btnSubmit = document.querySelector('#formPesquisaGeral button[type="submit"]');
                if(btnSubmit) btnSubmit.click();
            } else {
                alert("Erro ao realizar o checkout.");
            }
        } catch (error) {
            console.error('Erro no checkout:', error);
            alert("Erro de ligação com o servidor.");
        }
    }
};