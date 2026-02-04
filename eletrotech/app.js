// Modelo de Serviço
class Servico {
    constructor(id, cliente, tipo, descricao, urgencia, data, status, localizacao, valorTotal = 0, maoDeObra = 0, materiais = 0, urgenciaMultiplier = 1) {
        this.id = id;
        this.cliente = cliente;
        this.tipo = tipo;
        this.descricao = descricao;
        this.urgencia = urgencia;
        this.data = data;
        this.status = status;
        this.localizacao = localizacao;
        this.valorTotal = valorTotal;
        this.maoDeObra = maoDeObra;
        this.materiais = materiais;
        this.urgenciaMultiplier = urgenciaMultiplier;
    }
}

// Array para armazenar serviços
let servicos = [];
let tiposServicos = [];

// Fallback para desenvolvimento local sem servidor
const fallbackServicos = [
    {
        "name": "Instalação Elétrica Residencial",
        "baseLaborCost": 300,
        "pricingType": "fixed",
        "materials": []
    },
    {
        "name": "Manutenção de Sistemas Elétricos",
        "baseLaborCost": 250,
        "pricingType": "fixed",
        "materials": []
    },
    {
        "name": "Reparo de Fiação",
        "baseLaborCost": 200,
        "pricingType": "fixed",
        "materials": []
    },
    {
        "name": "Instalação de Tomadas e Interruptores",
        "baseLaborCost": 100,
        "pricingType": "variable",
        "materials": [
            {"name": "Tomada", "unitPrice": 50},
            {"name": "Interruptor", "unitPrice": 30}
        ]
    },
    {
        "name": "Sistema de Iluminação",
        "baseLaborCost": 400,
        "pricingType": "fixed",
        "materials": []
    },
    {
        "name": "Instalação de Ar Condicionado",
        "baseLaborCost": 500,
        "pricingType": "fixed",
        "materials": []
    },
    {
        "name": "Reparo de Disjuntores",
        "baseLaborCost": 150,
        "pricingType": "fixed",
        "materials": []
    },
    {
        "name": "Instalação de Painéis Solares",
        "baseLaborCost": 800,
        "pricingType": "fixed",
        "materials": []
    },
    {
        "name": "Sistema de Segurança Elétrica",
        "baseLaborCost": 600,
        "pricingType": "fixed",
        "materials": []
    },
    {
        "name": "Consultoria Elétrica",
        "baseLaborCost": 100,
        "pricingType": "fixed",
        "materials": []
    }
];

// Detectar página atual
const page = document.body.dataset.page;

// Carregar dados do localStorage
function carregarDados() {
    const dados = localStorage.getItem('servicos');
    if (dados) {
        const parsed = JSON.parse(dados);
        servicos = parsed.map(s => new Servico(s.id, s.cliente, s.tipo, s.descricao, s.urgencia, s.data, s.status, s.localizacao, s.valorTotal || 0, s.maoDeObra || 0, s.materiais || 0, s.urgenciaMultiplier || 1));
    }
}

// Salvar dados no localStorage
function salvarDados() {
    localStorage.setItem('servicos', JSON.stringify(servicos));
}

// Calcular preço do serviço
function calcularPreco(servicoNome, urgencia, qtdTomadas = 0, qtdInterruptores = 0) {
    const servico = tiposServicos.find(s => s.name === servicoNome);
    if (!servico) return { valorTotal: 0, maoDeObra: 0, materiais: 0, urgenciaMultiplier: 1 };

    let maoDeObra = servico.baseLaborCost;
    let materiais = 0;
    let urgenciaMultiplier = 1;

    // Aplicar multiplicador de urgência
    switch (urgencia) {
        case 'baixa':
            urgenciaMultiplier = 1;
            break;
        case 'media':
            urgenciaMultiplier = 1.2;
            break;
        case 'alta':
            urgenciaMultiplier = 1.4;
            break;
    }

    if (servico.pricingType === 'variable') {
        // Para serviços variáveis, calcular materiais baseado nas quantidades
        const tomada = servico.materials.find(m => m.name === 'Tomada');
        const interruptor = servico.materials.find(m => m.name === 'Interruptor');
        if (tomada) materiais += tomada.unitPrice * qtdTomadas;
        if (interruptor) materiais += interruptor.unitPrice * qtdInterruptores;
    }

    const valorTotal = (maoDeObra + materiais) * urgenciaMultiplier;

    return {
        valorTotal: Math.round(valorTotal * 100) / 100, // Arredondar para 2 casas decimais
        maoDeObra,
        materiais,
        urgenciaMultiplier
    };
}

// Carregar serviços via async/await
async function carregarServicosAsync() {
    try {
        const response = await fetch('services.json');
        if (!response.ok) {
            throw new Error('Erro ao carregar serviços');
        }
        tiposServicos = await response.json();
        if (page === 'services') {
            renderizarServicos();
        } else if (page === 'request') {
            popularTipoSelect();
        }
    } catch (error) {
        console.error('Erro ao carregar serviços:', error);
        // Usar dados de fallback para desenvolvimento local
        tiposServicos = fallbackServicos;
        if (page === 'services') {
            renderizarServicos();
        } else if (page === 'request') {
            popularTipoSelect();
        }
    }
}

// Popular select de tipos de serviço
function popularTipoSelect() {
    const tipoSelect = document.getElementById('tipo');
    if (tipoSelect) {
        tipoSelect.innerHTML = '<option value="">Selecione</option>';
        tiposServicos.forEach(servico => {
            const option = document.createElement('option');
            option.value = servico.name;
            option.textContent = servico.name;
            tipoSelect.appendChild(option);
        });
    }
}

// Renderizar lista de serviços (usando map)
function renderizarServicos() {
    const servicesList = document.getElementById('services-list');
    if (!servicesList) return;

    servicesList.innerHTML = '';
    tiposServicos.map(servico => {
        const col = document.createElement('div');
        col.className = 'col-md-4 mb-3';
        col.innerHTML = `
            <div class="card h-100">
                <div class="card-body">
                    <h5 class="card-title">${servico.name}</h5>
                    <p class="card-text">Serviço elétrico especializado oferecido pela EletroTech.</p>
                </div>
            </div>
        `;
        servicesList.appendChild(col);
        return col;
    });
}

// Renderizar solicitações (usando filter, sort, reduce)
function renderizarSolicitacoes() {
    const requestsList = document.getElementById('requests-list');
    if (!requestsList) return;

    requestsList.innerHTML = '';
    const solicitacoesAtivas = servicos.filter(s => s.status === 'pendente').sort((a, b) => {
        const urgenciaOrder = { alta: 3, media: 2, baixa: 1 };
        return urgenciaOrder[b.urgencia] - urgenciaOrder[a.urgencia];
    });

    if (solicitacoesAtivas.length === 0) {
        requestsList.innerHTML = '<div class="col-12"><div class="alert alert-info">Nenhuma solicitação pendente.</div></div>';
        return;
    }

    solicitacoesAtivas.forEach(solicitacao => {
        const col = document.createElement('div');
        col.className = 'col-md-6 mb-3';
        col.innerHTML = `
            <div class="card h-100">
                <div class="card-body">
                    <h5 class="card-title">${solicitacao.tipo}</h5>
                    <p class="card-text"><strong>Cliente:</strong> ${solicitacao.cliente}</p>
                    <p class="card-text"><strong>Descrição:</strong> ${solicitacao.descricao}</p>
                    <p class="card-text"><strong>Urgência:</strong> ${solicitacao.urgencia}</p>
                    <p class="card-text"><strong>Valor Total:</strong> R$ ${solicitacao.valorTotal.toFixed(2)}</p>
                    <p class="card-text"><small>Mão de obra: R$ ${solicitacao.maoDeObra.toFixed(2)} | Materiais: R$ ${solicitacao.materiais.toFixed(2)}</small></p>
                    <p class="card-text"><strong>Data:</strong> ${new Date(solicitacao.data).toLocaleString()}</p>
                    ${solicitacao.localizacao ? `<p class="card-text"><strong>Localização:</strong> ${solicitacao.localizacao}</p>` : ''}
                    <button class="btn btn-success" onclick="marcarComoConcluida(${solicitacao.id})">Marcar como Concluída</button>
                </div>
            </div>
        `;
        requestsList.appendChild(col);
    });

    // Usando reduce para contar solicitações por urgência
    const contagemUrgencia = solicitacoesAtivas.reduce((acc, s) => {
        acc[s.urgencia] = (acc[s.urgencia] || 0) + 1;
        return acc;
    }, {});
    console.log('Contagem por urgência:', contagemUrgencia);
}

// Obter localização usando Geolocation API
function obterLocalizacao() {
    return new Promise((resolve, reject) => {
        if (!navigator.geolocation) {
            reject(new Error('Geolocalização não suportada'));
            return;
        }
        navigator.geolocation.getCurrentPosition(
            position => resolve(`${position.coords.latitude.toFixed(4)}, ${position.coords.longitude.toFixed(4)}`),
            error => reject(error),
            { enableHighAccuracy: true, timeout: 10000 }
        );
    });
}

// Enviar formulário
function initForm() {
    const form = document.getElementById('service-form');
    if (!form) return;

    // Adicionar event listener para mostrar/ocultar campos dinâmicos
    const tipoSelect = document.getElementById('tipo');
    const dynamicFields = document.getElementById('dynamic-fields');

    tipoSelect.addEventListener('change', () => {
        const selectedService = tiposServicos.find(s => s.name === tipoSelect.value);
        if (selectedService && selectedService.pricingType === 'variable') {
            dynamicFields.style.display = 'block';
        } else {
            dynamicFields.style.display = 'none';
        }
    });

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const formData = new FormData(form);
        const cliente = formData.get('cliente').trim();
        const tipo = formData.get('tipo');
        const descricao = formData.get('descricao').trim();
        const urgencia = formData.get('urgencia');
        const qtdTomadas = parseInt(formData.get('qtdTomadas')) || 0;
        const qtdInterruptores = parseInt(formData.get('qtdInterruptores')) || 0;

        if (!cliente || !tipo || !descricao || !urgencia) {
            mostrarMensagem('Por favor, preencha todos os campos.', 'danger');
            return;
        }

        // Calcular preço
        const preco = calcularPreco(tipo, urgencia, qtdTomadas, qtdInterruptores);

        try {
            const localizacao = await obterLocalizacao();
            const novoServico = new Servico(
                Date.now(),
                cliente,
                tipo,
                descricao,
                urgencia,
                new Date().toISOString(),
                'pendente',
                localizacao,
                preco.valorTotal,
                preco.maoDeObra,
                preco.materiais,
                preco.urgenciaMultiplier
            );
            servicos.push(novoServico);
            salvarDados();
            form.reset();
            dynamicFields.style.display = 'none'; // Ocultar campos dinâmicos após submit
            mostrarMensagem('Solicitação enviada com sucesso!', 'success');
        } catch (error) {
            console.error('Erro ao obter localização:', error);
            const novoServico = new Servico(
                Date.now(),
                cliente,
                tipo,
                descricao,
                urgencia,
                new Date().toISOString(),
                'pendente',
                'Não disponível',
                preco.valorTotal,
                preco.maoDeObra,
                preco.materiais,
                preco.urgenciaMultiplier
            );
            servicos.push(novoServico);
            salvarDados();
            form.reset();
            dynamicFields.style.display = 'none'; // Ocultar campos dinâmicos após submit
            mostrarMensagem('Solicitação enviada com sucesso! (Localização não disponível)', 'success');
        }
    });
}

// Marcar solicitação como concluída (usando find)
function marcarComoConcluida(id) {
    const servico = servicos.find(s => s.id === id);
    if (servico) {
        servico.status = 'concluida';
        salvarDados();
        renderizarSolicitacoes();
        mostrarMensagem('Solicitação marcada como concluída!', 'success');
    }
}

// Mostrar mensagem usando Bootstrap Alert
function mostrarMensagem(mensagem, tipo) {
    const alertContainer = document.getElementById('alert-container') || document.body;
    const alert = document.createElement('div');
    alert.className = `alert alert-${tipo} alert-dismissible fade show position-fixed`;
    alert.style.cssText = 'top: 20px; right: 20px; z-index: 9999; min-width: 300px;';
    alert.innerHTML = `
        ${mensagem}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    alertContainer.appendChild(alert);
    setTimeout(() => {
        if (alert.parentNode) {
            alert.remove();
        }
    }, 5000);
}

// Inicialização baseada na página
document.addEventListener('DOMContentLoaded', () => {
    carregarDados();

    switch (page) {
        case 'home':
            // Nada específico para home
            break;
        case 'services':
            carregarServicosAsync();
            break;
        case 'request':
            carregarServicosAsync();
            initForm();
            break;
        case 'dashboard':
            renderizarSolicitacoes();
            break;
    }
});
