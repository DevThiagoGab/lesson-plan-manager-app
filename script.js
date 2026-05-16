let listaDePlanos = [];

async function carregarPlanosDoBancoMock() {
    try {
        const resposta = await fetch('./db.json');
        const dados = await resposta.json();
        listaDePlanos = dados.planos;
        desenharPlanosNaTela();
    } catch (erro) {
        console.error("Erro ao carregar o mock:", erro);
        document.getElementById('lista-planos').innerHTML = "Erro ao carregar os dados.";
    }
}

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
            ? plano.tags.map(tag => `<span style="background:#007bff; color:white; padding:3px 8px; border-radius:12px; font-size:12px; margin-right:5px;">${tag}</span>`).join('')
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

                <div style="margin-top: 10px;">${listaTags}</div>
            </div>
        `;
    });
}

function mostrarListagem() {
    document.getElementById('tela-listagem').style.display = 'block';
    document.getElementById('tela-formulario').style.display = 'none';
}

function mostrarFormulario() {
    document.getElementById('tela-listagem').style.display = 'none';
    document.getElementById('tela-formulario').style.display = 'block';
}

document.getElementById('form-plano').addEventListener('submit', function(event) {
    event.preventDefault();

    const novoPlano = {
        id: listaDePlanos.length + 1,
        titulo: document.getElementById('titulo').value,
        disciplina: document.getElementById('disciplina').value,
        dataPrevista: document.getElementById('dataPrevista').value,
        objetivo: document.getElementById('objetivo').value,
        ementa: document.getElementById('ementa').value,
        
        conteudos: document.getElementById('conteudos').value ? document.getElementById('conteudos').value.split(',').map(c => c.trim()) : [],
        recursosApoio: document.getElementById('recursos').value ? document.getElementById('recursos').value.split(',').map(r => r.trim()) : [],
        tags: document.getElementById('tags').value ? document.getElementById('tags').value.split(',').map(t => t.trim()) : []
    };

    listaDePlanos.unshift(novoPlano);
    desenharPlanosNaTela();
    this.reset();
    
    alert("Plano completo adicionado!");
    mostrarListagem();
});

carregarPlanosDoBancoMock();