# 🔧 SUPORTE RÁPIDO - BOTÕES NÃO FUNCIONAM

Se os botões ainda não funcionarem, siga este guia:

## ⚡ Solução Rápida (3 passos)

### 1️⃣ Limpar Cache
```bash
# No terminal:
rm -rf ~/.cache/google-chrome/*  # Chrome
# ou
Ctrl+Shift+Delete  # Atalho no navegador
```

### 2️⃣ Recarregar Página
- Clique em **F5** ou **Ctrl+R**
- Se não funcionar, tente **Ctrl+Shift+R** (reload forçado)

### 3️⃣ Verificar Console (F12)
- Deve ver mensagens verdes ✅
- Se ver ❌ vermelhos, procure pelo erro

---

## 🚨 Erros Comuns e Soluções

### Erro: "Cannot read property 'addEventListener' of null"

**Problema**: Elemento não encontrado

**Solução**:
1. Abra Dev Tools (F12)
2. Vá para Elements/Inspector
3. Procure pelo elemento (ex: busque "btn-login")
4. Se não achar, o ID está errado em `index.html`

**Verificação**:
```javascript
console.log(document.getElementById("btn-login")); // Deve retornar o elemento
```

---

### Erro: "Utils is not defined" ou "AuthModule is not defined"

**Problema**: Scripts não carregaram na ordem certa

**Solução**:
1. F12 → Network
2. Recarregue página (F5)
3. Verifique se TODOS os scripts têm status 200:
   - modules/state.js
   - modules/utils.js
   - modules/notifications.js
   - modules/auth.js
   - modules/ui.js
   - modules/orcamentos.js
   - modules/projetos.js
   - modules/events.js
   - app-novo.js

Se algum tiver 404, o arquivo não existe ou o caminho está errado.

---

### Modal não abre

**Problema**: Botão "Login" não funciona

**Solução**:
1. Console (F12)
2. Cole este código:
```javascript
document.getElementById("btn-login").click();
```
3. Se modal abre, problema é no event listener
4. Se não abre, problema é no modal.open()

---

### Console está vazio

**Problema**: Scripts não carregaram

**Solução**:
1. F12 → Network
2. Veja se há erros (status não-200)
3. Se houver erros 404, os scripts não existem
4. Se houver erros CORS, servidor está bloqueando

---

## ✅ Verificação Completa

Execute no console (F12):

```javascript
// 1. Verificar se modal existe
console.log("1. Modal existe?", document.getElementById("auth-modal") ? "✅" : "❌");

// 2. Verificar se botão existe
console.log("2. Botão login existe?", document.getElementById("btn-login") ? "✅" : "❌");

// 3. Verificar se módulos carregaram
console.log("3. Módulos carregados?", window.EventsModule ? "✅" : "❌");

// 4. Tentar clicar
console.log("4. Testando clique...");
document.getElementById("btn-login")?.click();
console.log("✅ Clique enviado (verifique se modal abriu)");
```

---

## 🔄 Reiniciar Tudo

Se tudo falhar, faça isto:

1. **Fechar navegador completamente**
2. **Abrir terminal** e rodar:
```bash
cd /home/labdes17/Documentos/th/projeto-engenharia-eletrica
python3 -m http.server 8000
```
3. **Abrir novo navegador**
4. **Ir para** http://localhost:8000
5. **Abrir console** (F12)
6. **Verificar logs** de inicialização

Você deve ver:
```
🚀 Iniciando aplicação...
✅ Autenticação inicializada
✅ Menu atualizado
📍 Iniciando vinculação de eventos...
✅ Todos os eventos vinculados!
✅ Página inicial carregada
🎉 Aplicação pronta!
```

Se ver esses logs, tudo está funcionando!

---

## 📱 Testar em Live Server (VS Code)

Se usar Live Server no VS Code:

1. **Instale a extensão** "Live Server" (Ritwick Dey)
2. **Clique com botão direito** em `index.html`
3. **Selecione** "Open with Live Server"
4. Deve funcionar perfeitamente

---

## 🆘 Último Recurso

Se ainda não funcionar:

1. **Crie um arquivo simples** para testar:
```html
<!DOCTYPE html>
<html>
<body>
<button onclick="alert('Funcionando!')">Clique</button>
</body>
</html>
```

2. **Abra no navegador**
3. **Se botão funcionar**, o problema é específico do projeto
4. **Se botão não funcionar**, o problema é do navegador/servidor

---

## 💡 Dicas de Debug

### Ver ordem de carregamento
```javascript
console.log("Tempo de carregamento:", performance.now(), "ms");
```

### Ver todas as funções disponíveis
```javascript
console.log(window);
```

### Forçar recarregar módulos
```javascript
location.reload(true);  // Ignora cache
```

### Listar todos os listeners (Chrome)
```javascript
getEventListeners(document.getElementById("btn-login"));
```

---

## 📞 Suporte Técnico

Se após seguir este guia ainda não funcionar:

1. **Copie o console inteiro** (F12 → ícone copiar)
2. **Tire screenshot** do inspector (elementos)
3. **Descreva exatamente** o que acontece
4. **Relate qual botão** não funciona

Com essas informações é possível diagnosticar 100% do problema.

---

**Status**: Botões devem estar funcionando 100%  
**Última atualização**: 28 de janeiro de 2026
