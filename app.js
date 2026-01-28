/*************************************************
 * ESTADO GLOBAL (controlado)
 *************************************************/
const state = {
  usuarioLogado: null,
  paginaAtual: "home"
};

/*************************************************
 * UTILIDADES
 *************************************************/
const $ = (id) => document.getElementById(id);

const trocarPagina = (pagina) => {
  document.querySelectorAll(".page").forEach(p => p.classList.remove("active"));
  $(pagina).classList.add("active");
  state.paginaAtual = pagina;
};

const abrirLogin = () => $("auth-modal").hidden = false;
const fecharLogin = () => $("auth-modal").hidden = true;

// Trocar entre login e cadastro
document.addEventListener("click", (e) => {
  if (e.target.closest(".auth-switch-btn")) {
    const btn = e.target.closest(".auth-switch-btn");
    const mode = btn.dataset.mode;
    
    // Atualizar botões
    document.querySelectorAll(".auth-switch-btn").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    
    // Atualizar formulários
    document.querySelectorAll(".auth-form").forEach(f => f.classList.remove("active"));
    
    if (mode === "login") {
      $("form-login").classList.add("active");
    } else {
      $("form-cadastro").classList.add("active");
    }
  }
}, true);

// Fechar modal ao clicar no botão X
$("btn-fechar-auth").addEventListener("click", (e) => {
  e.preventDefault();
  e.stopPropagation();
  fecharLogin();
});

// Fechar modal ao clicar fora (no fundo)
document.addEventListener("click", (e) => {
  const modal = $("auth-modal");
  const content = document.querySelector("#auth-modal .modal-content");
  
  if (e.target === modal && !content?.contains(e.target)) {
    fecharLogin();
  }
});

/*************************************************
 * MENU / NAVEGAÇÃO
 *************************************************/
document.querySelectorAll("[data-page]").forEach(link => {
  link.addEventListener("click", (e) => {
    e.preventDefault();
    trocarPagina(link.dataset.page);
  });
});

$("btn-login").addEventListener("click", abrirLogin);

// Usar delegação de eventos para garantir funcionamento
document.addEventListener("click", (e) => {
  if (e.target.id === "btn-ir-cadastro") {
    e.preventDefault();
    e.stopPropagation();
    document.querySelectorAll(".auth-switch-btn").forEach(b => b.classList.remove("active"));
    document.getElementById("btn-switch-cadastro").classList.add("active");
    document.querySelectorAll(".auth-form").forEach(f => f.classList.remove("active"));
    $("form-cadastro").classList.add("active");
  }
  
  if (e.target.id === "btn-cancelar-cadastro") {
    e.preventDefault();
    e.stopPropagation();
    document.querySelectorAll(".auth-switch-btn").forEach(b => b.classList.remove("active"));
    document.getElementById("btn-switch-login").classList.add("active");
    document.querySelectorAll(".auth-form").forEach(f => f.classList.remove("active"));
    $("form-login").classList.add("active");
  }
  
  if (e.target.id === "btn-cancelar-login") {
    e.preventDefault();
    e.stopPropagation();
    fecharLogin();
  }
  
  if (e.target.id === "btn-voltar-login") {
    e.preventDefault();
    e.stopPropagation();
    document.querySelectorAll(".auth-switch-btn").forEach(b => b.classList.remove("active"));
    document.getElementById("btn-switch-login").classList.add("active");
    document.querySelectorAll(".auth-form").forEach(f => f.classList.remove("active"));
    $("form-login").classList.add("active");
  }
}, true); // Usar captura para prioridade
$("btn-logout").addEventListener("click", () => {
  const emailUsuario = state.usuarioLogado?.email || "Usuário";
  
  localStorage.removeItem("usuarioLogado");
  state.usuarioLogado = null;
  
  mostrarNotificacao(`Até logo, ${emailUsuario}! 👋`, "sucesso");
  
  atualizarMenu();
  
  setTimeout(() => {
    trocarPagina("home");
  }, 800);
});

/*************************************************
 * MENU DINÂMICO
 *************************************************/
const atualizarMenu = () => {
  const logado = !!state.usuarioLogado;

  $("btn-login").hidden = logado;
  $("btn-logout").hidden = !logado;

  $("menu-projetos").hidden = !logado;
};

/*************************************************
 * NOTIFICAÇÕES
 *************************************************/
const mostrarNotificacao = (mensagem, tipo = "info") => {
  const notif = document.createElement("div");
  notif.style.cssText = `
    position: fixed;
    top: 80px;
    right: 20px;
    padding: 1rem 1.5rem;
    background: ${tipo === "sucesso" ? "var(--success)" : tipo === "erro" ? "var(--danger)" : "var(--primary)"};
    color: white;
    border-radius: 8px;
    box-shadow: var(--shadow-lg);
    z-index: 3000;
    animation: slideInRight 0.3s ease-out;
    max-width: 350px;
    font-weight: 500;
  `;
  notif.textContent = mensagem;
  document.body.appendChild(notif);
  
  setTimeout(() => {
    notif.style.animation = "slideOutRight 0.3s ease-out forwards";
    setTimeout(() => notif.remove(), 300);
  }, 3000);
};

// Adicionar animações ao CSS globalmente
const style = document.createElement("style");
style.textContent = `
  @keyframes slideInRight {
    from {
      opacity: 0;
      transform: translateX(100px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }
  
  @keyframes slideOutRight {
    to {
      opacity: 0;
      transform: translateX(100px);
    }
  }
`;
document.head.appendChild(style);

/*************************************************
 * CADASTRO
 *************************************************/
$("form-cadastro").addEventListener("submit", (e) => {
  e.preventDefault();

  const email = $("cad-email").value.trim();
  const tipo = document.querySelector('input[name="cad-tipo"]:checked')?.value;

  // Validações
  if (!email) {
    mostrarNotificacao("Por favor, preencha o e-mail", "erro");
    return;
  }

  if (!tipo) {
    mostrarNotificacao("Selecione um tipo de conta", "erro");
    return;
  }

  if (!email.includes("@")) {
    mostrarNotificacao("E-mail inválido", "erro");
    return;
  }

  const usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];

  if (usuarios.find(u => u.email === email)) {
    mostrarNotificacao("Este e-mail já está cadastrado", "erro");
    return;
  }

  usuarios.push({ email, tipo, dataCadastro: new Date().toLocaleString("pt-BR") });
  localStorage.setItem("usuarios", JSON.stringify(usuarios));

  mostrarNotificacao("Cadastro realizado com sucesso! Faça login para continuar", "sucesso");

  // Limpar formulário
  $("form-cadastro").reset();
  
  setTimeout(() => {
    // Trocar para aba de login
    document.querySelectorAll(".auth-switch-btn").forEach(b => b.classList.remove("active"));
    document.getElementById("btn-switch-login").classList.add("active");
    document.querySelectorAll(".auth-form").forEach(f => f.classList.remove("active"));
    $("form-login").classList.add("active");
    
    $("email").value = email;
  }, 1500);
});

// Os listeners abaixo foram movidos para delegação de eventos acima

/*************************************************
 * LOGIN
 *************************************************/
$("form-login").addEventListener("submit", (e) => {
  e.preventDefault();

  const email = $("email").value.trim();
  const tipo = document.querySelector('input[name="tipo"]:checked')?.value;

  // Validações
  if (!email) {
    mostrarNotificacao("Por favor, preencha o e-mail", "erro");
    return;
  }

  if (!tipo) {
    mostrarNotificacao("Selecione um tipo de conta", "erro");
    return;
  }

  if (!email.includes("@")) {
    mostrarNotificacao("E-mail inválido", "erro");
    return;
  }

  const usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
  const usuario = usuarios.find(u => u.email === email && u.tipo === tipo);

  if (!usuario) {
    mostrarNotificacao("E-mail ou tipo de conta incorreto. Verifique suas credenciais.", "erro");
    return;
  }

  // Login bem-sucedido
  state.usuarioLogado = usuario;
  localStorage.setItem("usuarioLogado", JSON.stringify(usuario));

  mostrarNotificacao(`Bem-vindo, ${email}! 🎉`, "sucesso");

  // Limpar formulário
  $("form-login").reset();

  fecharLogin();
  atualizarMenu();
  
  setTimeout(() => {
    trocarPagina("orcamentos");
  }, 800);
});

/*************************************************
 * ORÇAMENTOS
 *************************************************/
const tabelaValores = {
  residencial: 25,
  comercial: 35
};

$("form-orcamento").addEventListener("submit", (e) => {
  e.preventDefault();

  const tipo = $("tipo-obra").value;
  const area = Number($("area").value);

  const valorM2 = tabelaValores[tipo];
  const total = valorM2 * area;

  $("valor-m2").textContent = `R$ ${valorM2}`;
  $("valor-total").textContent = `R$ ${total}`;

  $("resultado-orcamento").hidden = false;
});

/*************************************************
 * SOLICITAR PROJETO
 *************************************************/
$("btn-solicitar-projeto").addEventListener("click", () => {
  if (!state.usuarioLogado) {
    mostrarNotificacao("Faça login para solicitar um projeto", "erro");
    abrirLogin();
    return;
  }

  if (state.usuarioLogado.tipo !== "cliente") {
    mostrarNotificacao("Apenas clientes podem solicitar projetos", "erro");
    return;
  }

  const projetos = JSON.parse(localStorage.getItem("projetos")) || [];

  projetos.push({
    id: Date.now(),
    cliente: state.usuarioLogado.email,
    progresso: 0,
    dataSolicitacao: new Date().toLocaleString("pt-BR"),
    tasks: [
      { nome: "Levantamento de carga", feito: false },
      { nome: "Diagrama unifilar", feito: false },
      { nome: "Memorial descritivo", feito: false }
    ]
  });

  localStorage.setItem("projetos", JSON.stringify(projetos));
  mostrarNotificacao("Projeto solicitado com sucesso! 🎉 Você será notificado em breve.", "sucesso");
  
  // Limpar formulário
  $("form-orcamento").reset();
  $("resultado-orcamento").hidden = true;
});

/*************************************************
 * PROJETOS
 *************************************************/
const carregarProjetos = () => {
  const lista = $("lista-projetos-cliente");
  lista.innerHTML = "";

  if (!state.usuarioLogado) {
    lista.innerHTML = "<li style='text-align: center; color: var(--text-light);'>Faça login para ver seus projetos</li>";
    return;
  }

  const projetos = JSON.parse(localStorage.getItem("projetos")) || [];
  const projetosFiltrados = projetos.filter(p =>
    state.usuarioLogado.tipo === "engenheiro" ||
    p.cliente === state.usuarioLogado.email
  );

  if (projetosFiltrados.length === 0) {
    lista.innerHTML = "<li style='text-align: center; color: var(--text-light);'>Nenhum projeto encontrado</li>";
    return;
  }

  projetosFiltrados.forEach(projeto => {
    const li = document.createElement("li");
    const tipoProj = state.usuarioLogado.tipo === "cliente" ? "Seu Projeto" : "Projeto do Cliente";
    
    li.innerHTML = `
      <div>
        <strong>Projeto #${projeto.id}</strong>
        <p style="font-size: 0.9rem; color: var(--text-light);">
          Cliente: ${projeto.cliente}
        </p>
      </div>
      <div style="text-align: right;">
        <span style="font-weight: 600; color: var(--primary);">${projeto.progresso}%</span>
      </div>
    `;
    
    li.addEventListener("click", () => abrirProjeto(projeto));
    lista.appendChild(li);
  });
};

const abrirProjeto = (projeto) => {
  const lista = $("lista-tasks");
  lista.innerHTML = "";

  projeto.tasks.forEach((task, index) => {
    const li = document.createElement("li");

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = task.feito;
    checkbox.disabled = state.usuarioLogado.tipo !== "engenheiro";

    const label = document.createElement("label");
    label.textContent = task.nome;
    label.style.marginLeft = "0.5rem";
    label.style.cursor = checkbox.disabled ? "not-allowed" : "pointer";

    checkbox.addEventListener("change", () => {
      task.feito = checkbox.checked;
      atualizarProgresso(projeto);
    });

    li.append(checkbox, label);
    lista.appendChild(li);
  });

  $("barra-progresso").value = projeto.progresso;
  $("detalhes-projeto").hidden = false;

  // Scroll para detalhes
  $("detalhes-projeto").scrollIntoView({ behavior: "smooth" });
};

const atualizarProgresso = (projeto) => {
  const feitos = projeto.tasks.filter(t => t.feito).length;
  projeto.progresso = Math.round((feitos / projeto.tasks.length) * 100);

  const projetos = JSON.parse(localStorage.getItem("projetos")) || [];
  const index = projetos.findIndex(p => p.id === projeto.id);
  projetos[index] = projeto;

  localStorage.setItem("projetos", JSON.stringify(projetos));
  
  // Feedback visual
  if (projeto.progresso === 100) {
    mostrarNotificacao("Projeto concluído! 🎉", "sucesso");
  }
  
  carregarProjetos();
};

/*************************************************
 * INICIALIZAÇÃO
 *************************************************/

// Criar usuários de teste se não existirem
const inicializarDadosTeste = () => {
  const usuariosExistentes = localStorage.getItem("usuarios");
  
  if (!usuariosExistentes) {
    const usuariosTeste = [
      { email: "cliente@exemplo.com", tipo: "cliente", dataCadastro: "01/01/2026" },
      { email: "engenheiro@exemplo.com", tipo: "engenheiro", dataCadastro: "01/01/2026" }
    ];
    localStorage.setItem("usuarios", JSON.stringify(usuariosTeste));
    console.log("✅ Usuários de teste criados");
  }
};

inicializarDadosTeste();

const usuarioSalvo = JSON.parse(localStorage.getItem("usuarioLogado"));
if (usuarioSalvo) {
  state.usuarioLogado = usuarioSalvo;
  atualizarMenu();
}

document.addEventListener("click", () => {
  if (state.paginaAtual === "projetos" && state.usuarioLogado) {
    carregarProjetos();
  }
});
