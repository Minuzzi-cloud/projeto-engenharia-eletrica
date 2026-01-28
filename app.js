// Sessão ativa
let usuarioLogado = null;

// Dados carregados via fetch
let planos = [];
let projetos = [];

// Orçamento temporário (antes do login)
let orcamentoTemp = null;

// SELETORES DOM

const pages = document.querySelectorAll(".page");
const menuLinks = document.querySelectorAll("[data-page]");

const btnLogin = document.getElementById("btn-login");
const btnLogout = document.getElementById("btn-logout");

// Orçamento
const formOrcamento = document.getElementById("form-orcamento");
const resultadoOrcamento = document.getElementById("resultado-orcamento");
const valorM2 = document.getElementById("valor-m2");
const valorTotal = document.getElementById("valor-total");
const btnSolicitarProjeto = document.getElementById("btn-solicitar-projeto");

// Login
const modalLogin = document.getElementById("login");
const formLogin = document.getElementById("form-login");

// SPA / NAVEGAÇÃO

const showPage = (pageId) => {
  pages.forEach(page => page.classList.remove("active"));

  const page = document.getElementById(pageId);
  if (page) page.classList.add("active");

  history.pushState({ page: pageId }, "", `#${pageId}`);
};

menuLinks.forEach(link => {
  link.addEventListener("click", (e) => {
    e.preventDefault();
    showPage(e.target.dataset.page);
  });
});

window.addEventListener("popstate", (e) => {
  if (e.state?.page) showPage(e.state.page);
});

// LOGIN / LOGOUT

const loginUsuario = (email, tipo) => {
  usuarioLogado = { email, tipo };

  sessionStorage.setItem("usuarioLogado", JSON.stringify(usuarioLogado));
  atualizarMenu();
  fecharLogin();

  // Se havia orçamento pendente
  if (orcamentoTemp) {
    salvarProjeto();
    orcamentoTemp = null;
  }

  showPage("projetos");
};

const logoutUsuario = () => {
  sessionStorage.removeItem("usuarioLogado");
  usuarioLogado = null;
  atualizarMenu();
  showPage("home");
};

const verificarSessao = () => {
  const user = sessionStorage.getItem("usuarioLogado");
  if (user) {
    usuarioLogado = JSON.parse(user);
    atualizarMenu();
  }
};

// ORÇAMENTO

const calcularOrcamento = (area, valorMetro) => area * valorMetro;

const salvarOrcamentoTemporario = (dados) => {
  orcamentoTemp = dados;
  sessionStorage.setItem("orcamentoTemp", JSON.stringify(dados));
};

const carregarOrcamentoTemp = () => {
  const temp = sessionStorage.getItem("orcamentoTemp");
  if (temp) orcamentoTemp = JSON.parse(temp);
};

formOrcamento.addEventListener("submit", (e) => {
  e.preventDefault();

  const area = Number(document.getElementById("area").value);
  const tipo = document.getElementById("tipo-obra").value;

  const plano = planos.find(p => p.tipo === tipo);
  const total = calcularOrcamento(area, plano.valorMetro);

  valorM2.textContent = `R$ ${plano.valorMetro.toFixed(2)}`;
  valorTotal.textContent = `R$ ${total.toFixed(2)}`;

  resultadoOrcamento.hidden = false;

  salvarOrcamentoTemporario({ area, tipo, total });
});

// PROJETOS

const calcularProgresso = (tasks) => {
  const concluidas = tasks.filter(t => t.concluida).length;
  return Math.round((concluidas / tasks.length) * 100);
};

const atualizarTask = (projetoId, taskIndex) => {
  const projeto = projetos.find(p => p.id === projetoId);
  projeto.tasks[taskIndex].concluida = !projeto.tasks[taskIndex].concluida;

  salvarProjetos();
  renderDetalhesProjeto(projeto);
};

// FETCH DE DADOS

const carregarPlanos = async () => {
  try {
    showLoading();
    const res = await fetch("data/planos.json");
    planos = await res.json();
  } catch (error) {
    showError("Erro ao carregar planos");
  } finally {
    hideLoading();
  }
};

const carregarProjetos = () => {
  fetch("data/projetos.json")
    .then(res => res.json())
    .then(data => projetos = data)
    .catch(() => showError("Erro ao carregar projetos"));
};

// INIT

const init = async () => {
  verificarSessao();
  carregarOrcamentoTemp();
  await carregarPlanos();
  carregarProjetos();
  showPage("home");
};

document.addEventListener("DOMContentLoaded", init);
