async function carregarPlanos() {
    try {
        const resposta = await fetch('./db.json');
        const dados = await resposta.json();

        exibirPlanos(dados.planos);
    } catch (erro) {
        console.error("Erro ao carregar o mock:", erro);
        document.getElementById('lista-planos').innerHTML = "<p>Erro ao carregar dados.</p>";
    }
}

function exibirPlanos(planos) {
    const container = document.getElementById('lista-planos');
    container.innerHTML = "";

    planos.forEach(plano => {
        const div = document.createElement('div');
        div.className = "plano-card";

        div.innerHTML = `
            <div style="border: 1px solid #ddd; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
                <h2>${plano.titulo}</h2>
                <p><strong>Disciplina:</strong> ${plano.disciplina} | <strong>Data:</strong> ${plano.dataPrevista}</p>
                
                <p><strong>Objetivo:</strong> ${plano.objetivo}</p>
                
                <h4>Conteúdos:</h4>
                <ul>
                    ${plano.conteudos.map(item => `<li>${item}</li>`).join('')}
                </ul>

                <h4>Recursos:</h4>
                <p>${plano.recursosApoio.join(', ')}</p>

                <div style="margin-top: 10px;">
                    ${plano.tags.map(tag => `<span style="background:#007bff; color:white; padding:3px 8px; border-radius:12px; font-size:12px; margin-right:5px;">${tag}</span>`).join('')}
                </div>
            </div>
        `;

        container.appendChild(div);
    });
}

carregarPlanos();