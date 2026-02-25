document.addEventListener("DOMContentLoaded", () => {
    const formEstadia = document.getElementById('formEstadia');
    const formPesquisaEstadia = document.getElementById('formPesquisaEstadia');
    const mensagemDiv = document.getElementById('mensagem-estadia');
    const tabelaBody = document.getElementById('tabela-estadias-body');

    // --- 1. CADASTRAR NOVA ESTADIA ---
    if (formEstadia) {
        formEstadia.addEventListener('submit', function(event) {
            event.preventDefault();

            const reserva = {
                codigoCliente: parseInt(document.getElementById('codigo-cliente-estadia').value),
                quantidadeHospedes: parseInt(document.getElementById('qtd-hospedes').value),
                dataEntrada: document.getElementById('data-entrada').value,
                dataSaida: document.getElementById('data-saida').value
            };

            fetch('http://localhost:8080/api/estadias', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(reserva)
            })
            .then(async response => {
                if (response.ok) {
                    const data = await response.json();
                    mensagemDiv.style.color = "green";
                    // Supõe que o backend retorna os dados da estadia gerada, incluindo o quarto escolhido
                    mensagemDiv.innerText = `Estadia confirmada com sucesso no Quarto ${data.numeroQuarto}!`;
                    formEstadia.reset();
                } else {
                    mensagemDiv.style.color = "red";
                    mensagemDiv.innerText = "Erro: Nenhum quarto disponível para este período e capacidade, ou cliente não encontrado.";
                }
                setTimeout(() => mensagemDiv.innerText = "", 5000);
            })
            .catch(error => console.error('Erro:', error));
        });
    }

    // --- 2. PESQUISAR ESTADIAS DO CLIENTE ---
    if (formPesquisaEstadia) {
        formPesquisaEstadia.addEventListener('submit', function(event) {
            event.preventDefault();
            const termoPesquisa = document.getElementById('pesquisa-cliente-estadia').value;

            // Ajuste a rota da API conforme o seu Spring Boot (Ex: /api/estadias/cliente/123)
            fetch(`http://localhost:8080/api/estadias/cliente/${termoPesquisa}`)
            .then(response => response.json())
            .then(estadias => {
                tabelaBody.innerHTML = ""; // Limpa a tabela

                if (estadias.length === 0) {
                    tabelaBody.innerHTML = `<tr><td colspan="5" style="padding: 15px; text-align: center;">Nenhuma estadia encontrada.</td></tr>`;
                    return;
                }

                // Preenche a tabela com os resultados
                estadias.forEach(estadia => {
                    const tr = document.createElement('tr');
                    tr.style.borderBottom = "1px solid #eee";
                    tr.innerHTML = `
                        <td style="padding: 12px;">${estadia.codigo}</td>
                        <td style="padding: 12px;">${estadia.numeroQuarto}</td>
                        <td style="padding: 12px;">${estadia.dataEntrada}</td>
                        <td style="padding: 12px;">${estadia.dataSaida}</td>
                        <td style="padding: 12px;">
                            <button onclick="darBaixa(${estadia.codigo})" class="btn-primary" style="background-color: var(--danger); padding: 8px 12px; font-size: 0.9em;">Dar Baixa</button>
                        </td>
                    `;
                    tabelaBody.appendChild(tr);
                });
            })
            .catch(error => {
                console.error('Erro na pesquisa:', error);
                tabelaBody.innerHTML = `<tr><td colspan="5" style="padding: 15px; text-align: center; color: red;">Erro ao buscar estadias.</td></tr>`;
            });
        });
    }
});

// --- 3. DAR BAIXA (CHECKOUT) ---
// Função global para ser chamada pelo botão dentro da tabela
window.darBaixa = function(codigoEstadia) {
    if(confirm(`Deseja realmente dar baixa na estadia ${codigoEstadia}?`)) {
        
        fetch(`http://localhost:8080/api/estadias/${codigoEstadia}/checkout`, {
            method: 'POST'
        })
        .then(async response => {
            if (response.ok) {
                const resultado = await response.json();
                // O backend deve calcular os dias, multiplicar pelo valor do quarto e retornar o total
                alert(`Checkout realizado com sucesso!\nValor Total a Pagar: R$ ${resultado.valorTotal.toFixed(2)}\nPontos de Fidelidade Ganhos: ${resultado.pontosGanhos}`);
                
                // Refaz a pesquisa para atualizar a tabela (removendo a estadia baixada)
                document.getElementById('formPesquisaEstadia').dispatchEvent(new Event('submit'));
            } else {
                alert("Erro ao realizar o checkout.");
            }
        })
        .catch(error => console.error('Erro no checkout:', error));
    }
};
// O "espião" vigia todos os submits da página
document.addEventListener('submit', async function(event) {
    
    // Verifica se quem disparou o submit foi o formulário de Estadia
    if (event.target && event.target.id === 'formEstadia') {
        event.preventDefault(); // Impede que a página recarregue

        // Monta o objeto exatamente como o Spring Boot espera
        const reserva = {
            codigoCliente: parseInt(document.getElementById('codigo-cliente-estadia').value),
            quantidadeHospedes: parseInt(document.getElementById('qtd-hospedes').value),
            dataEntrada: document.getElementById('data-entrada').value,
            dataSaida: document.getElementById('data-saida').value
        };

        const msgDiv = document.getElementById('mensagem-estadia');

        try {
            // Faz a requisição POST para o backend
            const response = await fetch('http://localhost:8080/api/estadias', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(reserva)
            });

            if (response.ok) {
                // Se deu certo, extrai os dados para mostrar o número do quarto escolhido pelo Java
                const data = await response.json();
                msgDiv.style.color = "green";
                msgDiv.innerText = `Estadia confirmada com sucesso! O Quarto ${data.numeroQuarto} foi reservado.`;
                
                event.target.reset(); // Limpa os campos
            } else {
                // Se deu erro (ex: cliente não existe ou sem quartos disponíveis), o Java envia uma mensagem de texto (Bad Request)
                const errorMsg = await response.text();
                msgDiv.style.color = "red";
                msgDiv.innerText = errorMsg || "Erro: Nenhum quarto disponível ou cliente não encontrado.";
            }
        } catch (error) {
            console.error("Erro na requisição:", error);
            msgDiv.style.color = "red";
            msgDiv.innerText = "Erro de ligação com o servidor.";
        }
        
        // Apaga a mensagem após 6 segundos
        setTimeout(() => msgDiv.innerText = "", 6000);
    }
});