/*************************************************
 * MÓDULO: NOTIFICATIONS (Notificações)
 * Responsabilidade: Sistema de notificações toast
 *************************************************/

const Notifications = (() => {
  const show = (mensagem, tipo = "info", duracao = 3000) => {
    const notif = document.createElement("div");
    const background = {
      sucesso: "var(--success)",
      erro: "var(--danger)",
      info: "var(--primary)"
    }[tipo] || "var(--primary)";

    notif.style.cssText = `
      position: fixed;
      top: 80px;
      right: 20px;
      padding: 1rem 1.5rem;
      background: ${background};
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
    }, duracao);
  };

  const sucesso = (msg) => show(msg, "sucesso");
  const erro = (msg) => show(msg, "erro");
  const info = (msg) => show(msg, "info");

  return { show, sucesso, erro, info };
})();

// Injetar animações CSS globalmente
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
