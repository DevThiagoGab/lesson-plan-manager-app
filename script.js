const API_URL = 'http://localhost:3000/planos';
let listaDePlanos = [];

let paginaAtual = 1;
const itensPorPagina = 2;

function obterDadosMockados() {
    return [
        {
            id: "mock-6",
            titulo: "Gerenciamento de Estado Global com Context API",
            disciplina: "Desenvolvimento Web",
            dataPrevista: "2026-05-10",
            objetivo: "Aprender a compartilhar estados entre componentes sem fazer prop drilling.",
            ementa: "Criação de Contextos, uso do hook useContext e estruturação de Providers.",
            conteudos: ["O que é Prop Drilling", "Criando um Contexto", "Consumindo dados globalmente"],
            recursosApoio: ["VS Code", "Navegador", "Documentação do React"],
            tags: ["React", "Frontend", "JavaScript"]
        },
        {
            id: "mock-5",
            titulo: "Construção de APIs REST com Django REST Framework",
            disciplina: "Desenvolvimento Web",
            dataPrevista: "2026-05-15",
            objetivo: "Compreender o padrão REST e criar endpoints utilizando Serializers.",
            ementa: "Introdução ao DRF, criação de Serializers, APIViews e ViewSets.",
            conteudos: ["Princípios do REST", "Serialização de Modelos", "Rotas automáticas com Routers"],
            recursosApoio: ["Python 3", "Postman", "Insomnia"],
            tags: ["Django", "Backend", "Python"]
        },
        {
            id: "mock-4",
            titulo: "Consultas Avançadas e Junções em SQL",
            disciplina: "Banco de Dados",
            dataPrevista: "2026-05-20",
            objetivo: "Dominar a extração de dados de múltiplas tabelas relacionais.",
            ementa: "Uso de comandos JOIN, cláusulas GROUP BY, HAVING e funções de agregação.",
            conteudos: ["INNER JOIN e LEFT JOIN", "Funções COUNT, SUM e AVG", "Filtragem com HAVING"],
            recursosApoio: ["SQLite Studio", "DBeaver"],
            tags: ["SQL", "SQLite", "Modelagem"]
        },
        {
            id: "mock-3",
            titulo: "Introdução a Componentes e Props no React",
            disciplina: "Desenvolvimento Web",
            dataPrevista: "2026-05-22",
            objetivo: "Compreender a arquitetura baseada em componentes e passagem de propriedades.",
            ementa: "Criação de componentes funcionais, reutilização de código e imutabilidade de props.",
            conteudos: ["O que são componentes", "Renderização dinâmica", "Passagem de parâmetros"],
            recursosApoio: ["VS Code", "Node.js", "Repositório do GitHub"],
            tags: ["React", "Frontend", "JavaScript"]
        },
        {
            id: "mock-2",
            titulo: "Configuração de Rotas e Controllers no Django",
            disciplina: "Desenvolvimento Web",
            dataPrevista: "2026-05-28",
            objetivo: "Aprender a mapear URLs e estruturar a lógica de resposta do servidor.",
            ementa: "Mapeamento do arquivo urls.py, criação de views baseadas em funções e classes.",
            conteudos: ["Padrão MVT", "Criação de Views", "Parâmetros de URL"],
            recursosApoio: ["Python 3", "Postman", "Documentação do Django"],
            tags: ["Django", "Backend", "Python"]
        },
        {
            id: "mock-1",
            titulo: "Modelagem de Banco de Dados Relacional",
            disciplina: "Banco de Dados",
            dataPrevista: "2026-06-05",
            objetivo: "Dominar conceitos de chaves primárias, estrangeiras e integridade referencial.",
            ementa: "Diagrama Entidade-Relacionamento, comandos DDL, restrições de chaves.",
            conteudos: ["Chave Primária (PK)", "Chave Estrangeira (FK)", "Normalização"],
            recursosApoio: ["SQLite Studio", "Quadro digital"],
            tags: ["SQL", "SQLite", "Modelagem"]
        }
    ];
}

async function carregarPlanosDoBancoMock() {
    try {
        const resposta = await fetch(API_URL);

        if (!resposta.ok) throw new Error('Erro ao buscar dados do servidor');

        const dadosDoServidor = await resposta.json();
        const dadosMockados = obterDadosMockados();

        listaDePlanos = [...dadosDoServidor, ...dadosMockados];

        alimentarDropdownFiltros();
        desenharPlanosNaTela();
    } catch (erro) {
        console.error("Erro na integração:", erro);
        listaDePlanos = obterDadosMockados();
        alimentarDropdownFiltros();
        desenharPlanosNaTela();
    }
}

function alimentarDropdownFiltros() {
    const seletorDisciplina = document.getElementById('filtro-disciplina');
    const seletorTag = document.getElementById('filtro-tag');

    const valorDisciplinaAtual = seletorDisciplina.value;
    const valorTagAtual = seletorTag.value;

    const disciplinasUnicas = new Set();
    const tagsUnicas = new Set();

    listaDePlanos.forEach(plano => {
        if (plano.disciplina) disciplinasUnicas.add(plano.disciplina.trim());
        if (plano.tags && Array.isArray(plano.tags)) {
            plano.tags.forEach(tag => tagsUnicas.add(tag.trim()));
        }
    });

    seletorDisciplina.innerHTML = '<option value="">Todas as Disciplinas</option>';
    disciplinasUnicas.forEach(disciplina => {
        const option = document.createElement('option');
        option.value = disciplina;
        option.textContent = disciplina;
        seletorDisciplina.appendChild(option);
    });

    seletorTag.innerHTML = '<option value="">Todas as Tags</option>';
    tagsUnicas.forEach(tag => {
        const option = document.createElement('option');
        option.value = tag;
        option.textContent = tag;
        seletorTag.appendChild(option);
    });

    if (disciplinasUnicas.has(valorDisciplinaAtual)) {
        seletorDisciplina.value = valorDisciplinaAtual;
    }
    if (tagsUnicas.has(valorTagAtual)) {
        seletorTag.value = valorTagAtual;
    }
}

function desenharPlanosNaTela() {
    const container = document.getElementById('lista-planos');
    container.innerHTML = "";

    const buscaTitulo = document.getElementById('filtro-titulo').value.toLowerCase().trim();
    const buscaDisciplina = document.getElementById('filtro-disciplina').value;
    const buscaTag = document.getElementById('filtro-tag').value;
    const buscaDataInicio = document.getElementById('filtro-data-inicio').value;
    const buscaDataFim = document.getElementById('filtro-data-fim').value;
    const tipoOrdenacao = document.getElementById('ordenacao-seletor').value;

    let planosExibidos = listaDePlanos.filter(plano => {
        const bateTitulo = plano.titulo.toLowerCase().includes(buscaTitulo);
        const bateDisciplina = !buscaDisciplina || (plano.disciplina && plano.disciplina === buscaDisciplina);
        const bateTag = !buscaTag || (plano.tags && plano.tags.includes(buscaTag));

        let bateData = true;
        if (plano.dataPrevista) {
            if (buscaDataInicio && plano.dataPrevista < buscaDataInicio) bateData = false;
            if (buscaDataFim && plano.dataPrevista > buscaDataFim) bateData = false;
        } else if (buscaDataInicio || buscaDataFim) {
            bateData = false;
        }

        return bateTitulo && bateDisciplina && bateTag && bateData;
    });

    if (tipoOrdenacao === "titulo-asc") {
        planosExibidos.sort((a, b) => a.titulo.localeCompare(b.titulo));
    } else if (tipoOrdenacao === "titulo-desc") {
        planosExibidos.sort((a, b) => b.titulo.localeCompare(a.titulo));
    } else if (tipoOrdenacao === "cadastro-asc") {
        planosExibidos.sort((a, b) => {
            const idA = typeof a.id === 'string' ? parseInt(a.id.replace('mock-', '')) : a.id;
            const idB = typeof b.id === 'string' ? parseInt(b.id.replace('mock-', '')) : b.id;
            return idA - idB;
        });
    } else if (tipoOrdenacao === "cadastro-desc") {
        planosExibidos.sort((a, b) => {
            const idA = typeof a.id === 'string' ? parseInt(a.id.replace('mock-', '')) : a.id;
            const idB = typeof b.id === 'string' ? parseInt(b.id.replace('mock-', '')) : b.id;
            return idB - idA;
        });
    }

    const indiceInicial = (paginaAtual - 1) * itensPorPagina;
    const indiceFinal = indiceInicial + itensPorPagina;
    const planosDaPagina = planosExibidos.slice(indiceInicial, indiceFinal);

    if (planosDaPagina.length === 0 && paginaAtual > 1) {
        paginaAtual--;
        desenharPlanosNaTela();
        return;
    }

    if (planosDaPagina.length === 0) {
        container.innerHTML = `<p style="text-align:center; color:#777; font-family:sans-serif; margin-top:20px;">Nenhum plano de aula encontrado para os filtros aplicados.</p>`;
        renderizarBotoesPaginaAdaptado(0);
        return;
    }

    planosDaPagina.forEach(plano => {
        const listaConteudos = plano.conteudos && plano.conteudos.length > 0
            ? plano.conteudos.map(item => `<li>${item}</li>`).join('')
            : '<li>Nenhum conteúdo informado</li>';

        const listaRecursos = plano.recursosApoio && plano.recursosApoio.length > 0
            ? plano.recursosApoio.join(', ')
            : 'Nenhum recurso';

        const listaTags = plano.tags && plano.tags.length > 0
            ? plano.tags.map(tag => `<span style="background:#007bff; color:white; padding:3px 8px; border-radius:12px; font-size:12px; margin-right:5px; display:inline-block; margin-bottom:5px;">${tag}</span>`).join('')
            : '';

        const paramId = typeof plano.id === 'string' ? `'${plano.id}'` : plano.id;

        container.innerHTML += `
            <div style="border: 1px solid #ddd; padding: 15px; margin-bottom: 20px; border-radius: 8px; font-family: sans-serif;">
                <h2>${plano.titulo}</h2>
                <p><strong>Disciplina:</strong> ${plano.disciplina || 'Não informada'} | <strong>Data:</strong> ${plano.dataPrevista || 'Não informada'}</p>
                <p><strong>Objetivo:</strong> ${plano.objetivo || 'Não informado'}</p>
                <p><strong>Ementa:</strong> ${plano.ementa || 'Não informada'}</p>
                
                <h4>Conteúdos:</h4>
                <ul>${listaConteudos}</ul>

                <h4>Recursos de Apoio:</h4>
                <p>${listaRecursos}</p>

                <div style="margin-top: 10px; margin-bottom: 15px;">${listaTags}</div>
                
                <button onclick="prepararEdicao(${paramId})" style="background: #ffc107; border: none; padding: 5px 10px; border-radius: 3px; cursor: pointer; margin-right: 5px;">Editar</button>
                <button onclick="apagarPlano(${paramId})" style="background: #dc3545; color: white; border: none; padding: 5px 10px; border-radius: 3px; cursor: pointer;">Excluir</button>
            </div>
        `;
    });

    renderizarBotoesPaginaAdaptado(planosExibidos.length);
}

function renderizarBotoesPaginaAdaptado(totalItensFiltrados) {
    const containerPaginacao = document.getElementById('paginacao');
    containerPaginacao.innerHTML = "";

    const totalPaginas = Math.ceil(totalItensFiltrados / itensPorPagina);

    if (totalPaginas <= 1) return;

    if (paginaAtual > 1) {
        const botaoAnterior = document.createElement('button');
        botaoAnterior.innerText = "◀ Anterior";
        botaoAnterior.style.marginRight = "10px";
        botaoAnterior.onclick = function () {
            paginaAtual--;
            desenharPlanosNaTela();
        };
        containerPaginacao.appendChild(botaoAnterior);
    }

    const indicador = document.createElement('span');
    indicador.innerText = ` Página ${paginaAtual} de ${totalPaginas} `;
    containerPaginacao.appendChild(indicador);

    if (paginaAtual < totalPaginas) {
        const botaoProximo = document.createElement('button');
        botaoProximo.innerText = "Próximo ▶";
        botaoProximo.style.marginLeft = "10px";
        botaoProximo.onclick = function () {
            paginaAtual++;
            desenharPlanosNaTela();
        };
        containerPaginacao.appendChild(botaoProximo);
    }
}

function adicionarInput(containerId, valor = "") {
    const container = document.getElementById(containerId);

    const divInput = document.createElement('div');
    divInput.style.marginBottom = "5px";

    const input = document.createElement('input');
    input.type = "text";
    input.className = "campo-dinamico";
    input.value = valor;
    input.placeholder = "Digite o item aqui";
    input.required = true;

    const botaoRemover = document.createElement('button');
    botaoRemover.type = "button";
    botaoRemover.innerText = "X";
    botaoRemover.style.marginLeft = "5px";
    botaoRemover.onclick = function () {
        container.removeChild(divInput);
    };

    divInput.appendChild(input);
    divInput.appendChild(botaoRemover);
    container.appendChild(divInput);
}

function capturarValoresDinamicos(containerId) {
    const container = document.getElementById(containerId);
    const inputs = container.querySelectorAll('.campo-dinamico');
    const valores = [];

    inputs.forEach(input => {
        if (input.value.trim() !== "") {
            valores.push(input.value.trim());
        }
    });

    return valores;
}

function mostrarListagem() {
    document.getElementById('tela-listagem').style.display = 'block';
    document.getElementById('tela-formulario').style.display = 'none';
    document.getElementById('tela-editar').style.display = 'none';
}

function mostrarFormulario() {
    document.getElementById('tela-listagem').style.display = 'none';
    document.getElementById('tela-formulario').style.display = 'block';
    document.getElementById('tela-editar').style.display = 'none';

    document.getElementById('container-conteudos').innerHTML = "";
    document.getElementById('container-recursos').innerHTML = "";
    document.getElementById('container-tags').innerHTML = "";
    adicionarInput('container-conteudos');
    adicionarInput('container-recursos');
    adicionarInput('container-tags');
}

function mostrarTelaEditar() {
    document.getElementById('tela-listagem').style.display = 'none';
    document.getElementById('tela-formulario').style.display = 'none';
    document.getElementById('tela-editar').style.display = 'block';
}

async function apagarPlano(id) {
    if (typeof id === 'string' && id.startsWith('mock-')) {
        if (confirm("Este é um plano de teste mockado. Deseja removê-lo da tela nesta sessão?")) {
            listaDePlanos = listaDePlanos.filter(plano => plano.id !== id);
            alimentarDropdownFiltros();
            desenharPlanosNaTela();
        }
        return;
    }

    if (confirm("Tem certeza que deseja apagar este plano do Banco de Dados?")) {
        try {
            const resposta = await fetch(`${API_URL}/${id}`, {
                method: 'DELETE'
            });

            if (!resposta.ok) throw new Error('Erro ao deletar no servidor');

            listaDePlanos = listaDePlanos.filter(plano => plano.id !== id);
            alimentarDropdownFiltros();
            desenharPlanosNaTela();
            alert("Plano excluído com sucesso do Banco de Dados!");
        } catch (erro) {
            console.error("Erro ao deletar:", erro);
            alert("Não foi possível excluir o plano do servidor.");
        }
    }
}

function prepararEdicao(id) {
    const plano = listaDePlanos.find(p => p.id === id);

    if (plano) {
        if (typeof id === 'string' && id.startsWith('mock-')) {
            alert("Os dados mockados são apenas para visualização e testes de filtros. Para testar a edição completa com banco de dados, crie um novo plano!");
            return;
        }

        document.getElementById('edit-id').value = plano.id;
        document.getElementById('edit-titulo').value = plano.titulo;
        document.getElementById('edit-disciplina').value = plano.disciplina || '';
        document.getElementById('edit-dataPrevista').value = plano.dataPrevista || '';
        document.getElementById('edit-objetivo').value = plano.objetivo || '';
        document.getElementById('edit-ementa').value = plano.ementa || '';

        document.getElementById('edit-container-conteudos').innerHTML = "";
        document.getElementById('edit-container-recursos').innerHTML = "";
        document.getElementById('edit-container-tags').innerHTML = "";

        if (plano.conteudos) plano.conteudos.forEach(c => adicionarInput('edit-container-conteudos', c));
        if (plano.recursosApoio) plano.recursosApoio.forEach(r => adicionarInput('edit-container-recursos', r));
        if (plano.tags) plano.tags.forEach(t => adicionarInput('edit-container-tags', t));

        if (!plano.conteudos || plano.conteudos.length === 0) adicionarInput('edit-container-conteudos');
        if (!plano.recursosApoio || plano.recursosApoio.length === 0) adicionarInput('edit-container-recursos');
        if (!plano.tags || plano.tags.length === 0) adicionarInput('edit-container-tags');

        mostrarTelaEditar();
    }
}

document.getElementById('form-plano').addEventListener('submit', async function (event) {
    event.preventDefault();

    const conteudos = capturarValoresDinamicos('container-conteudos');
    const recursosApoio = capturarValoresDinamicos('container-recursos');
    const tags = capturarValoresDinamicos('container-tags');

    if (conteudos.length === 0 || recursosApoio.length === 0 || tags.length === 0) {
        alert("Por favor, adicione pelo menos um Conteúdo, um Recurso e uma Tag.");
        return;
    }

    const novoPlano = {
        titulo: document.getElementById('titulo').value,
        disciplina: document.getElementById('disciplina').value,
        dataPrevista: document.getElementById('dataPrevista').value,
        objetivo: document.getElementById('objetivo').value,
        ementa: document.getElementById('ementa').value,
        conteudos: conteudos,
        recursosApoio: recursosApoio,
        tags: tags
    };

    try {
        const resposta = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(novoPlano)
        });

        if (resposta.status === 400) {
            const dadosErro = await resposta.json();
            alert("Erros de validação:\n- " + dadosErro.erros.join("\n- "));
            return;
        }

        if (!resposta.ok) throw new Error('Erro ao salvar plano no servidor');

        const planoSalvoNoBanco = await resposta.json();

        listaDePlanos.unshift(planoSalvoNoBanco);
        alimentarDropdownFiltros();
        paginaAtual = 1;
        desenharPlanosNaTela();
        this.reset();
        alert("Plano adicionado com sucesso no Banco!");
        mostrarListagem();

    } catch (erro) {
        console.error("Erro ao cadastrar:", erro);
        alert("Erro interno: Não foi possível conectar ao servidor back-end.");
    }
});

document.getElementById('form-editar-plano').addEventListener('submit', async function (event) {
    event.preventDefault();

    const idParaEditar = Number(document.getElementById('edit-id').value);
    const planoLocal = listaDePlanos.find(p => p.id === idParaEditar);

    if (planoLocal) {
        const conteudos = capturarValoresDinamicos('edit-container-conteudos');
        const recursosApoio = capturarValoresDinamicos('edit-container-recursos');
        const tags = capturarValoresDinamicos('edit-container-tags');

        if (conteudos.length === 0 || recursosApoio.length === 0 || tags.length === 0) {
            alert("Por favor, adicione pelo menos um Conteúdo, um Recurso e uma Tag.");
            return;
        }

        const dadosAtualizados = {
            titulo: document.getElementById('edit-titulo').value,
            disciplina: document.getElementById('edit-disciplina').value,
            dataPrevista: document.getElementById('edit-dataPrevista').value,
            objetivo: document.getElementById('edit-objetivo').value,
            ementa: document.getElementById('edit-ementa').value,
            conteudos: conteudos,
            recursosApoio: recursosApoio,
            tags: tags
        };

        try {
            const resposta = await fetch(`${API_URL}/${idParaEditar}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(dadosAtualizados)
            });

            if (resposta.status === 400) {
                const dadosErro = await resposta.json();
                alert("Erros de validação na Edição:\n- " + dadosErro.erros.join("\n- "));
                return;
            }

            if (!resposta.ok) throw new Error('Erro ao atualizar plano no servidor');

            Object.assign(planoLocal, dadosAtualizados);

            alimentarDropdownFiltros();
            desenharPlanosNaTela();
            alert("Plano atualizado com sucesso no Banco!");
            mostrarListagem();
        } catch (erro) {
            console.error("Erro ao editar:", erro);
            alert("Não foi possível atualizar o plano no servidor.");
        }
    }
});

document.getElementById('filtro-titulo').addEventListener('input', () => { paginaAtual = 1; desenharPlanosNaTela(); });
document.getElementById('filtro-disciplina').addEventListener('change', () => { paginaAtual = 1; desenharPlanosNaTela(); });
document.getElementById('filtro-tag').addEventListener('change', () => { paginaAtual = 1; desenharPlanosNaTela(); });
document.getElementById('filtro-data-inicio').addEventListener('change', () => { paginaAtual = 1; desenharPlanosNaTela(); });
document.getElementById('filtro-data-fim').addEventListener('change', () => { paginaAtual = 1; desenharPlanosNaTela(); });
document.getElementById('ordenacao-seletor').addEventListener('change', () => { desenharPlanosNaTela(); });

document.getElementById('btn-limpar-filtros').addEventListener('click', function () {
    document.getElementById('filtro-titulo').value = "";
    document.getElementById('filtro-disciplina').value = "";
    document.getElementById('filtro-tag').value = "";
    document.getElementById('filtro-data-inicio').value = "";
    document.getElementById('filtro-data-fim').value = "";
    document.getElementById('ordenacao-seletor').value = "cadastro-desc";
    paginaAtual = 1;
    desenharPlanosNaTela();
});

carregarPlanosDoBancoMock();

document.getElementById('btn-smart-assist').addEventListener('click', async function() {
    const campoTitulo = document.getElementById('titulo');
    const campoDisciplina = document.getElementById('disciplina');
    const campoEmenta = document.getElementById('ementa');

    if (!campoTitulo.value.trim() || !campoEmenta.value.trim()) {
        alert("Por favor, preencha pelo menos o Título e a Ementa para que a IA possa gerar recomendações!");
        return;
    }

    const botao = document.getElementById('btn-smart-assist');
    const textoOriginal = botao.innerHTML;
    botao.innerHTML = "🤖 Pensando... Aguarde...";
    botao.disabled = true;

    try {
        const resposta = await fetch('http://localhost:3000/api/smart-assist', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                titulo: campoTitulo.value,
                disciplina: campoDisciplina.value,
                ementa: campoEmenta.value
            })
        });

        if (!resposta.ok) throw new Error('Erro na resposta da API.');

        const respostaObjeto = await resposta.json();
        
        // 1. Extrai a string de texto crua que veio do n8n (posição 0, propriedade text)
        let textoCru = respostaObjeto[0]?.text;
        
        if (!textoCru) {
            throw new Error("O formato de resposta da IA não contém a propriedade 'text'.");
        }

        // Limpeza de segurança: Se o Gemini tiver envolvido o JSON em blocos de código markdown (```json ... ```), removemos
        textoCru = textoCru.replace(/```json/g, "").replace(/```/g, "").trim();

        // 2. Converte a string de texto crua em um objeto JavaScript real
        const recomendacoes = JSON.parse(textoCru);

        // 3. Limpa os containers antes de injetar os dados novos da IA
        document.getElementById('container-conteudos').innerHTML = "";
        document.getElementById('container-recursos').innerHTML = "";
        document.getElementById('container-tags').innerHTML = "";

        // 4. Preenche os Conteúdos sugeridos pela IA
        if (recomendacoes.conteudos && recomendacoes.conteudos.length > 0) {
            recomendacoes.conteudos.forEach(item => adicionarInput('container-conteudos', item));
        } else {
            adicionarInput('container-conteudos');
        }

        // 5. Preenche os Recursos de Apoio sugeridos pela IA
        if (recomendacoes.recursosApoio && recomendacoes.recursosApoio.length > 0) {
            recomendacoes.recursosApoio.forEach(item => adicionarInput('container-recursos', item));
        } else {
            adicionarInput('container-recursos');
        }

        // 6. Preenche as Tags sugeridas pela IA
        if (recomendacoes.tags && recomendacoes.tags.length > 0) {
            recomendacoes.tags.forEach(item => adicionarInput('container-tags', item));
        } else {
            adicionarInput('container-tags');
        }

        alert("✨ Campos preenchidos com sucesso pelo Smart Assist!");

    } catch (erro) {
        console.error("Erro no Smart Assist:", erro);
        alert("Não foi possível gerar recomendações. Certifique-se de que o backend e o n8n estão rodando!");
    } finally {
        botao.innerHTML = textoOriginal;
        botao.disabled = false;
    }
});