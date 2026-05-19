let listaDePlanos = [];

let paginaAtual = 1;
const itensPorPagina = 2;

async function carregarPlanosDoBancoMock() {
    try {
        const resposta = await fetch('./db.json');
        const dados = await resposta.json();
        listaDePlanos = dados.planos;
        desenharPlanosNaTela();
    } catch (erro) {
        console.error("Erro ao carregar o mock:", erro);
        document.getElementById('lista-planos').innerHTML = "Erro ao carregar os dados do db.json.";
    }
}

function desenharPlanosNaTela() {
    const container = document.getElementById('lista-planos');
    container.innerHTML = "";

    const indiceInicial = (paginaAtual - 1) * itensPorPagina;
    const indiceFinal = indiceInicial + itensPorPagina;
    const planosDaPagina = listaDePlanos.slice(indiceInicial, indiceFinal);

    if (planosDaPagina.length === 0 && paginaAtual > 1) {
        paginaAtual--;
        desenharPlanosNaTela();
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

    renderizarBotoesPagina();
}

function renderizarBotoesPagina() {
    const containerPaginacao = document.getElementById('paginacao');
    containerPaginacao.innerHTML = "";

    const totalPaginas = Math.ceil(listaDePlanos.length / itensPorPagina);

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

function apagarPlano(id) {
    if (confirm("Tem certeza que deseja apagar este plano?")) {
        listaDePlanos = listaDePlanos.filter(plano => plano.id !== id);
        desenharPlanosNaTela();
        alert("Plano excluído!");
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

document.getElementById('form-plano').addEventListener('submit', function (event) {
    event.preventDefault();

    const conteudos = capturarValoresDinamicos('container-conteudos');
    const recursosApoio = capturarValoresDinamicos('container-recursos');
    const tags = capturarValoresDinamicos('container-tags');

    if (conteudos.length === 0 || recursosApoio.length === 0 || tags.length === 0) {
        alert("Por favor, adicione pelo menos um Conteúdo, um Recurso e uma Tag.");
        return;
    }

    const novoPlano = {
        id: Date.now(),
        titulo: document.getElementById('titulo').value,
        disciplina: document.getElementById('disciplina').value,
        dataPrevista: document.getElementById('dataPrevista').value,
        objetivo: document.getElementById('objetivo').value,
        ementa: document.getElementById('ementa').value,
        conteudos: conteudos,
        recursosApoio: recursosApoio,
        tags: tags
    };

    listaDePlanos.unshift(novoPlano);
    paginaAtual = 1;
    desenharPlanosNaTela();
    this.reset();
    alert("Plano adicionado!");
    mostrarListagem();
});

document.getElementById('form-editar-plano').addEventListener('submit', function (event) {
    event.preventDefault();

    const idParaEditar = Number(document.getElementById('edit-id').value);
    const plano = listaDePlanos.find(p => p.id === idParaEditar);

    if (plano) {
        const conteudos = capturarValoresDinamicos('edit-container-conteudos');
        const recursosApoio = capturarValoresDinamicos('edit-container-recursos');
        const tags = capturarValoresDinamicos('edit-container-tags');

        if (conteudos.length === 0 || recursosApoio.length === 0 || tags.length === 0) {
            alert("Por favor, adicione pelo menos um Conteúdo, um Recurso e uma Tag.");
            return;
        }

        plano.titulo = document.getElementById('edit-titulo').value;
        plano.disciplina = document.getElementById('edit-disciplina').value;
        plano.dataPrevista = document.getElementById('edit-dataPrevista').value;
        plano.objetivo = document.getElementById('edit-objetivo').value;
        plano.ementa = document.getElementById('edit-ementa').value;
        plano.conteudos = conteudos;
        plano.recursosApoio = recursosApoio;
        plano.tags = tags;

        desenharPlanosNaTela();
        alert("Plano atualizado com sucesso!");
        mostrarListagem();
    }
});

carregarPlanosDoBancoMock();