# 🛠️ Guia de Manutenção - Arquitetura Modular

## 📋 Índice

1. [Localizando Bugs](#localizando-bugs)
2. [Adicionando Funcionalidades](#adicionando-funcionalidades)
3. [Refatoração Segura](#refatoração-segura)
4. [Testing](#testing)
5. [Performance](#performance)
6. [Troubleshooting](#troubleshooting)

---

## 🐛 Localizando Bugs

### Guia de Decisão

```
O que não funciona?
│
├─ Interface (visual/layout)
│  └─► Verificar styles.css e index.html
│
├─ Comportamento do botão
│  └─► Verificar events.js (EventsModule.setupAuth/setupOrcamentos/etc)
│
├─ Validação de dados
│  └─► Verificar modules respectivos (auth.js, orcamentos.js, etc)
│
├─ Dados não aparecem
│  └─► Verificar AppState e localStorage
│
├─ Erros no console
│  └─► Verificar sintaxe dos módulos
│
└─ Performance lenta
   └─► Verificar carregamento de módulos
```

### Checklist de Debug

- [ ] Abrir DevTools (F12)
- [ ] Verificar console para erros
- [ ] Verificar Network (se houver requests)
- [ ] Verificar Application > LocalStorage
- [ ] Testar em modo incógnito
- [ ] Limpar cache e recarregar
- [ ] Verificar o submódulo correto

### Exemplo: "Login não funciona"

```javascript
// 1. Verificar se módulo é carregado
typeof AuthModule // "object" ✓ ou undefined ✗

// 2. Testar autenticação diretamente
AuthModule.login("cliente@exemplo.com", "cliente");

// 3. Verificar state
AppState.getUsuario();

// 4. Verificar localStorage
localStorage.usuarioLogado

// 5. Verificar UI
UIModule.menu.update();

// 6. Se nada funcionar, recarregar página
location.reload();
```

---

## ✨ Adicionando Funcionalidades

### 1️⃣ Scenario: "Adicionar opção de resetar senha"

**Passo 1: Estender Auth Module**

```javascript
// modules/auth.js - Adicionar novo método no return

resetarSenha: (email) => {
  const usuario = usuarios.getAll().find(u => u.email === email);
  
  if (!usuario) {
    Notifications.erro("E-mail não encontrado");
    return false;
  }
  
  // Simulação: enviar email
  Notifications.sucesso("E-mail de reset enviado para " + email);
  return true;
}
```

**Passo 2: Adicionar botão em index.html**

```html
<form id="form-login">
  <!-- ... campos existentes ... -->
  <button type="submit">Entrar</button>
</form>

<!-- Adicionar após formulário -->
<p style="text-align: center; margin-top: 1rem;">
  <button id="btn-resetar-senha" style="background: none; border: none; color: var(--text-light); cursor: pointer; text-decoration: underline;">
    Esqueceu a senha?
  </button>
</p>
```

**Passo 3: Adicionar evento em events.js**

```javascript
// Dentro de setupAuth()
Utils.$("btn-resetar-senha").addEventListener("click", (e) => {
  e.preventDefault();
  const email = Utils.$("email").value;
  
  if (!email) {
    Notifications.erro("Preencha o e-mail primeiro");
    return;
  }
  
  AuthModule.resetarSenha(email);
});
```

**Passo 4: Testar**

```javascript
// Console do navegador
AuthModule.resetarSenha("cliente@exemplo.com");
// ✅ "E-mail de reset enviado para cliente@exemplo.com"
```

---

### 2️⃣ Scenario: "Adicionar filtro de projetos por status"

**Passo 1: Estender Projetos Module**

```javascript
// modules/projetos.js - Adicionar dentro de storage

filtrar: (filtro) => {
  const todos = storage.getAll();
  
  switch(filtro) {
    case "em-progresso":
      return todos.filter(p => p.progresso > 0 && p.progresso < 100);
    case "concluido":
      return todos.filter(p => p.progresso === 100);
    case "nao-iniciado":
      return todos.filter(p => p.progresso === 0);
    default:
      return todos;
  }
}
```

**Passo 2: Atualizar função carregar**

```javascript
// Modificar carregar() para aceitar filtro

const carregar = (filtro = "todos") => {
  const usuario = AppState.getUsuario();
  const lista = Utils.$("lista-projetos-cliente");
  
  if (!lista) return;
  lista.innerHTML = "";
  
  if (!usuario) {
    lista.innerHTML = '<li>Faça login...</li>';
    return;
  }
  
  // NOVO: Aplicar filtro
  let projetos = storage.getAll();
  if (usuario.tipo !== "engenheiro") {
    projetos = projetos.filter(p => p.cliente === usuario.email);
  }
  
  // Filtrar por status
  if (filtro !== "todos") {
    projetos = storage.filtrar(filtro).filter(
      p => usuario.tipo === "engenheiro" || p.cliente === usuario.email
    );
  }
  
  // ... resto do código
}
```

**Passo 3: Adicionar botões de filtro em index.html**

```html
<div style="margin-bottom: 1rem; display: flex; gap: 0.5rem;">
  <button data-filter="todos" class="filter-btn active">Todos</button>
  <button data-filter="nao-iniciado" class="filter-btn">Não Iniciado</button>
  <button data-filter="em-progresso" class="filter-btn">Em Progresso</button>
  <button data-filter="concluido" class="filter-btn">Concluído</button>
</div>
```

**Passo 4: Adicionar evento**

```javascript
// Em setupProjetos() do events.js

document.querySelectorAll(".filter-btn").forEach(btn => {
  btn.addEventListener("click", (e) => {
    const filtro = e.target.dataset.filter;
    
    // Atualizar UI
    document.querySelectorAll(".filter-btn").forEach(b => 
      Utils.removeClass(b, "active")
    );
    Utils.addClass(e.target, "active");
    
    // Carregar com filtro
    ProjetosModule.carregar(filtro);
  });
});
```

---

## 🔄 Refatoração Segura

### Princípio: "Não quebrar nada existente"

#### ❌ ERRADO: Modificar assinatura de função

```javascript
// ANTES
login: (email, tipo) => { ... }

// DEPOIS - ❌ QUEBRA código existente
login: (email, tipo, senha) => { ... }
// Quem chamava sem senha vai falhar
```

#### ✅ CORRETO: Adicionar parâmetro opcional

```javascript
// DEPOIS - ✅ Compatível
login: (email, tipo, opcoes = {}) => {
  const { senha, lembrar } = opcoes;
  // ... código
}

// Chamadas antigas funcionam
AuthModule.login("email@test.com", "cliente");

// Novas funcionalidades
AuthModule.login("email@test.com", "cliente", { lembrar: true });
```

#### ❌ ERRADO: Remover método público

```javascript
// ANTES
return {
  login: () => {},
  logout: () => {},
  cadastrar: () => {}
}

// DEPOIS - ❌ Se alguém usava cadastrar
return {
  login: () => {},
  logout: () => {}
}
```

#### ✅ CORRETO: Marcar como deprecated

```javascript
return {
  login: () => {},
  logout: () => {},
  cadastrar: () => {
    console.warn("[Deprecated] Use AuthModule.register() em vez de cadastrar()");
    return AuthModule.register();
  },
  register: () => {
    // Nova versão
  }
}
```

### Refatoração Segura: Exemplo Prático

**Objetivo**: Renomear `login` para `authenticate` no AuthModule

**Passo 1: Adicionar novo método**

```javascript
// modules/auth.js

const authenticate = (email, tipo) => {
  // Implementação do login
  // ... código existente ...
};

// Adicionar ao return
authenticate,
login: authenticate // Keep backward compatibility
```

**Passo 2: Atualizar código interno**

```javascript
// Usar 'authenticate' internamente em novo código
// Manter 'login' para compatibilidade
```

**Passo 3: Avisar deprecação**

```javascript
login: (email, tipo) => {
  console.warn("[Deprecated] AuthModule.login() será removido. Use authenticate()");
  return authenticate(email, tipo);
}
```

**Passo 4: Atualizar documentação**

```markdown
# Changelog

## v2.1
- ✨ Nova função: `AuthModule.authenticate()`
- 🚨 Deprecado: `AuthModule.login()` (usar authenticate())
```

**Passo 5: Eventualmente remover (versão 3.0)**

```javascript
// Após avisar por 2+ versões
// Remover:
login: authenticate
```

---

## 🧪 Testing

### Teste Manual: Checklist

```javascript
// 1. Autenticação
□ Cadastrar novo usuário
□ Login com credenciais válidas
□ Login com credenciais inválidas
□ Logout funciona

// 2. Orçamentos
□ Calcular orçamento residencial
□ Calcular orçamento comercial
□ Validação de área mínima
□ Solicitar projeto após orçamento

// 3. Projetos
□ Cliente vê apenas seus projetos
□ Engenheiro vê todos os projetos
□ Marcar tarefa como concluída
□ Progresso atualiza corretamente

// 4. UI
□ Modal abre e fecha
□ Switch entre login/cadastro funciona
□ Notificações aparecem
□ Menu atualiza após login

// 5. Persistência
□ LocalStorage salva dados
□ Página recarregada mantém sessão
□ Projetos salvos corretamente
```

### Teste Unitário: Exemplo

```javascript
// Testar AuthModule.cadastrar()

console.group("🧪 Teste: AuthModule.cadastrar()");

// Setup
localStorage.clear();
AuthModule.inicializar();

// Teste 1: E-mail válido
console.log("Teste 1: Cadastro válido");
const resultado1 = AuthModule.cadastrar("novo@test.com", "cliente");
console.assert(resultado1 === true, "❌ Deveria retornar true");
console.assert(AuthModule.usuarios().length > 2, "❌ Usuário não foi adicionado");
console.log("✅ Passou");

// Teste 2: E-mail duplicado
console.log("Teste 2: E-mail duplicado");
const resultado2 = AuthModule.cadastrar("novo@test.com", "cliente");
console.assert(resultado2 === false, "❌ Deveria retornar false");
console.log("✅ Passou");

// Teste 3: E-mail inválido
console.log("Teste 3: E-mail inválido");
const resultado3 = AuthModule.cadastrar("invalido", "cliente");
console.assert(resultado3 === false, "❌ Deveria rejeitar email inválido");
console.log("✅ Passou");

console.groupEnd();
```

### Teste de Integração

```javascript
// Simular fluxo completo de uso

console.group("🧪 Teste: Fluxo Completo");

// 1. User faz login
console.log("1. Fazendo login...");
AuthModule.login("cliente@exemplo.com", "cliente");
console.assert(AppState.getUsuario() !== null, "❌ Usuario não logou");
console.log("✅ Login bem-sucedido");

// 2. User calcula orçamento
console.log("2. Calculando orçamento...");
const orcamento = OrcamentosModule.calcular("residencial", 100);
console.assert(orcamento.total > 0, "❌ Orçamento inválido");
console.log("✅ Orçamento calculado");

// 3. User solicita projeto
console.log("3. Solicitando projeto...");
ProjetosModule.solicitar("residencial", 100);
const projetos = ProjetosModule.storage();
console.assert(projetos.length > 0, "❌ Projeto não foi criado");
console.log("✅ Projeto criado");

// 4. User marca tarefa como concluída
console.log("4. Marcando tarefa...");
const projeto = projetos[0];
projeto.tasks[0].feito = true;
ProjetosModule.atualizarProgresso(projeto);
console.assert(projeto.progresso > 0, "❌ Progresso não atualizou");
console.log("✅ Progresso atualizado");

console.groupEnd();
```

---

## ⚡ Performance

### Análise de Performance

```javascript
// Medir tempo de inicialização
console.time("Init");

// ... código que você quer medir ...

console.timeEnd("Init");
// Output: Init: 123ms
```

### Otimizações Possíveis

#### 1. Lazy Loading de Módulos

```javascript
// ANTES - Todos os módulos carregam na startup
<script src="modules/auth.js"></script>
<script src="modules/orcamentos.js"></script>
<script src="modules/projetos.js"></script>

// DEPOIS - Carregar sob demanda
const carregarModulo = async (nome) => {
  const script = document.createElement("script");
  script.src = `modules/${nome}.js`;
  document.body.appendChild(script);
  return new Promise(r => script.onload = r);
};

// Uso
document.querySelector("[data-page='projetos']").addEventListener("click", async () => {
  if (!window.ProjetosModule) {
    await carregarModulo("projetos.js");
  }
  UIModule.page.show("projetos");
});
```

#### 2. Memoization

```javascript
// ANTES - Recalcula toda vez
const getBuscaProjetos = (email) => {
  return ProjetosModule.storage().filter(p => p.cliente === email);
};

// DEPOIS - Cache o resultado
const cache = {};
const getBuscaProjetos = (email) => {
  if (!cache[email]) {
    cache[email] = ProjetosModule.storage()
      .filter(p => p.cliente === email);
  }
  return cache[email];
};

// Invalidar cache quando necessário
const invalidarCache = (email) => delete cache[email];
```

#### 3. Debounce para eventos

```javascript
// ANTES - Evento dispara a cada keystroke
input.addEventListener("input", (e) => {
  validarEmail(e.target.value);
});

// DEPOIS - Apenas após 300ms sem digitação
const debounce = (fn, delay) => {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => fn(...args), delay);
  };
};

input.addEventListener("input", debounce((e) => {
  validarEmail(e.target.value);
}, 300));
```

---

## 🔧 Troubleshooting

### Problema: "Módulo não está definido"

```
ReferenceError: AuthModule is not defined
```

**Solução:**
- [ ] Verificar se `modules/auth.js` está importado antes de `app-novo.js`
- [ ] Verificar ordem em `index.html`
- [ ] Verificar se não tem erro de sintaxe em `auth.js`
- [ ] Recarregar página (Ctrl+F5)

### Problema: "localStorage não funciona"

```
Uncaught DOMException: QuotaExceededError
```

**Solução:**
- [ ] `localStorage.clear()` no console
- [ ] Modo incógnito (sem cookies)
- [ ] Verificar limite de storage do navegador

### Problema: "Dados desaparecem após recarregar"

**Causas possíveis:**
- [ ] localStorage não está sendo chamado
- [ ] Modo privado/incógnito apaga dados
- [ ] Espaço insuficiente no storage

**Solução:**
```javascript
// Verificar o que está salvo
Object.keys(localStorage).forEach(key => {
  console.log(key, "->", localStorage.getItem(key));
});
```

### Problema: "Notificação não aparece"

**Debug:**
```javascript
// Testar notificação
Notifications.sucesso("Teste!");

// Se não aparecer, verificar:
console.log(typeof Notifications); // "object"
console.log(Notifications.sucesso); // function

// Verificar CSS
const style = document.createElement("style");
style.textContent = "@keyframes slideInRight { ... }";
console.log(style); // Deve estar no head
```

### Problema: "Usuário não consegue fazer login"

**Checklist:**
- [ ] E-mail é válido? `Utils.isValidEmail(email)`
- [ ] Tipo está selecionado? `document.querySelector('input[name="tipo"]:checked')`
- [ ] Usuário existe? `AuthModule.usuarios().find(u => u.email === "...")`
- [ ] AppState foi atualizado? `AppState.getUsuario()`
- [ ] localStorage foi salvo? `localStorage.usuarioLogado`

```javascript
// Debug completo
const email = "cliente@exemplo.com";
const tipo = "cliente";

console.log("1. Email válido?", Utils.isValidEmail(email));
console.log("2. Usuário existe?", AuthModule.usuarios().find(u => u.email === email));
console.log("3. Tipo correto?", tipo);
console.log("4. Login resultado:", AuthModule.login(email, tipo));
console.log("5. AppState:", AppState.getUsuario());
console.log("6. LocalStorage:", localStorage.usuarioLogado);
```

---

## 📞 Suporte Adicional

### Referências Rápidas

```javascript
// State
AppState.getUsuario()
AppState.getPage()
AppState.getAll()

// UI
UIModule.modal.open()
UIModule.modal.close()
UIModule.page.show("home")
UIModule.menu.update()

// Auth
AuthModule.login(email, tipo)
AuthModule.cadastrar(email, tipo)
AuthModule.logout()

// Notifications
Notifications.sucesso("msg")
Notifications.erro("msg")
Notifications.info("msg")

// Projetos
ProjetosModule.carregar()
ProjetosModule.solicitar(tipo, area)

// Utils
Utils.$("id")
Utils.getStorage("key")
Utils.setStorage("key", value)
Utils.isValidEmail(email)
```

---

**Última atualização**: 28 de janeiro de 2026  
**Versão**: 2.0 (Modularizada)
