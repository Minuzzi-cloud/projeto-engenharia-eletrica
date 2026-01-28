/*************************************************
 * APLICAÇÃO PRINCIPAL - ENGENHARIA ELÉTRICA
 * 
 * Arquitetura Modular:
 * - state.js: Gerenciamento de estado global
 * - utils.js: Utilidades genéricas
 * - notifications.js: Sistema de notificações
 * - auth.js: Autenticação e cadastro
 * - ui.js: Controle de interface
 * - orcamentos.js: Lógica de orçamentos
 * - projetos.js: Gerenciamento de projetos
 * - events.js: Binding de eventos
 * 
 *************************************************/

// Função para garantir que DOM está pronto
function iniciarApp() {
  try {
    console.log("🚀 Iniciando aplicação...");

    // 1. Inicializar autenticação (carregar usuário salvo)
    if (window.AuthModule) {
      AuthModule.inicializar();
      console.log("✅ Autenticação inicializada");
    } else {
      console.error("❌ AuthModule não carregado");
      return;
    }

    // 2. Atualizar menu baseado no estado
    if (window.UIModule) {
      UIModule.menu.update();
      console.log("✅ Menu atualizado");
    } else {
      console.error("❌ UIModule não carregado");
      return;
    }

    // 3. Vincular todos os eventos
    if (window.EventsModule) {
      EventsModule.init();
      console.log("✅ Eventos vinculados");
    } else {
      console.error("❌ EventsModule não carregado");
      return;
    }

    // 4. Mostrar página inicial
    UIModule.page.show("home");
    console.log("✅ Página inicial carregada");

    console.log("🎉 Aplicação pronta!");
    
  } catch (erro) {
    console.error("❌ Erro ao iniciar aplicação:", erro);
  }
}

// Inicializar quando DOM estiver pronto
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", iniciarApp);
} else {
  // DOM já está pronto
  iniciarApp();
}
