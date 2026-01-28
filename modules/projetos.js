/*************************************************
 * MÓDULO: PROJETOS (Gerenciamento de Projetos)
 * Responsabilidade: Gerenciar projetos e tarefas
 *************************************************/

const ProjetosModule = (() => {
  const storage = {
    getAll: () => Utils.getStorage("projetos") || [],

    save: (projetos) => {
      Utils.setStorage("projetos", projetos);
    },

    add: (projeto) => {
      const projetos = storage.getAll();
      projetos.push(projeto);
      storage.save(projetos);
    },

    update: (projeto) => {
      const projetos = storage.getAll();
      const index = projetos.findIndex(p => p.id === projeto.id);
      if (index !== -1) {
        projetos[index] = projeto;
        storage.save(projetos);
      }
    },

    getByCliente: (email) => {
      return storage.getAll().filter(p => p.cliente === email);
    },

    getAll: () => storage.getAll()
  };

  const solicitar = (tipo, area) => {
    const usuario = AppState.getUsuario();

    if (!usuario) {
      Notifications.erro("Faça login para solicitar um projeto");
      UIModule.modal.open();
      return false;
    }

    if (usuario.tipo !== "cliente") {
      Notifications.erro("Apenas clientes podem solicitar projetos");
      return false;
    }

    const projeto = {
      id: Date.now(),
      cliente: usuario.email,
      progresso: 0,
      dataSolicitacao: new Date().toLocaleString("pt-BR"),
      tipo,
      area,
      tasks: [
        { nome: "Levantamento de carga", feito: false },
        { nome: "Diagrama unifilar", feito: false },
        { nome: "Memorial descritivo", feito: false }
      ]
    };

    storage.add(projeto);
    Notifications.sucesso("Projeto solicitado com sucesso! 🎉 Você será notificado em breve.");
    OrcamentosModule.limpar();
    return true;
  };

  const carregar = () => {
    const usuario = AppState.getUsuario();
    const lista = Utils.$("lista-projetos-cliente");

    if (!lista) return;

    lista.innerHTML = "";

    if (!usuario) {
      lista.innerHTML = '<li style="text-align: center; color: var(--text-light);">Faça login para ver seus projetos</li>';
      return;
    }

    const projetos = usuario.tipo === "engenheiro"
      ? storage.getAll()
      : storage.getByCliente(usuario.email);

    if (projetos.length === 0) {
      lista.innerHTML = '<li style="text-align: center; color: var(--text-light);">Nenhum projeto encontrado</li>';
      return;
    }

    projetos.forEach(projeto => {
      const li = document.createElement("li");

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
    const usuario = AppState.getUsuario();
    const lista = Utils.$("lista-tasks");

    lista.innerHTML = "";

    projeto.tasks.forEach(task => {
      const li = document.createElement("li");

      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.checked = task.feito;
      checkbox.disabled = usuario.tipo !== "engenheiro";

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

    Utils.$("barra-progresso").value = projeto.progresso;
    Utils.$("detalhes-projeto").hidden = false;
    Utils.$("detalhes-projeto").scrollIntoView({ behavior: "smooth" });
  };

  const atualizarProgresso = (projeto) => {
    const feitos = projeto.tasks.filter(t => t.feito).length;
    projeto.progresso = Math.round((feitos / projeto.tasks.length) * 100);

    storage.update(projeto);

    if (projeto.progresso === 100) {
      Notifications.sucesso("Projeto concluído! 🎉");
    }

    carregar();
  };

  return {
    solicitar,
    carregar,
    abrirProjeto,
    atualizarProgresso,
    storage: storage.getAll
  };
})();
