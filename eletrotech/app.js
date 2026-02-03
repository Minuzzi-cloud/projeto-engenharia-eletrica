// Modelo de Serviço
class Servico {
    constructor(id, cliente, tipo, descricao, urgencia, data, status, localizacao) {
        this.id = id;
        this.cliente = cliente;
        this.tipo = tipo;
        this.descricao = descricao;
        this.urgencia = urgencia;
        this.data = data;
        this.status = status;
        this.localizacao = localizacao;
    }
}

// Array para armazenar serviços
let servicos = [];
let tiposServicos = [];

// Fallback para desenvolvimento local sem servidor
const fallbackServicos = [
    "Instalação Elétrica Residencial",
    "Manutenção de Sistemas Elétricos",
    "Reparo de Fiação",
    "Instalação de Tomadas e Interruptores",
    "Sistema de Iluminação",
    "Instalação de Ar Condicionado",
    "Reparo de Disjuntores",
    "Instalação de Painéis Solares",
    "Sistema de Segurança Elétrica",
    "Consultoria Elétrica"
];

// Detectar página atual
const page = document.body.dataset.page;

// Carregar dados do localStorage
function carregarDados() {
    const dados = localStorage.getItem('servicos');
    if (dados) {
        const parsed = JSON.parse(dados);
        servicos = parsed.map(s => new Servico(s.id, s.cliente, s.tipo, s.descricao, s.urgencia, s.data, s.status, s.localizacao));
    }
}

// Salvar dados no localStorage
function salvarDados() {
    localStorage.setItem('servicos', JSON.stringify(servicos));
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
        tiposServicos.forEach(tipo => {
            const option = document.createElement('option');
            option.value = tipo;
            option.textContent = tipo;
            tipoSelect.appendChild(option);
        });
    }
}

// Renderizar lista de serviços (usando map)
function renderizarServicos() {
    const servicesList = document.getElementById('services-list');
    if (!servicesList) return;

    servicesList.innerHTML = '';
    tiposServicos.map(tipo => {
        const col = document.createElement('div');
        col.className = 'col-md-4 mb-3';
        col.innerHTML = `
            <div class="card h-100">
                <div class="card-body">
                    <h5 class="card-title">${tipo}</h5>
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

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const formData = new FormData(form);
        const cliente = formData.get('cliente').trim();
        const tipo = formData.get('tipo');
        const descricao = formData.get('descricao').trim();
        const urgencia = formData.get('urgencia');

        if (!cliente || !tipo || !descricao || !urgencia) {
            mostrarMensagem('Por favor, preencha todos os campos.', 'danger');
            return;
        }

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
                localizacao
            );
            servicos.push(novoServico);
            salvarDados();
            form.reset();
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
                'Não disponível'
            );
            servicos.push(novoServico);
            salvarDados();
            form.reset();
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
