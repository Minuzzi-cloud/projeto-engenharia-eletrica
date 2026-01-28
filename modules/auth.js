/*************************************************
 * MÓDULO: AUTH (Autenticação)
 * Responsabilidade: Gerenciar login e cadastro
 *************************************************/

const AuthModule = (() => {
  const usuarios = (() => {
    return {
      getAll: () => Utils.getStorage("usuarios") || [],
      
      add: (email, tipo) => {
        const todos = usuarios.getAll();
        todos.push({ email, tipo, dataCadastro: new Date().toLocaleString("pt-BR") });
        Utils.setStorage("usuarios", todos);
        return true;
      },

      existe: (email) => {
        return usuarios.getAll().some(u => u.email === email);
      },

      buscar: (email, tipo) => {
        return usuarios.getAll().find(u => u.email === email && u.tipo === tipo) || null;
      }
    };
  })();

  const inicializar = () => {
    const usuariosSalvos = Utils.getStorage("usuarios");
    
    if (!usuariosSalvos) {
      const usuariosTeste = [
        { email: "cliente@exemplo.com", tipo: "cliente", dataCadastro: "01/01/2026" },
        { email: "engenheiro@exemplo.com", tipo: "engenheiro", dataCadastro: "01/01/2026" }
      ];
      Utils.setStorage("usuarios", usuariosTeste);
      console.log("✅ Usuários de teste criados");
    }

    const usuarioSalvo = Utils.getStorage("usuarioLogado");
    if (usuarioSalvo) {
      AppState.setUsuario(usuarioSalvo);
    }
  };

  const cadastrar = (email, tipo) => {
    email = email.trim();

    if (!email) {
      Notifications.erro("Por favor, preencha o e-mail");
      return false;
    }

    if (!Utils.isValidEmail(email)) {
      Notifications.erro("E-mail inválido");
      return false;
    }

    if (!tipo) {
      Notifications.erro("Selecione um tipo de conta");
      return false;
    }

    if (usuarios.existe(email)) {
      Notifications.erro("Este e-mail já está cadastrado");
      return false;
    }

    usuarios.add(email, tipo);
    Notifications.sucesso("Cadastro realizado com sucesso! Faça login para continuar");
    return true;
  };

  const login = (email, tipo) => {
    email = email.trim();

    if (!email) {
      Notifications.erro("Por favor, preencha o e-mail");
      return false;
    }

    if (!Utils.isValidEmail(email)) {
      Notifications.erro("E-mail inválido");
      return false;
    }

    if (!tipo) {
      Notifications.erro("Selecione um tipo de conta");
      return false;
    }

    const usuario = usuarios.buscar(email, tipo);

    if (!usuario) {
      Notifications.erro("E-mail ou tipo de conta incorreto. Verifique suas credenciais.");
      return false;
    }

    AppState.setUsuario(usuario);
    Notifications.sucesso(`Bem-vindo, ${email}! 🎉`);
    return true;
  };

  const logout = () => {
    const email = AppState.getUsuario()?.email || "Usuário";
    AppState.clearUsuario();
    Notifications.sucesso(`Até logo, ${email}! 👋`);
  };

  return {
    inicializar,
    cadastrar,
    login,
    logout,
    usuarios: usuarios.getAll
  };
})();
