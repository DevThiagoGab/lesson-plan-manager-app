let listaDePlanos = [];

// 1. Busca os dados iniciais do db.json
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

// 2. Cria dinamicamente um novo input na tela dentro do contêiner especificado
function adicionarInput(containerId, valor = "") {
    const container = document.getElementById(containerId);
    
    // Cria uma div para envelopar o input e o botão de remover
    const divInput = document.createElement('div');
    divInput.style.marginBottom = "5px";
    
    // Cria o input de texto
    const input = document.createElement('input');
    input.type = "text";
    input.className = "campo-dinamico"; // Classe para podermos capturar os valores depois
    input.value = valor;
    input.placeholder = "Digite o item aqui";
    
    // Cria um botão simples de "X" para caso o usuário queira remover aquele input específico
    const botaoRemover = document.createElement('button');
    botaoRemover.type = "button";
    botaoRemover.innerText = "X";
    botaoRemover.style.marginLeft = "5px";
    botaoRemover.onclick = function() {
        container.removeChild(divInput);
    };
    
    divInput.appendChild(input);
    divInput.appendChild(botaoRemover);
    container.appendChild(divInput);
}

// 3. Função auxiliar para ler todos os valores dos inputs dinâmicos de um contêiner
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

// 4. Desenha os cards na listagem principal
function desenharPlanosNaTela() {
    const container = document.getElementById('lista-planos');
    container.innerHTML = ""; 

    listaDePlanos.forEach(plano => {
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
}

// 5. Funções de Navegação da SPA
function mostrarListagem() {
    document.getElementById('tela-listagem').style.display = 'block';
    document.getElementById('tela-formulario').style.display = 'none';
    document.getElementById('tela-editar').style.display = 'none';
}

function mostrarFormulario() {
    document.getElementById('tela-listagem').style.display = 'none';
    document.getElementById('tela-formulario').style.display = 'block';
    document.getElementById('tela-editar').style.display = 'none';
    
    // Limpa e inicia os contêineres de cadastro com pelo menos 1 input em branco padrão
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

// 6. Lógica de Exclusão
function apagarPlano(id) {
    if (confirm("Tem certeza que deseja apagar este plano?")) {
        listaDePlanos = listaDePlanos.filter(plano => plano.id !== id);
        desenharPlanosNaTela();
        alert("Plano excluído!");
    }
}

// 7. Carrega os dados na tela de Edição (Montando os múltiplos inputs salvos)
function prepararEdicao(id) {
    const plano = listaDePlanos.find(p => p.id === id);

    if (plano) {
        document.getElementById('edit-id').value = plano.id;
        document.getElementById('edit-titulo').value = plano.titulo;
        document.getElementById('edit-disciplina').value = plano.disciplina || '';
        document.getElementById('edit-dataPrevista').value = plano.dataPrevista || '';
        document.getElementById('edit-objetivo').value = plano.objetivo || '';
        document.getElementById('edit-ementa').value = plano.ementa || '';
        
        // Limpa os contêineres antigos da edição
        document.getElementById('edit-container-conteudos').innerHTML = "";
        document.getElementById('edit-container-recursos').innerHTML = "";
        document.getElementById('edit-container-tags').innerHTML = "";

        // Para cada item que estava salvo na lista, cria um input preenchido
        if (plano.conteudos) plano.conteudos.forEach(c => adicionarInput('edit-container-conteudos', c));
        if (plano.recursosApoio) plano.recursosApoio.forEach(r => adicionarInput('edit-container-recursos', r));
        if (plano.tags) plano.tags.forEach(t => adicionarInput('edit-container-tags', t));

        // Se a lista estiver vazia por algum motivo, põe um campo em branco
        if (!plano.conteudos || plano.conteudos.length === 0) adicionarInput('edit-container-conteudos');
        if (!plano.recursosApoio || plano.recursosApoio.length === 0) adicionarInput('edit-container-recursos');
        if (!plano.tags || plano.tags.length === 0) adicionarInput('edit-container-tags');

        mostrarTelaEditar();
    }
}

// 8. Evento de Salvar o Cadastro
document.getElementById('form-plano').addEventListener('submit', function(event) {
    event.preventDefault(); 

    const novoPlano = {
        id: Date.now(),
        titulo: document.getElementById('titulo').value,
        disciplina: document.getElementById('disciplina').value,
        dataPrevista: document.getElementById('dataPrevista').value,
        objetivo: document.getElementById('objetivo').value,
        ementa: document.getElementById('ementa').value,
        
        // Captura os valores de todos os inputs que o usuário criou dinamicamente
        conteudos: capturarValoresDinamicos('container-conteudos'),
        recursosApoio: capturarValoresDinamicos('container-recursos'),
        tags: capturarValoresDinamicos('container-tags')
    };

    listaDePlanos.unshift(novoPlano); 
    desenharPlanosNaTela(); 
    this.reset(); 
    alert("Plano adicionado!");
    mostrarListagem();
});

// 9. Evento de Salvar a Edição
document.getElementById('form-editar-plano').addEventListener('submit', function(event) {
    event.preventDefault();

    const idParaEditar = Number(document.getElementById('edit-id').value);
    const plano = listaDePlanos.find(p => p.id === idParaEditar);

    if (plano) {
        plano.titulo = document.getElementById('edit-titulo').value;
        plano.disciplina = document.getElementById('edit-disciplina').value;
        plano.dataPrevista = document.getElementById('edit-dataPrevista').value;
        plano.objetivo = document.getElementById('edit-objetivo').value;
        plano.ementa = document.getElementById('edit-ementa').value;
        
        // Captura as alterações vindas dos contêineres dinâmicos de edição
        plano.conteudos = capturarValoresDinamicos('edit-container-conteudos');
        plano.recursosApoio = capturarValoresDinamicos('edit-container-recursos');
        plano.tags = capturarValoresDinamicos('edit-container-tags');

        desenharPlanosNaTela();
        alert("Plano atualizado com sucesso!");
        mostrarListagem();
    }
});

// Inicialização
carregarPlanosDoBancoMock();