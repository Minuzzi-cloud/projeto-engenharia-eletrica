# 🏗️ Projeto Engenharia Elétrica - Versão Modularizada

## 📱 Sobre o Projeto

Sistema web para gerenciamento de orçamentos e projetos de engenharia elétrica com autenticação de usuários, cálculo de orçamentos e gerenciamento de tarefas.

## ✨ Recursos

- ✅ Autenticação de usuários (Cliente/Engenheiro)
- ✅ Cadastro de novos usuários
- ✅ Cálculo de orçamentos (Residencial/Comercial)
- ✅ Gerenciamento de projetos
- ✅ Rastreamento de progresso
- ✅ Sistema de notificações
- ✅ Interface responsiva
- ✅ Design moderno com CSS avançado
- ✅ Arquitetura modular e escalável

## 🏗️ Arquitetura

O projeto utiliza **Module Pattern com IIFE** para organização modular:

```
modules/
├── state.js              # 📊 Gerenciamento de estado
├── utils.js              # 🔧 Utilidades genéricas
├── notifications.js      # 🔔 Sistema de notificações
├── auth.js               # 🔐 Autenticação e cadastro
├── ui.js                 # 🎨 Interface
├── orcamentos.js         # 💰 Orçamentos
├── projetos.js           # 📋 Projetos
└── events.js             # ⚡ Eventos e binding
```

**Ver `ARQUITETURA.md` para documentação detalhada.**

## 🚀 Como Começar

### 1. Abrir o Projeto

```bash
# Abrir em servidor local (recomendado)
python -m http.server 8000
# ou
npx http-server
```

Acesse: `http://localhost:8000`

### 2. Usuários de Teste

O sistema cria automaticamente dois usuários de teste:

**Cliente:**
- E-mail: `cliente@exemplo.com`
- Tipo: Cliente

**Engenheiro:**
- E-mail: `engenheiro@exemplo.com`
- Tipo: Engenheiro

### 3. Fluxo de Uso

#### Como Cliente:
1. Faça login com `cliente@exemplo.com`
2. Vá para "Orçamentos"
3. Selecione tipo de obra (Residencial/Comercial) e área
4. Clique em "Calcular" para ver o valor
5. Clique em "Solicitar projeto"
6. Acesse "Projetos" para ver seus projetos

#### Como Engenheiro:
1. Faça login com `engenheiro@exemplo.com`
2. Acesse "Projetos" para ver TODOS os projetos
3. Clique em um projeto para abrir detalhes
4. Marque tarefas como concluídas
5. Veja o progresso atualizar automaticamente

## 📚 Estrutura de Arquivos

```
projeto-engenharia-eletrica/
├── index.html              # HTML principal
├── styles.css              # Estilos CSS avançado
├── app-novo.js             # Orquestrador (entry point)
├── modules/
│   ├── state.js
│   ├── utils.js
│   ├── notifications.js
│   ├── auth.js
│   ├── ui.js
│   ├── orcamentos.js
│   ├── projetos.js
│   └── events.js
├── data/
│   ├── planos.json
│   └── projetos.json
├── ARQUITETURA.md          # Documentação técnica
└── README.md               # Este arquivo
```

## 🔐 Autenticação

### Sistema de Armazenamento

Tudo é armazenado em **localStorage**:

```javascript
localStorage.usuarios         // Lista de usuários cadastrados
localStorage.usuarioLogado    // Usuário autenticado
localStorage.projetos         // Projetos cadastrados
```

### Segurança

⚠️ **Nota**: Este é um projeto acadêmico. Em produção:
- Use autenticação segura (JWT, OAuth2)
- Hash de senhas
- HTTPS
- Validação no servidor

## 💻 Desenvolvimento

### Adicionar Novo Módulo

1. Criar arquivo em `modules/novo.js`:

```javascript
const NovoModule = (() => {
  // Código privado aqui
  
  return {
    // API pública
    metodo: () => {}
  };
})();
```

2. Importar em `index.html`:
```html
<script src="modules/novo.js"></script>
```

3. Usar em outro módulo:
```javascript
NovoModule.metodo();
```

### Adicionar Nova Página

1. Adicionar HTML em `index.html`:
```html
<section id="nova-pagina" class="page">
  <!-- Conteúdo -->
</section>
```

2. Adicionar link no menu:
```html
<li><a href="#" data-page="nova-pagina">Nova Página</a></li>
```

3. Adicionar evento em `modules/events.js`:
```javascript
const setupNovaFuncao = () => {
  // Vincular eventos da página
};
```

4. Chamar em `EventsModule.init()`:
```javascript
setupNovaFuncao();
```

## 🎨 Design e CSS

### Variáveis CSS Principais

```css
--primary: #1e3a8a         /* Azul principal */
--primary-light: #3b82f6   /* Azul claro */
--primary-dark: #1e40af    /* Azul escuro */
--bg: #f0f4f8              /* Fundo */
--text: #1f2937            /* Texto principal */
--text-light: #6b7280      /* Texto secundário */
--success: #10b981         /* Verde (sucesso) */
--danger: #ef4444          /* Vermelho (erro) */
```

### Componentes Principais

- **Header**: Gradiente azul com navegação
- **Modal Auth**: Switch elegante entre login/cadastro
- **Buttons**: Com ripple effect ao hover
- **Cards**: Com efeito de elevação
- **Forms**: Com validação visual

## 🧪 Testando

### Testar Módulos Isoladamente

No console do navegador:

```javascript
// Teste AppState
AppState.set("teste", 123);
AppState.get("teste"); // 123

// Teste Utils
Utils.isValidEmail("teste@email.com"); // true

// Teste Auth
AuthModule.usuarios(); // Lista de usuários

// Teste Notificações
Notifications.sucesso("Teste!");
```

### Verificar Estado

```javascript
// Estado atual
AppState.getAll();

// Usuário logado
AppState.getUsuario();

// Página atual
AppState.getPage();
```

## 📱 Responsividade

O projeto é totalmente responsivo:

- **Desktop**: Layout completo (1200px+)
- **Tablet**: Layout adaptado (768px - 1199px)
- **Mobile**: Layout mobile (até 767px)

Breakpoints em `styles.css`:
```css
@media (max-width: 768px) { /* Tablet */ }
@media (max-width: 480px) { /* Mobile */ }
```

## 🐛 Debug

### Ativar logs de inicialização

Já ativado no `app-novo.js`. Verifique o console para ver:

```
🚀 Iniciando aplicação...
✅ Autenticação inicializada
✅ Menu atualizado
✅ Eventos vinculados
✅ Página inicial carregada
🎉 Aplicação pronta!
```

### Inspecionar Storage

No DevTools (F12):
```
Application → Local Storage → http://localhost:8000
```

## 📋 Funcionalidades por Tipo de Usuário

### Cliente
- ✅ Calcular orçamentos
- ✅ Solicitar projetos
- ✅ Ver seus próprios projetos
- ✅ Acompanhar progresso
- ❌ Editar tarefas de projeto

### Engenheiro
- ✅ Ver TODOS os projetos
- ✅ Marcar tarefas como concluídas
- ✅ Acompanhar progresso de todos
- ❌ Solicitar projetos
- ❌ Ver orçamentos

## 🔄 Fluxo de Dados

```
User Action (click)
      ↓
Event Listener (events.js)
      ↓
Module (auth/projetos/etc)
      ↓
AppState (atualiza estado)
      ↓
UIModule (atualiza visual)
      ↓
localStorage (persiste dados)
      ↓
Notifications (feedback)
```

## 🚀 Melhorias Futuras

- [ ] Backend com Node.js
- [ ] Autenticação real (JWT)
- [ ] Banco de dados
- [ ] Upload de arquivos
- [ ] Sistema de permissões
- [ ] Histórico de mudanças
- [ ] Integração com email
- [ ] Dark mode
- [ ] Multilíngue
- [ ] PWA (Progressive Web App)

## 📄 Licença

Projeto Acadêmico - Sem licença específica

## 👨‍💻 Autor

Desenvolvido como projeto acadêmico de Engenharia Elétrica

## 📞 Suporte

Para dúvidas ou issues, verifique:
1. O console do navegador (F12)
2. O arquivo `ARQUITETURA.md`
3. Os comentários no código dos módulos

---

**Versão**: 2.0 (Modularizada)  
**Última atualização**: 28 de janeiro de 2026
