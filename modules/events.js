/*************************************************
 * MÓDULO: EVENTS (Gerenciamento de Eventos)
 * Responsabilidade: Vincular eventos DOM
 *************************************************/

const EventsModule = (() => {
  const init = () => {
    console.log("📍 Iniciando vinculação de eventos...");
    setupNavigation();
    setupAuth();
    setupOrcamentos();
    setupProjetos();
    console.log("✅ Todos os eventos vinculados!");
  };

  const setupNavigation = () => {
    // Navegação por páginas
    document.querySelectorAll("[data-page]").forEach(link => {
      link.addEventListener("click", (e) => {
        e.preventDefault();
        const page = link.dataset.page;
        console.log(`📄 Navegando para: ${page}`);
        UIModule.page.show(page);
      });
    });

    // Botão Login
    const btnLogin = Utils.$("btn-login");
    if (btnLogin) {
      btnLogin.addEventListener("click", () => {
        console.log("🔓 Abrindo modal de login");
        UIModule.modal.open();
      });
    } else {
      console.warn("⚠️ btn-login não encontrado");
    }

    // Botão Logout
    const btnLogout = Utils.$("btn-logout");
    if (btnLogout) {
      btnLogout.addEventListener("click", () => {
        console.log("🚪 Fazendo logout");
        AuthModule.logout();
        UIModule.menu.update();
        UIModule.page.show("home");
      });
    } else {
      console.warn("⚠️ btn-logout não encontrado");
    }
  };

  const setupAuth = () => {
    // Switch entre login e cadastro
    document.addEventListener("click", (e) => {
      if (e.target.closest(".auth-switch-btn")) {
        const mode = e.target.closest(".auth-switch-btn").dataset.mode;
        console.log(`🔄 Alternando modo de autenticação: ${mode}`);
        UIModule.modal.switchMode(mode);
      }
    }, true);

    // Fechar modal
    const btnFechar = Utils.$("btn-fechar-auth");
    if (btnFechar) {
      btnFechar.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        console.log("❌ Fechando modal");
        UIModule.modal.close();
      });
    } else {
      console.warn("⚠️ btn-fechar-auth não encontrado");
    }

    // Fechar ao clicar fora
    document.addEventListener("click", (e) => {
      const modal = Utils.$("auth-modal");
      const content = document.querySelector("#auth-modal .modal-content");

      if (modal && e.target === modal && !content?.contains(e.target)) {
        console.log("❌ Fechando modal (clique fora)");
        UIModule.modal.close();
      }
    });

    // Formulário de Login
    const formLogin = Utils.$("form-login");
    if (formLogin) {
      formLogin.addEventListener("submit", (e) => {
        e.preventDefault();

        const email = Utils.$("email")?.value;
        const tipo = document.querySelector('input[name="tipo"]:checked')?.value;

        console.log(`🔐 Tentando login - Email: ${email}, Tipo: ${tipo}`);

        if (AuthModule.login(email, tipo)) {
          console.log("✅ Login bem-sucedido!");
          formLogin.reset();
          
          // Fechar modal imediatamente e atualizar UI
          UIModule.modal.close();
          UIModule.menu.update();

          // Aguardar animação do modal e depois mudar de página
          setTimeout(() => {
            console.log("📄 Redirecionando para projetos");
            UIModule.page.show("projetos");
          }, 500);
        } else {
          console.log("❌ Login falhou");
        }
      });
    } else {
      console.warn("⚠️ form-login não encontrado");
    }

    // Formulário de Cadastro
    const formCadastro = Utils.$("form-cadastro");
    if (formCadastro) {
      formCadastro.addEventListener("submit", (e) => {
        e.preventDefault();

        const email = Utils.$("cad-email")?.value;
        const tipo = document.querySelector('input[name="cad-tipo"]:checked')?.value;

        console.log(`📝 Tentando cadastro - Email: ${email}, Tipo: ${tipo}`);

        if (AuthModule.cadastrar(email, tipo)) {
          console.log("✅ Cadastro bem-sucedido!");
          formCadastro.reset();

          setTimeout(() => {
            console.log("🔄 Alternando para login");
            UIModule.modal.switchMode("login");
            Utils.$("email").value = email;
          }, 1500);
        } else {
          console.log("❌ Cadastro falhou");
        }
      });
    } else {
      console.warn("⚠️ form-cadastro não encontrado");
    }
  };

  const setupOrcamentos = () => {
    const formOrcamento = Utils.$("form-orcamento");
    if (formOrcamento) {
      formOrcamento.addEventListener("submit", (e) => {
        e.preventDefault();

        const tipo = Utils.$("tipo-obra")?.value;
        const area = Number(Utils.$("area")?.value);

        console.log(`💰 Calculando orçamento - Tipo: ${tipo}, Área: ${area}m²`);

        const resultado = OrcamentosModule.calcular(tipo, area);
        if (resultado) {
          console.log("✅ Orçamento calculado", resultado);
          OrcamentosModule.exibir(resultado);
        } else {
          console.log("❌ Erro ao calcular orçamento");
        }
      });
    } else {
      console.warn("⚠️ form-orcamento não encontrado");
    }

    const btnSolicitar = Utils.$("btn-solicitar-projeto");
    if (btnSolicitar) {
      btnSolicitar.addEventListener("click", () => {
        const tipo = Utils.$("tipo-obra")?.value;
        const area = Number(Utils.$("area")?.value);

        console.log(`📋 Solicitando projeto - Tipo: ${tipo}, Área: ${area}m²`);

        if (ProjetosModule.solicitar(tipo, area)) {
          console.log("✅ Projeto solicitado!");
          ProjetosModule.carregar();
        } else {
          console.log("❌ Erro ao solicitar projeto");
        }
      });
    } else {
      console.warn("⚠️ btn-solicitar-projeto não encontrado");
    }
  };

  const setupProjetos = () => {
    document.addEventListener("click", () => {
      if (UIModule.page.current() === "projetos" && AppState.getUsuario()) {
        ProjetosModule.carregar();
      }
    });
  };

  return { init };
})();
