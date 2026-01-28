# 📊 Diagrama da Arquitetura Modular

## 1. Estrutura de Camadas

```
┌─────────────────────────────────────────┐
│   📱 INTERFACE DO USUÁRIO (HTML/CSS)    │
│  Modal | Formulários | Páginas | Menu  │
└──────────────────────┬──────────────────┘
                       │
┌──────────────────────▼──────────────────┐
│  ⚡ EVENT LAYER (events.js)            │
│  Listeners | Delegação | Binding       │
└──────────────────────┬──────────────────┘
                       │
┌──────────────────────▼──────────────────────────────────────────┐
│              🔧 BUSINESS LOGIC LAYER                            │
├───────────────────┬──────────────┬──────────────┬──────────────┤
│ 🔐 Auth Module    │ 💰 Orcamentos│ 📋 Projetos  │ 🎨 UI Module │
│ ├─ cadastrar      │ ├─ calcular  │ ├─ solicitar │ ├─ modal     │
│ ├─ login          │ ├─ exibir    │ ├─ carregar  │ ├─ page      │
│ ├─ logout         │ └─ limpar    │ ├─ abrir     │ └─ menu      │
│ └─ usuarios       │              │ └─ atualizar │              │
└───────────────────┴──────────────┴──────────────┴──────────────┘
                       │
┌──────────────────────▼──────────────────┐
│  📊 STATE LAYER (state.js + utils.js)  │
│  AppState | Utils | Storage             │
└──────────────────────┬──────────────────┘
                       │
┌──────────────────────▼──────────────────┐
│  💾 PERSISTENCE LAYER (localStorage)    │
│  usuarios | usuarioLogado | projetos    │
└─────────────────────────────────────────┘
```

## 2. Fluxo de Uma Ação (Exemplo: Login)

```
┌─────────────┐
│  Clica em   │
│  "Entrar"   │
└──────┬──────┘
       │
       ▼
┌──────────────────────────────┐
│ EventsModule.setupAuth()     │
│ Evento: "form-login submit"  │
└──────┬───────────────────────┘
       │
       ▼
┌──────────────────────────────────┐
│ AuthModule.login(email, tipo)    │
│ - Valida dados                   │
│ - Busca usuário                  │
│ - Retorna true/false             │
└──────┬───────────────────────────┘
       │
       ├─ FALSE ──► Notifications.erro()
       │
       └─ TRUE ──┐
                 ▼
         ┌────────────────────┐
         │ AppState.setUsuario│
         │ → localStorage     │
         └────────┬───────────┘
                  │
                  ▼
         ┌────────────────────┐
         │ UIModule.modal.close
         │ UIModule.menu.update
         └────────┬───────────┘
                  │
                  ▼
         ┌────────────────────┐
         │ UIModule.page.show │
         │ ("orcamentos")     │
         └────────┬───────────┘
                  │
                  ▼
    Notifications.sucesso()
    🎉 Login bem-sucedido!
```

## 3. Estrutura de Módulos (Dependency Graph)

```
                    ┌─────────────┐
                    │  index.html │
                    └──────┬──────┘
                           │
    ┌──────────────────────┼──────────────────────┐
    │                      │                      │
    ▼                      ▼                      ▼
┌────────────┐      ┌────────────┐      ┌──────────────────┐
│ state.js   │      │ utils.js   │      │ notifications.js │
└────────────┘      └────────────┘      └──────────────────┘
    │                   ▲                      ▲
    │                   │                      │
    └───┬───────────────┘                      │
        │                                      │
        ▼                                      │
    ┌────────────┐                             │
    │ auth.js    │◄────────────────────────────┘
    └────────────┘
        ▲
        │
    ┌───┼──────────────────────────────────┐
    │   │                                  │
    ▼   ▼                                  ▼
┌─────────────┐      ┌────────────┐   ┌────────────┐
│  ui.js      │      │orcamentos  │   │ projetos   │
│             │      │    .js     │   │    .js     │
└─────────────┘      └────────────┘   └────────────┘
    ▲                    ▲                  ▲
    │                    │                  │
    └────────┬───────────┴──────────────────┘
             │
             ▼
        ┌──────────┐
        │events.js │
        └──────────┘
             │
             ▼
        ┌──────────┐
        │ app-novo.js
        │(Orquestrador)
        └──────────┘
```

## 4. Comunicação entre Módulos

```
events.js (entry point)
    │
    ├─► AuthModule ──► AppState ──► UIModule ──► DOM
    │
    ├─► OrcamentosModule ──► AppState ──► Notifications
    │
    ├─► ProjetosModule ──► AppState ──► UIModule ──► Notifications
    │
    └─► UIModule ──► AppState

UTILITÁRIOS TRANSVERSAIS:
    Utils ◄──── usado por todos os módulos
    Notifications ◄──── consumido por todos os módulos
```

## 5. Estado da Aplicação

```
AppState
├── usuarioLogado
│   ├── email
│   ├── tipo ("cliente" | "engenheiro")
│   └── dataCadastro
├── paginaAtual ("home" | "orcamentos" | "projetos")
└── authMode ("login" | "cadastro")
```

## 6. localStorage Schema

```
localStorage = {
  usuarios: [
    {
      email: "cliente@exemplo.com",
      tipo: "cliente",
      dataCadastro: "01/01/2026"
    },
    ...
  ],
  
  usuarioLogado: {
    email: "cliente@exemplo.com",
    tipo: "cliente",
    dataCadastro: "01/01/2026"
  },
  
  projetos: [
    {
      id: 1234567890,
      cliente: "cliente@exemplo.com",
      progresso: 50,
      dataSolicitacao: "28/01/2026 10:30:45",
      tipo: "residencial",
      area: 120,
      tasks: [
        { nome: "Levantamento de carga", feito: true },
        { nome: "Diagrama unifilar", feito: false },
        { nome: "Memorial descritivo", feito: false }
      ]
    },
    ...
  ]
}
```

## 7. Ciclo de Vida da Aplicação

```
1. LOAD (index.html)
   ↓
2. IMPORT SCRIPTS (modules em ordem)
   ├── state.js
   ├── utils.js
   ├── notifications.js
   ├── auth.js
   ├── ui.js
   ├── orcamentos.js
   ├── projetos.js
   ├── events.js
   └── app-novo.js
   ↓
3. DOMContentLoaded EVENT
   ├── AuthModule.inicializar() → Carrega usuários de teste
   ├── UIModule.menu.update() → Atualiza visibilidade de botões
   ├── EventsModule.init() → Vincula todos os listeners
   └── UIModule.page.show("home") → Exibe página inicial
   ↓
4. USER INTERACTION
   ├── Click / Submit / Input
   ├── Event Listener dispara
   ├── Module processa
   ├── AppState atualiza
   ├── UIModule reflete mudança
   └── localStorage persiste
   ↓
5. READY
   🎉 Aplicação operacional
```

## 8. Responsabilidades por Camada

```
┌─────────────────────────────────────────────────┐
│ PRESENTATION (HTML/CSS)                         │
│ - Renderização                                  │
│ - Layout responsivo                             │
│ - Animações CSS                                 │
│ - Acessibilidade                                │
└─────────────────────────────────────────────────┘
           ↓
┌─────────────────────────────────────────────────┐
│ APPLICATION (events.js)                         │
│ - Orquestração de eventos                       │
│ - Fluxo de user actions                         │
│ - Sincronização entre módulos                   │
└─────────────────────────────────────────────────┘
           ↓
┌─────────────────────────────────────────────────┐
│ BUSINESS LOGIC (auth/orcamentos/projetos/ui)   │
│ - Validações                                    │
│ - Regras de negócio                             │
│ - Cálculos                                      │
│ - Transformações de dados                       │
└─────────────────────────────────────────────────┘
           ↓
┌─────────────────────────────────────────────────┐
│ STATE & UTILITIES (state/utils)                 │
│ - Gerenciamento de estado                       │
│ - Funções auxiliares                            │
│ - Cache local                                   │
└─────────────────────────────────────────────────┘
           ↓
┌─────────────────────────────────────────────────┐
│ PERSISTENCE (localStorage)                      │
│ - Armazenamento de dados                        │
│ - Sessão do usuário                             │
│ - Cache de dados                                │
└─────────────────────────────────────────────────┘
```

## 9. Exemplo: Fluxo Completo de Solicitar Projeto

```
User: "Quero solicitar um projeto"
   │
   ▼
[Click] "Solicitar projeto"
   │
   ▼
EventsModule (setupOrcamentos)
   │
   ├─ Pega tipo_obra: "residencial"
   ├─ Pega area: 100
   │
   ▼
ProjetosModule.solicitar(tipo, area)
   │
   ├─ Verifica AppState.getUsuario() ✓
   ├─ Verifica tipo === "cliente" ✓
   ├─ Cria objeto projeto
   │
   ▼
storage.add(projeto)
   │
   └─► Utils.setStorage("projetos", [...])
   │
   ▼
AppState está atualizado
   │
   ▼
Notifications.sucesso("Projeto solicitado!")
   │
   ▼
OrcamentosModule.limpar()
   │
   ▼
User vê notificação e pode acessar em "Projetos" ✓
```

## 10. Escalabilidade: Adicionar Nova Funcionalidade

```
Novo Requisito: "Adicionar Dashboard"

1. Criar modules/dashboard.js
   ├── DashboardModule = (() => { ... })()
   └── Implementar lógica

2. Importar em index.html
   └── <script src="modules/dashboard.js"></script>

3. Adicionar seção em index.html
   └── <section id="dashboard" class="page">

4. Registrar evento em modules/events.js
   └── setupDashboard()
   └── EventsModule.init() chama setupDashboard()

5. Adicionar link no menu
   └── <a href="#" data-page="dashboard">Dashboard</a>

6. Usar outros módulos conforme necessário
   └── UIModule.page.show("dashboard")
   └── AppState.get("usuarioLogado")
   └── Notifications.info("...")

✅ Pronto! Funcionalidade integrada sem quebrar código existente
```

---

## 📚 Resumo

- **8 Módulos**: Cada um com responsabilidade única
- **IIFE Pattern**: Encapsulamento e privacidade
- **Baixo Acoplamento**: Módulos comunicam via AppState e Utils
- **Alta Coesão**: Cada módulo faz bem uma coisa
- **Escalável**: Adicionar novas funcionalidades é seguro
- **Testável**: Cada módulo pode ser testado isoladamente
- **Maintível**: Código organizado e bem documentado

Essa arquitetura oferece uma base sólida para crescimento do projeto! 🚀
