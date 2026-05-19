# Sistema de Gerenciamento de Planos de Aula - APP Frontend

```markdown
# Sistema de Gerenciamento de Planos de Aula - Frontend Application

Esta é a interface do usuário estruturada como uma SPA (Single Page Application) responsiva e otimizada. A aplicação consome os serviços da API RESTful local para renderizar, interagir e filtrar os planos de aula dinamicamente.

## 🚀 Tecnologias Utilizadas

- **HTML5**: Estruturação semântica e esqueleto das views do projeto.
- **JavaScript (Vanilla)**: Lógica interna do cliente, controle de estado da aplicação, manipulação do DOM e integração HTTP Assíncrona.

## 📋 Funcionalidades de Interface

- **Operação SPA Nativa:** Alternância dinâmica de telas de listagem, inserção e alteração através de controle de visibilidade via estilos (`display: block/none`), eliminando a necessidade de carregamento de páginas externas.
- **Mecanismo de Filtros Cumulativos:** Processamento em memória no navegador que reduz a latência ao pesquisar planos por Título (case-insensitive), Disciplina, Tags internas ou Data selecionada via calendário.
- **Ordenação Dinâmica de Estado:** Reordenação imediata dos cards na tela em ordem alfabética (A-Z e Z-A) ou cronológica pelo ID (Mais novos ou Mais antigos).
- **Paginação Local Baseada em Filtros:** Fatiamento automatizado da visualização limitando a exibição por quantidade pré-definida de itens e ajustando os botões de controle de acordo com os filtros aplicados.
- **Formulários Dinâmicos Adaptáveis:** Suporte a inserção e exclusão dinâmica de inputs em tempo de execução para os campos de listas estruturadas (Conteúdos, Recursos e Tags).

## 🔧 Execução Local

### Pré-requisitos
- Navegador moderno (Chrome, Edge, Firefox, Safari).

### Passos para Execução
1. Clone este repositório e acesse a pasta raiz:
   cd lesson-plan-manager-app
Abra o arquivo script.js e verifique se a URL de integração corresponde ao seu ambiente backend ativo:

JavaScript
const API_URL = 'http://localhost:3000/planos';
Abra o arquivo index.html diretamente em seu navegador ou inicie a ferramenta através de uma extensão de servidor estático local (como a extensão Live Server do VS Code).