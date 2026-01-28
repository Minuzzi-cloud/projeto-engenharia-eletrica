/*************************************************
 * MÓDULO: ORCAMENTOS (Orçamentos)
 * Responsabilidade: Gerenciar cálculo de orçamentos
 *************************************************/

const OrcamentosModule = (() => {
  const tabelaValores = {
    residencial: 25,
    comercial: 35
  };

  const calcular = (tipo, area) => {
    if (!tipo || !area || area < 10) {
      Notifications.erro("Tipo de obra e área válida são obrigatórios");
      return null;
    }

    const valorM2 = tabelaValores[tipo];
    if (!valorM2) {
      Notifications.erro("Tipo de obra inválido");
      return null;
    }

    const total = valorM2 * area;
    return { valorM2, total, tipo, area };
  };

  const exibir = (resultado) => {
    if (!resultado) return;

    Utils.$("valor-m2").textContent = `R$ ${resultado.valorM2}`;
    Utils.$("valor-total").textContent = `R$ ${resultado.total}`;
    Utils.$("resultado-orcamento").hidden = false;
  };

  const limpar = () => {
    Utils.$("resultado-orcamento").hidden = true;
    Utils.$("form-orcamento").reset();
  };

  return {
    calcular,
    exibir,
    limpar,
    getValores: () => ({ ...tabelaValores })
  };
})();
