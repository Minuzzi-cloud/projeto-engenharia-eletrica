/*************************************************
 * MÓDULO: STATE (Gerenciamento de Estado)
 * Responsabilidade: Manter e gerenciar estado global
 *************************************************/

const AppState = (() => {
  const state = {
    usuarioLogado: null,
    paginaAtual: "home",
    authMode: "login" // login | cadastro
  };

  return {
    // Getter
    get: (key) => state[key],
    getAll: () => ({ ...state }),

    // Setter
    set: (key, value) => {
      if (key in state) {
        state[key] = value;
        return true;
      }
      console.warn(`[AppState] Chave desconhecida: ${key}`);
      return false;
    },

    // Usuario
    setUsuario: (usuario) => {
      state.usuarioLogado = usuario;
      localStorage.setItem("usuarioLogado", JSON.stringify(usuario));
    },

    getUsuario: () => state.usuarioLogado,

    clearUsuario: () => {
      state.usuarioLogado = null;
      localStorage.removeItem("usuarioLogado");
    },

    // Página
    setPage: (pagina) => {
      state.paginaAtual = pagina;
    },

    getPage: () => state.paginaAtual,

    // Auth Mode
    setAuthMode: (mode) => {
      if (["login", "cadastro"].includes(mode)) {
        state.authMode = mode;
      }
    },

    getAuthMode: () => state.authMode
  };
})();
