document.addEventListener("DOMContentLoaded", () => {
    const menuLinks = document.querySelectorAll(".menu a:not(.btn-sair)");
    const conteudoDinamico = document.getElementById("conteudo-dinamico");
    const tituloPagina = document.getElementById("titulo-pagina");

    // Função assíncrona que busca o HTML
    async function carregarPagina(url, titulo) {
        try {
            conteudoDinamico.innerHTML = "<p>Carregando...</p>";
            
            // Faz o fetch do arquivo HTML
            const response = await fetch(url);
            
            if (!response.ok) throw new Error("Erro ao carregar a página");
            
            const html = await response.text();
            
            // Injeta o HTML na tela principal
            conteudoDinamico.innerHTML = html;
            
            // Atualiza o título no topo
            tituloPagina.textContent = titulo;
            
            if (url.includes('relatorios.html') && typeof carregarGraficos === 'function') {
                carregarGraficos(); // Chama a função que desenha os gráficos
            }

        } catch (error) {
            conteudoDinamico.innerHTML = `<p style="color: red;">Erro: Não foi possível carregar a tela.</p>`;
            console.error(error);
        }
    }

    // Configura os cliques no menu
    menuLinks.forEach(link => {
        link.addEventListener("click", (event) => {
            event.preventDefault(); // Evita recarregar a página inteira
            
            // Muda a cor do botão ativo
            menuLinks.forEach(l => l.classList.remove("active"));
            link.classList.add("active");

            // Pega a URL do arquivo e carrega
            const urlDaPagina = link.getAttribute("data-page");
            const titulo = `Gestão de ${link.textContent}`;
            
            carregarPagina(urlDaPagina, titulo);
        });
    });

    // Carrega a tela de cadastros automaticamente quando o site abrir
    carregarPagina("paginas/cadastros.html", "Gestão de Cadastros");
});

// Delegação de Eventos para o Seletor de Cadastros (Já que o HTML é injetado dinamicamente)
document.addEventListener('change', function(event) {
    if (event.target && event.target.id === 'seletor-cadastro') {
        const containers = document.querySelectorAll('.form-container');
        containers.forEach(container => container.style.display = 'none');
        document.getElementById(event.target.value).style.display = 'block';
    }
});