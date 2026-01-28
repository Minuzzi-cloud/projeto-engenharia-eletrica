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

const abrirLogin = () => $("login").hidden = false;
const fecharLogin = () => $("login").hidden = true;
const abrirCadastro = () => $("cadastro").hidden = false;
const fecharCadastro = () => $("cadastro").hidden = true;

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
$("btn-logout").addEventListener("click", () => {
  localStorage.removeItem("usuarioLogado");
  state.usuarioLogado = null;
  atualizarMenu();
  trocarPagina("home");
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
 * CADASTRO
 *************************************************/
$("form-cadastro").addEventListener("submit", (e) => {
  e.preventDefault();

  const email = $("cad-email").value;
  const tipo = document.querySelector('input[name="cad-tipo"]:checked').value;

  const usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];

  if (usuarios.find(u => u.email === email)) {
    alert("Usuário já cadastrado");
    return;
  }

  usuarios.push({ email, tipo });
  localStorage.setItem("usuarios", JSON.stringify(usuarios));

  alert("Cadastro realizado com sucesso!");

  fecharCadastro();
  abrirLogin();
  $("email").value = email;
});

$("btn-ir-cadastro").addEventListener("click", () => {
  fecharLogin();
  abrirCadastro();
});

$("btn-cancelar-cadastro").addEventListener("click", () => {
  fecharCadastro();
  abrirLogin();
});

/*************************************************
 * LOGIN
 *************************************************/
$("form-login").addEventListener("submit", (e) => {
  e.preventDefault();

  const email = $("email").value;
  const tipo = document.querySelector('input[name="tipo"]:checked').value;

  const usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
  const usuario = usuarios.find(u => u.email === email && u.tipo === tipo);

  if (!usuario) {
    alert("Usuário não encontrado");
    return;
  }

  state.usuarioLogado = usuario;
  localStorage.setItem("usuarioLogado", JSON.stringify(usuario));

  fecharLogin();
  atualizarMenu();
  trocarPagina("orcamentos");
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
    abrirLogin();
    return;
  }

  const projetos = JSON.parse(localStorage.getItem("projetos")) || [];

  projetos.push({
    id: Date.now(),
    cliente: state.usuarioLogado.email,
    progresso: 0,
    tasks: [
      { nome: "Levantamento de carga", feito: false },
      { nome: "Diagrama unifilar", feito: false },
      { nome: "Memorial descritivo", feito: false }
    ]
  });

  localStorage.setItem("projetos", JSON.stringify(projetos));
  alert("Projeto solicitado!");
});

/*************************************************
 * PROJETOS
 *************************************************/
const carregarProjetos = () => {
  const lista = $("lista-projetos-cliente");
  lista.innerHTML = "";

  const projetos = JSON.parse(localStorage.getItem("projetos")) || [];

  projetos
    .filter(p =>
      state.usuarioLogado.tipo === "engenheiro" ||
      p.cliente === state.usuarioLogado.email
    )
    .forEach(projeto => {
      const li = document.createElement("li");
      li.textContent = `Projeto #${projeto.id} - ${projeto.progresso}%`;
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

    checkbox.addEventListener("change", () => {
      task.feito = checkbox.checked;
      atualizarProgresso(projeto);
    });

    li.append(checkbox, task.nome);
    lista.appendChild(li);
  });

  $("barra-progresso").value = projeto.progresso;
  $("detalhes-projeto").hidden = false;
};

const atualizarProgresso = (projeto) => {
  const feitos = projeto.tasks.filter(t => t.feito).length;
  projeto.progresso = Math.round((feitos / projeto.tasks.length) * 100);

  const projetos = JSON.parse(localStorage.getItem("projetos")) || [];
  const index = projetos.findIndex(p => p.id === projeto.id);
  projetos[index] = projeto;

  localStorage.setItem("projetos", JSON.stringify(projetos));
  carregarProjetos();
};

/*************************************************
 * INICIALIZAÇÃO
 *************************************************/
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
