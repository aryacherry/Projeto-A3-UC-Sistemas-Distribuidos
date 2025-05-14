const API_BASE_URL = 'http://localhost:3000/atendente';

document.getElementById('form-reserva').addEventListener('submit', async (e) => {
    e.preventDefault();

    const dataInput = document.getElementById('data').value;
    const dataReserva = new Date(dataInput);
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);

    // Validação no frontend
    if (dataReserva < hoje) {
        showMessage('Não é possível fazer reservas para datas passadas', 'error');
        return;
    }

    if (dataReserva.getFullYear() < hoje.getFullYear()) {
        showMessage('Não é possível fazer reservas para anos anteriores', 'error');
        return;
    }

    const reserva = {
        data: document.getElementById('data').value,
        hora: document.getElementById('hora').value,
        numero_mesa: document.getElementById('numero-mesa').value,
        qtd_pessoas: document.getElementById('qtd-pessoas').value,
        nome_responsavel: document.getElementById('nome-responsavel').value
    };

    try {
        const response = await fetch(`${API_BASE_URL}/reservas`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(reserva)
        });

        const data = await response.json();

        if (response.ok) {
            showMessage(data.mensagem, 'success');
            document.getElementById('form-reserva').reset();
        } else {
            showMessage(data.erro, 'error');
        }
    } catch (error) {
        showMessage('Erro ao conectar com o servidor', 'error');
    }
});

document.getElementById('form-cancelar').addEventListener('submit', async (e) => {
    e.preventDefault();
    const id = document.getElementById('id-reserva').value;

    try {
        const response = await fetch(`${API_BASE_URL}/reservas/${id}`, {
            method: 'DELETE'
        });

        const data = await response.json();

        if (response.ok) {
            showMessage(data.mensagem, 'success');
            document.getElementById('form-cancelar').reset();
        } else {
            showMessage(data.erro, 'error');
        }
    } catch (error) {
        showMessage('Erro ao conectar com o servidor', 'error');
    }
});

function showMessage(message, type) {
    const msgDiv = document.getElementById('mensagem');
    msgDiv.textContent = message;
    msgDiv.className = type;
}