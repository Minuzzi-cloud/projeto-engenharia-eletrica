# Arquitetura Modular - Engenharia Elétrica

## 📋 Estrutura de Módulos

```
projeto-engenharia-eletrica/
├── index.html
├── styles.css
├── app-novo.js (Orquestrador principal)
├── modules/
│   ├── state.js              # Gerenciamento de estado global
│   ├── utils.js              # Utilidades genéricas
│   ├── notifications.js      # Sistema de notificações
│   ├── auth.js               # Autenticação e cadastro
│   ├── ui.js                 # Controle de interface
│   ├── orcamentos.js         # Lógica de orçamentos
│   ├── projetos.js           # Gerenciamento de projetos
│   └── events.js             # Binding de eventos
└── data/
    ├── planos.json
    └── projetos.json
```

## 🔧 Descrição dos Módulos

### 1. **state.js** - AppState
Padrão: **Module Pattern (IIFE)**

Responsabilidade: Manter e gerenciar estado global da aplicação.

**Métodos principais:**
- `set(key, value)` - Define valor no estado
- `get(key)` - Obtém valor do estado
- `setUsuario(usuario)` - Define usuário logado
- `getUsuario()` - Retorna usuário logado
- `clearUsuario()` - Limpa usuário da sessão
- `setPage(pagina)` - Define página atual
- `setAuthMode(mode)` - Define modo de autenticação (login/cadastro)

**Características:**
- Encapsulamento completo
- Validação de chaves
- Persistência em localStorage
- Getters e setters específicos

---

### 2. **utils.js** - Utils
Padrão: **Module Pattern (IIFE)**

Responsabilidade: Fornecer funções auxiliares genéricas reutilizáveis.

**Categorias de funções:**

#### DOM
- `$(id)` - Atalho para getElementById
- `on(selector, event, callback)` - Adiciona evento a elemento
- `onAll(selector, event, callback)` - Adiciona evento a múltiplos elementos
- `onDelegate(selector, event, callback)` - Event delegation
- `addClass/removeClass/toggleClass/hasClass` - Manipulação de classes

#### String
- `isValidEmail(email)` - Valida formato de email

#### Storage
- `setStorage/getStorage/removeStorage` - Gerencia localStorage

#### Async
- `delay(ms)` - Promise-based delay

**Características:**
- Funções puras ou sem efeitos colaterais
- Reutilizável em qualquer contexto
- Seguras com operadores opcionais (?.)

---

### 3. **notifications.js** - Notifications
Padrão: **Module Pattern (IIFE)**

Responsabilidade: Sistema de notificações toast animadas.

**Métodos principais:**
- `show(mensagem, tipo, duracao)` - Mostra notificação genérica
- `sucesso(msg)` - Notificação de sucesso
- `erro(msg)` - Notificação de erro
- `info(msg)` - Notificação informativa

**Características:**
- Injeção automática de CSS
- Animações suaves
- Auto-destruição
- Posicionamento fixo

---

### 4. **auth.js** - AuthModule
Padrão: **Module Pattern com submódulo (IIFE)**

Responsabilidade: Gerenciar autenticação, cadastro e usuários.

**Submódulo: usuarios**
- `getAll()` - Retorna todos os usuários
- `add(email, tipo)` - Adiciona novo usuário
- `existe(email)` - Verifica se email existe
- `buscar(email, tipo)` - Busca usuário específico

**Métodos públicos:**
- `inicializar()` - Carrega usuários de teste
- `cadastrar(email, tipo)` - Registra novo usuário com validações
- `login(email, tipo)` - Autentica usuário com validações
- `logout()` - Faz logout do usuário

**Características:**
- Validação completa de dados
- Persistência em localStorage
- Usuários de teste automáticos
- Integração com Notifications

---

### 5. **ui.js** - UIModule
Padrão: **Module Pattern com submódulos (IIFE)**

Responsabilidade: Gerenciar todos os aspetos visuais e de interface.

**Submódulo: modal**
- `open()` - Abre modal de autenticação
- `close()` - Fecha modal
- `switchMode(mode)` - Alterna entre login/cadastro

**Submódulo: page**
- `show(pageName)` - Exibe página e atualiza estado
- `current()` - Retorna página atual

**Submódulo: menu**
- `update()` - Atualiza visibilidade de botões conforme login

**Características:**
- Centraliza todas as operações visuais
- Coordena com AppState
- Manipulação de classes CSS consistente

---

### 6. **orcamentos.js** - OrcamentosModule
Padrão: **Module Pattern (IIFE)**

Responsabilidade: Lógica de cálculo e gerenciamento de orçamentos.

**Métodos principais:**
- `calcular(tipo, area)` - Calcula orçamento com validações
- `exibir(resultado)` - Exibe resultado na interface
- `limpar()` - Limpa formulário e resultado

**Características:**
- Tabela de valores configuráveis
- Validações robustas
- Integração com interface

---

### 7. **projetos.js** - ProjetosModule
Padrão: **Module Pattern com submódulo (IIFE)**

Responsabilidade: Gerenciar projetos, tarefas e progresso.

**Submódulo: storage**
- `getAll()` - Retorna todos os projetos
- `save(projetos)` - Salva projetos em localStorage
- `add(projeto)` - Adiciona novo projeto
- `update(projeto)` - Atualiza projeto existente
- `getByCliente(email)` - Busca projetos por cliente

**Métodos públicos:**
- `solicitar(tipo, area)` - Solicita novo projeto
- `carregar()` - Carrega e exibe projetos
- `abrirProjeto(projeto)` - Abre detalhes do projeto
- `atualizarProgresso(projeto)` - Atualiza progresso

**Características:**
- Gerenciar tarefas (checkboxes)
- Calcular progresso automaticamente
- Diferentes visualizações por tipo de usuário
- Persistência em localStorage

---

### 8. **events.js** - EventsModule
Padrão: **Module Pattern com submódulos privados (IIFE)**

Responsabilidade: Vincular e gerenciar todos os eventos do DOM.

**Submódulos privados:**
- `setupNavigation()` - Eventos de navegação
- `setupAuth()` - Eventos de autenticação
- `setupOrcamentos()` - Eventos de formulários
- `setupProjetos()` - Eventos de projetos

**Método público:**
- `init()` - Inicializa todos os eventos

**Características:**
- Centraliza binding de eventos
- Chamado uma única vez na inicialização
- Orquestra interações entre módulos
- Evita duplicação de listeners

---

## 🔄 Fluxo de Inicialização

```javascript
// 1. DOM carregado
DOMContentLoaded → 

// 2. Carrega usuário salvo
AuthModule.inicializar() →

// 3. Atualiza menu
UIModule.menu.update() →

// 4. Vincula eventos
EventsModule.init() →

// 5. Mostra página inicial
UIModule.page.show("home") →

// ✅ Aplicação pronta
```

## 📊 Comunicação entre Módulos

```
EventsModule
    ↓ dispara eventos
AppState ← → UIModule → Notifications
    ↓           ↓
AuthModule  (visual)
 ↓   ↓
Utils, Storage
```

## 🎯 Padrões Utilizados

### 1. **IIFE (Immediately Invoked Function Expression)**
- Cria escopo privado
- Evita poluição do escopo global
- Padrão clássico: `const Module = (() => { ... })()`

### 2. **Module Pattern**
- Encapsulamento
- Expose apenas métodos públicos
- Retorno de objeto com métodos públicos

### 3. **Separation of Concerns**
- Cada módulo tem responsabilidade única
- Baixo acoplamento
- Alta coesão

### 4. **Composition over Inheritance**
- Módulos se compõem
- Sem herança de classes
- Mais flexibilidade

## 🧪 Testabilidade

Cada módulo pode ser testado isoladamente:

```javascript
// Teste do Utils
console.log(Utils.isValidEmail("teste@email.com")); // true

// Teste do AppState
AppState.set("test", "value");
console.log(AppState.get("test")); // "value"

// Teste do Auth
AuthModule.cadastrar("novo@email.com", "cliente"); // com validações
```

## 📈 Escalabilidade

### Adicionando novo módulo:

```javascript
// 1. Criar modules/novo-modulo.js
const NovoModule = (() => {
  return {
    metodo1: () => {},
    metodo2: () => {}
  };
})();

// 2. Importar em index.html
<script src="modules/novo-modulo.js"></script>

// 3. Usar em outros módulos
NovoModule.metodo1();
```

## 🔧 Manutenção

- **Adicionar funcionalidade**: Expanda o módulo relevante
- **Corrigir bug**: Procure no módulo responsável
- **Refatorar**: Cada módulo pode ser refatorado independentemente
- **Testar**: Execute isoladamente cada submódulo

## 📝 Convenções

- **Padrão**: IIFE com Module Pattern
- **Nomes**: PascalCase para módulos, camelCase para métodos
- **Privado**: Funções dentro do IIFE, não retornadas
- **Público**: Retornado no objeto final
- **Storage**: Sempre via `Utils.getStorage/setStorage`
- **DOM**: Sempre via `Utils.$` ou `document` para querySelectorAll

## ✅ Benefícios

✨ **Organização**: Código estruturado e previsível
🔒 **Segurança**: Encapsulamento de dados
🔄 **Reutilização**: Módulos independentes
🧪 **Testabilidade**: Componentes isolados
📚 **Documentação**: Responsabilidades claras
🛠️ **Manutenção**: Fácil localizar e corrigir
🚀 **Escalabilidade**: Adicionar funcionalidades sem quebrar código existente
