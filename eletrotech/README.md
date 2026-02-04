# Projeto Integrador — Aplicação Web (Client-Side)

**Nome do projeto:** EletroTech Engenharia Elétrica

**Disciplina:** Introdução à Programação Web

**Tipo:** Aplicação Web Client-Side

## 📄 Resumo do Projeto

Esta aplicação web permite aos usuários visualizar serviços elétricos oferecidos pela empresa EletroTech, solicitar serviços personalizados e gerenciar solicitações pendentes através de um painel administrativo. A aplicação é totalmente client-side, utilizando tecnologias web padrão para uma experiência interativa e responsiva.

**Tema escolhido:** Plataforma de solicitação e gerenciamento de serviços elétricos.

**Objetivo principal do sistema:** Facilitar a interação entre clientes e a empresa EletroTech, permitindo solicitações de serviços elétricos com cálculo automático de preços, persistência de dados e geolocalização para localização do serviço.

## 🛠️ Tecnologias Utilizadas

- HTML5
- CSS3
- JavaScript (ES6+)
- APIs HTML5 utilizadas: Geolocation API (para capturar localização do usuário), Fetch API (para carregar dados de serviços), localStorage (para persistência de dados).

## ⚙️ Funcionalidades

- Visualização dinâmica de serviços elétricos carregados de um arquivo JSON.
- Formulário para solicitação de serviços com validação de campos obrigatórios.
- Cálculo automático de preços baseado no tipo de serviço, urgência e materiais necessários.
- Painel de gerenciamento de solicitações pendentes, com opção de marcar como concluídas.
- Persistência de dados utilizando localStorage para manter solicitações entre sessões.
- Integração com Geolocation API para capturar localização aproximada nas solicitações.
- Navegação responsiva entre páginas (Home, Serviços, Solicitar Serviço, Painel).

Destaca-se o uso de DOM dinâmico para renderização de listas e formulários, manipulação de eventos em formulários e persistência de dados para armazenamento local.

## 🔄 Assincronismo

A aplicação utiliza fetch para carregar dinamicamente a lista de serviços de um arquivo JSON local (services.json). Em caso de erro no carregamento, é implementado um fallback com dados estáticos para desenvolvimento local.

- **Loading:** Durante o carregamento dos serviços, a interface aguarda a resposta assíncrona antes de renderizar a lista.
- **Tratamento de erros:** Em caso de falha no fetch, um erro é logado no console e os dados de fallback são utilizados, garantindo continuidade da aplicação.
- **Uso de .then/.catch:** Embora o código principal utilize async/await, o tratamento de erros em promessas é implementado com .then/.catch em algumas funções auxiliares.
- **Uso de async/await com try/catch:** A função carregarServicosAsync utiliza async/await com try/catch para lidar com a requisição assíncrona e tratamento de erros, proporcionando um código mais legível e estruturado.

## 💾 Persistência de Dados

A aplicação utiliza localStorage para armazenar as solicitações de serviços. Os dados são salvos como JSON e carregados automaticamente ao iniciar a aplicação, permitindo que as solicitações persistam entre sessões do navegador. Não é utilizado sessionStorage, pois os dados devem ser mantidos mesmo após fechar o navegador.

## 🎨 UI/UX e Acessibilidade

- **Responsividade:** A aplicação adota uma abordagem mobile-first, utilizando CSS Flexbox e media queries para adaptar o layout a diferentes tamanhos de tela, garantindo usabilidade em dispositivos móveis e desktop.
- **Uso de HTML semântico:** Estrutura com elementos como `<header>`, `<nav>`, `<main>`, `<section>` e `<footer>`, melhorando a acessibilidade e SEO.
- **Feedbacks visuais:** Estados de hover em botões, validação visual de formulários com mensagens de erro/sucesso, e alerts para notificações.
- **Acessibilidade básica:** Labels associados a campos de formulário, estados de foco visíveis, hierarquia de títulos (h1, h2, etc.) e uso de atributos ARIA onde necessário para leitores de tela.

## 📂 Organização do Projeto

```
/
├── index.html          # Página inicial da aplicação
├── services.html       # Página de listagem de serviços
├── request.html        # Página de formulário para solicitação de serviço
├── dashboard.html      # Página de painel de gerenciamento de solicitações
├── styles.css          # Arquivo de estilos CSS personalizados
├── app.js              # Arquivo principal de JavaScript com lógica da aplicação
├── services.json       # Arquivo JSON com dados dos serviços oferecidos
└── assets/             # Diretório para imagens e recursos adicionais (se houver)
```

## ▶️ Como Executar o Projeto

1. Baixe ou clone o repositório do projeto.
2. Abra o arquivo `index.html` em um navegador web moderno (recomendado: Chrome, Firefox ou Edge).
3. Navegue pelas páginas utilizando o menu de navegação.
4. Para testar funcionalidades completas, permita o acesso à geolocalização quando solicitado no formulário de solicitação.
5. Não há dependências externas; a aplicação roda diretamente no navegador.

## 🌐 Deploy

**Link do deploy (GitHub Pages / Netlify / Vercel):** [Inserir link aqui após deploy]

**Link do repositório Git:** [Inserir link do repositório Git aqui]

## ✅ Checklist de Conformidade

[x] Estruturas básicas (condicionais, laços, funções).  
[x] Objetos + Arrays com map/filter/reduce (≥ 3 métodos).  
[x] Arrow functions (incluindo eventos).  
[x] DOM dinâmico (criação/remoção/atualização; formulários e eventos).  
[x] Requisição assíncrona com fetch + loading/erros.  
[x] Promises (.then/.catch) e async/await (try/catch).  
[x] Web Storage para persistência.  
[x] +1 API HTML5 opcional (Geolocation).  
[x] Responsivo + semântica + acessibilidade básica.  
[x] Organização de arquivos e README completo.

## 🧠 Decisões Técnicas

- **Estrutura modular:** O código JavaScript foi organizado em funções específicas para cada funcionalidade (carregamento de dados, renderização, cálculo de preços), facilitando manutenção e reutilização.
- **Uso de classes ES6:** A classe Servico foi definida para representar objetos de solicitação, encapsulando propriedades e comportamentos relacionados.
- **Fallback para desenvolvimento:** Implementação de dados estáticos em caso de falha no carregamento do JSON, permitindo desenvolvimento offline.
- **Integração com APIs HTML5:** Escolha da Geolocation API para enriquecer os dados de solicitação com localização, adicionando valor à aplicação sem dependências externas.
- **Persistência local:** Optou-se por localStorage devido à simplicidade e adequação para dados client-side, evitando necessidade de backend.

## ⚠️ Limitações Conhecidas

- A aplicação depende de permissões do navegador para geolocalização; em caso de negação, a localização é registrada como "Não disponível".
- Os dados são armazenados localmente no navegador, limitando o compartilhamento entre dispositivos ou usuários.
- Não há validação avançada de formulários (ex.: formatos de e-mail), focando em campos obrigatórios básicos.
- O design responsivo pode apresentar variações em navegadores muito antigos.

## 🤖 Uso de Inteligência Artificial

Neste projeto, foi utilizada a ferramenta de Inteligência Artificial ChatGPT como apoio na geração e organização do conteúdo do arquivo README.md, bem como em sugestões de estrutura para a documentação. O uso de IA foi parcial e teve como objetivo garantir clareza, padronização e conformidade com os critérios acadêmicos da disciplina. Todas as decisões finais, revisões e validações do conteúdo foram realizadas pelo autor do projeto.


