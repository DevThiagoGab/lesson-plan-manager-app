const API_URL = 'http://localhost:3000/planos';
let listaDePlanos = [];

let paginaAtual = 1;
const itensPorPagina = 2;

async function carregarPlanosDoBancoMock() {
    try {
        const resposta = await fetch(API_URL);

        if (!resposta.ok) throw new Error('Erro ao buscar dados do servidor');

        listaDePlanos = await resposta.json();
        desenharPlanosNaTela();
    } catch (erro) {
        console.error("Erro na integração:", erro);
        document.getElementById('lista-planos').innerHTML = "Erro ao conectar com o servidor Back-end. Verifique se ele está ligado!";
    }
}

function desenharPlanosNaTela() {
    const container = document.getElementById('lista-planos');
    container.innerHTML = "";

    const buscaTitulo = document.getElementById('filtro-titulo').value.toLowerCase().trim();
    const buscaDisciplina = document.getElementById('filtro-disciplina').value.toLowerCase().trim();
    const buscaTag = document.getElementById('filtro-tag').value.toLowerCase().trim();
    const buscaData = document.getElementById('filtro-data').value;
    const tipoOrdenacao = document.getElementById('ordenacao-seletor').value;

    let planosExibidos = listaDePlanos.filter(plano => {
        const bateTitulo = plano.titulo.toLowerCase().includes(buscaTitulo);
        const bateDisciplina = !buscaDisciplina || (plano.disciplina && plano.disciplina.toLowerCase().includes(buscaDisciplina));
        const bateTag = !buscaTag || (plano.tags && plano.tags.some(t => t.toLowerCase().includes(buscaTag)));
        const bateData = !buscaData || (plano.dataPrevista === buscaData);

        return bateTitulo && bateDisciplina && bateTag && bateData;
    });

    if (tipoOrdenacao === "titulo-asc") {
        planosExibidos.sort((a, b) => a.titulo.localeCompare(b.titulo));
    } else if (tipoOrdenacao === "titulo-desc") {
        planosExibidos.sort((a, b) => b.titulo.localeCompare(a.titulo));
    } else if (tipoOrdenacao === "cadastro-asc") {
        planosExibidos.sort((a, b) => a.id - b.id);
    } else if (tipoOrdenacao === "cadastro-desc") {
        planosExibidos.sort((a, b) => b.id - a.id);
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
                
                <button onclick="prepararEdicao(${plano.id})" style="background: #ffc107; border: none; padding: 5px 10px; border-radius: 3px; cursor: pointer; margin-right: 5px;">Editar</button>
                <button onclick="apagarPlano(${plano.id})" style="background: #dc3545; color: white; border: none; padding: 5px 10px; border-radius: 3px; cursor: pointer;">Excluir</button>
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
    if (confirm("Tem certeza que deseja apagar este plano?")) {
        try {
            const resposta = await fetch(`${API_URL}/${id}`, {
                method: 'DELETE'
            });

            if (!resposta.ok) throw new Error('Erro ao deletar no servidor');

            listaDePlanos = listaDePlanos.filter(plano => plano.id !== id);
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
document.getElementById('filtro-disciplina').addEventListener('input', () => { paginaAtual = 1; desenharPlanosNaTela(); });
document.getElementById('filtro-tag').addEventListener('input', () => { paginaAtual = 1; desenharPlanosNaTela(); });
document.getElementById('filtro-data').addEventListener('change', () => { paginaAtual = 1; desenharPlanosNaTela(); });
document.getElementById('ordenacao-seletor').addEventListener('change', () => { desenharPlanosNaTela(); });

document.getElementById('btn-limpar-filtros').addEventListener('click', function () {
    document.getElementById('filtro-titulo').value = "";
    document.getElementById('filtro-disciplina').value = "";
    document.getElementById('filtro-tag').value = "";
    document.getElementById('filtro-data').value = "";
    document.getElementById('ordenacao-seletor').value = "cadastro-desc";
    paginaAtual = 1;
    desenharPlanosNaTela();
});

carregarPlanosDoBancoMock();