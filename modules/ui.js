/*************************************************
 * MÓDULO: UI (Interface)
 * Responsabilidade: Gerenciar elementos visuais
 *************************************************/

const UIModule = (() => {
  const modal = {
    open: () => {
      const authModal = Utils.$("auth-modal");
      if (!authModal) {
        console.error("❌ auth-modal não encontrado");
        return;
      }
      authModal.hidden = false;
      authModal.classList.add("visible");
      console.log("✅ Modal de login aberto");
    },

    close: () => {
      const authModal = Utils.$("auth-modal");
      if (!authModal) {
        console.error("❌ auth-modal não encontrado");
        return;
      }
      authModal.classList.remove("visible");
      
      // Aguarda animação de saída antes de esconder
      setTimeout(() => {
        authModal.hidden = true;
        console.log("✅ Modal de login fechado");
      }, 300);
    },

    switchMode: (mode) => {
      AppState.setAuthMode(mode);

      // Atualizar botões do switch
      document.querySelectorAll(".auth-switch-btn").forEach(b => {
        Utils.removeClass(b, "active");
      });
      const btnAtivo = document.querySelector(`[data-mode="${mode}"]`);
      if (btnAtivo) {
        btnAtivo.classList.add("active");
      }

      // Atualizar formulários
      document.querySelectorAll(".auth-form").forEach(f => {
        Utils.removeClass(f, "active");
      });
      
      if (mode === "login") {
        const formLogin = Utils.$("form-login");
        if (formLogin) formLogin.classList.add("active");
      } else {
        const formCadastro = Utils.$("form-cadastro");
        if (formCadastro) formCadastro.classList.add("active");
      }
      console.log(`🔄 Modo alterado para: ${mode}`);
    }
  };

  const page = {
    show: (pageName) => {
      document.querySelectorAll(".page").forEach(p => Utils.removeClass(p, "active"));
      const pageElement = Utils.$(`${pageName}`);
      if (!pageElement) {
        console.error(`❌ Página ${pageName} não encontrada`);
        return;
      }
      pageElement.classList.add("active");
      AppState.setPage(pageName);
      console.log(`📄 Página exibida: ${pageName}`);
    },

    current: () => AppState.getPage()
  };

  const menu = {
    update: () => {
      const logado = !!AppState.getUsuario();
      
      const btnLogin = Utils.$("btn-login");
      const btnLogout = Utils.$("btn-logout");
      const menuProjetos = Utils.$("menu-projetos");

      if (btnLogin) btnLogin.hidden = logado;
      if (btnLogout) btnLogout.hidden = !logado;
      if (menuProjetos) menuProjetos.hidden = !logado;
      
      console.log(`👤 Menu atualizado - Logado: ${logado}`);
    }
  };

  return {
    modal,
    page,
    menu
  };
})();
