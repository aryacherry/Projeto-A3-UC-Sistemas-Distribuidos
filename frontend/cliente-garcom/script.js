const API_BASE_URL = 'http://localhost:3000/garcom';
let mesasData = [];

// Função para carregar o status das mesas
async function carregarMesas() {
    try {
        const response = await fetch(`${API_BASE_URL}/mesas`);
        mesasData = await response.json();

        if (response.ok) {
            atualizarVisualizacaoMesas();
        } else {
            showMessage('Erro ao carregar status das mesas', 'error');
        }
    } catch (error) {
        showMessage('Erro de conexão com o servidor', 'error');
    }
}

// Atualiza a visualização das mesas
function atualizarVisualizacaoMesas() {
    const container = document.getElementById('mesas-container');
    container.innerHTML = '';

    mesasData.forEach(mesa => {
        const mesaElement = document.createElement('div');
        mesaElement.className = `mesa ${mesa.ocupada ? 'ocupada' : ''}`;
        mesaElement.innerHTML = `
            <div style="font-size: 1.5rem; margin-bottom: 5px;">${mesa.numero_mesa}</div>
            <div>${mesa.ocupada ? 'OCUPADA' : 'LIVRE'}</div>
        `;

        // Adiciona evento de clique para liberar mesa ocupada
        if (mesa.ocupada) {
            mesaElement.addEventListener('click', () => liberarMesa(mesa.numero_mesa));
        }

        container.appendChild(mesaElement);
    });
}

// Função para liberar uma mesa
async function liberarMesa(numeroMesa) {
    if (confirm(`Deseja liberar a mesa ${numeroMesa}?`)) {
        try {
            const response = await fetch(`${API_BASE_URL}/mesas/${numeroMesa}/liberar`, {
                method: 'PUT'
            });

            const data = await response.json();

            if (response.ok) {
                showMessage(data.mensagem, 'success');
                carregarMesas(); // Recarrega as mesas após liberação
            } else {
                showMessage(data.erro, 'error');
            }
        } catch (error) {
            showMessage('Erro ao conectar com o servidor', 'error');
        }
    }
}

// Confirmar reserva (mantido do código anterior)
document.getElementById('form-confirmar').addEventListener('submit', async (e) => {
    e.preventDefault();

    const id = document.getElementById('id-reserva').value;
    const nomeGarcom = document.getElementById('nome-garcom').value;

    try {
        const response = await fetch(`${API_BASE_URL}/reservas/${id}/confirmar`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ nome_garcom: nomeGarcom })
        });

        const data = await response.json();

        if (response.ok) {
            showMessage(data.mensagem, 'success');
            document.getElementById('form-confirmar').reset();
            carregarMesas();
        } else {
            showMessage(data.erro, 'error');
        }
    } catch (error) {
        showMessage('Erro ao conectar com o servidor', 'error');
        console.error('Erro na chamada da API:', error);
    }
});

function showMessage(message, type) {
    const msgDiv = document.getElementById('mensagem');
    msgDiv.textContent = message;
    msgDiv.className = type;
    msgDiv.style.display = 'block';

    setTimeout(() => {
        msgDiv.style.display = 'none';
    }, 5000);
}

// Carrega as mesas inicialmente e a cada 10 segundos
carregarMesas();
setInterval(carregarMesas, 10000); // Atualiza a cada 10 segundos