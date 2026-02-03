## Descrição do Projeto

Este é um site funcional para a empresa fictícia EletroTech Engenharia Elétrica, desenvolvido utilizando apenas HTML5, CSS3 e JavaScript puro (vanilla). O site apresenta a empresa, lista serviços elétricos carregados dinamicamente, permite solicitações de serviço com persistência local e inclui um painel de gerenciamento de solicitações.

## Funcionalidades

- **Página Inicial**: Apresentação da empresa e navegação.
- **Sobre**: Texto institucional da EletroTech.
- **Serviços**: Lista dinâmica de serviços elétricos carregados via fetch() do arquivo services.json.
- **Solicitação de Serviço**: Formulário para envio de solicitações com campos obrigatórios (nome, tipo de serviço, descrição, urgência).
- **Painel de Solicitações**: Dashboard para visualizar e gerenciar solicitações pendentes, com opção de marcar como concluídas.
- **Persistência**: Dados salvos no localStorage, mantidos entre sessões.
- **Geolocalização**: Integração com Geolocation API para capturar localização aproximada do usuário nas solicitações.
- **Responsividade**: Design mobile-first, adaptável para desktop.
- **Acessibilidade**: Labels adequados, estados de foco visíveis, hierarquia de títulos.

## Tecnologias Utilizadas

- **HTML5**: Estrutura semântica com header, nav, main, sections e footer.
- **CSS3**: Layout responsivo com Flexbox, cores de alto contraste, efeitos hover e feedback visual.
- **JavaScript (Vanilla)**: Manipulação DOM, eventos, fetch API, promises, async/await, localStorage, Geolocation API.

## Instruções de Uso

1. Abra o arquivo `index.html` em qualquer navegador moderno.
2. Navegue pelas seções usando o menu de navegação.
3. Na seção "Serviços", visualize a lista carregada dinamicamente.
4. Na seção "Solicitar Serviço", preencha o formulário e envie (aceite a permissão de geolocalização se solicitada).
5. No "Painel de Solicitações", visualize as solicitações pendentes e marque como concluídas.
6. Os dados persistem mesmo após recarregar a página.

## Checklist de Requisitos

[✓] Estruturas básicas (condicionais, laços, funções)  
[✓] Objetos + Arrays com map/filter/reduce/find  
[✓] Arrow functions  
[✓] DOM dinâmico  
[✓] Fetch + loading + erro  
[✓] Promises e async/await  
[✓] Web Storage  
[✓] API HTML5 extra (Geolocation)  
[✓] Responsivo + acessibilidade  
[✓] Organização e boas práticas
=======
# EletroTech Engenharia Elétrica

## Descrição do Projeto

Este é um site funcional para a empresa fictícia EletroTech Engenharia Elétrica, desenvolvido utilizando HTML5, CSS3, JavaScript puro (vanilla) e Bootstrap 5. O site apresenta a empresa, lista serviços elétricos carregados dinamicamente, permite solicitações de serviço com persistência local e inclui um painel de gerenciamento de solicitações. O projeto utiliza navegação entre páginas e é totalmente client-side.

## Tecnologias Utilizadas

- **HTML5**: Estrutura semântica com navegação entre páginas.
- **CSS3**: Estilos customizados complementando Bootstrap.
- **Bootstrap 5**: Framework CSS para layout responsivo, componentes (navbar, cards, forms, alerts) e utilitários.
- **JavaScript (Vanilla)**: Manipulação DOM, eventos, fetch API, promises, async/await, localStorage, Geolocation API.

## Instruções para Execução

1. Execute o projeto usando um servidor local (ex: Live Server no VS Code).
2. Abra `index.html` no navegador.
3. Navegue entre as páginas usando o menu de navegação.
4. Teste as funcionalidades: visualizar serviços, enviar solicitações, gerenciar painel.

## Funcionalidades

- **Home (index.html)**: Apresentação da empresa.
- **Serviços (services.html)**: Lista dinâmica de serviços elétricos carregados via fetch() do arquivo services.json.
- **Solicitar Serviço (request.html)**: Formulário para envio de solicitações com validação, geolocalização e persistência.
- **Painel de Solicitações (dashboard.html)**: Dashboard para visualizar e gerenciar solicitações pendentes, com opção de marcar como concluídas.
- **Navegação**: Menu responsivo entre páginas.
- **Responsividade**: Design adaptável para mobile e desktop.
- **Persistência**: Dados salvos no localStorage.
- **Feedback Visual**: Alerts Bootstrap para mensagens de sucesso/erro.

## Checklist de Requisitos

[✓] Estruturas básicas (condicionais, laços, funções)  
[✓] Objetos + Arrays com map/filter/reduce/find  
[✓] Arrow functions  
[✓] DOM dinâmico  
[✓] Fetch + loading + erro  
[✓] Promises e async/await  
[✓] Web Storage  
[✓] API HTML5 extra (Geolocation)  
[✓] Responsivo + acessibilidade  
[✓] Organização e boas práticas
