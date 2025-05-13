const API_BASE_URL = 'http://localhost:3000/api';

// Funções de UI
function openTab(tabId, event) {
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });
    document.querySelectorAll('.tab-button').forEach(btn => {
        btn.classList.remove('active');
    });
    
    document.getElementById(tabId).classList.add('active');
    event.currentTarget.classList.add('active');
}

// API Helper
async function makeRequest(endpoint, method, body = null) {
    const options = {
        method,
        headers: {
            'Content-Type': 'application/json'
        },
        body: body ? JSON.stringify(body) : null
    };

    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, options);
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.error || 'Erro na requisição');
        }
        
        return data;
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
}

// Reserva Functions
async function createReservation(reservationData) {
    return makeRequest('/reservations', 'POST', {
        ...reservationData,
        tableNumber: parseInt(reservationData.tableNumber),
        peopleCount: parseInt(reservationData.peopleCount)
    });
}

async function loadReservations(filterDate = null) {
    try {
        const endpoint = filterDate 
            ? `/reports/period?start=${filterDate}&end=${filterDate}`
            : '/reservations';
        
        const { data } = await makeRequest(endpoint, 'GET');
        displayReservations(data);
    } catch (error) {
        showError('reservations-list', error);
    }
}

function displayReservations(reservations) {
    const container = document.getElementById('reservations-list');
    
    if (!reservations || !reservations.length) {
        container.innerHTML = '<p class="no-data">Nenhuma reserva encontrada</p>';
        return;
    }
    
    container.innerHTML = reservations.map(res => `
        <div class="reservation-card status-${res.status.toLowerCase()}">
            <h3>${res.clientName}</h3>
            <p><strong>Data:</strong> ${formatDate(res.date)} ${res.time}</p>
            <p><strong>Mesa:</strong> ${res.tableNumber}</p>
            <p><strong>Pessoas:</strong> ${res.peopleCount}</p>
            <p><strong>Status:</strong> ${res.status}</p>
            <div class="actions">
                ${res.status === 'PENDENTE' ? `
                    <button onclick="confirmReservation('${res.id}')">Confirmar</button>
                    <button onclick="cancelReservation('${res.id}')">Cancelar</button>
                ` : ''}
            </div>
        </div>
    `).join('');
}

// Funções de Relatório
async function generateReport(type) {
    try {
        let endpoint = '';
        let title = '';
        
        if (type === 'period') {
            const start = document.getElementById('start-date').value;
            const end = document.getElementById('end-date').value;
            
            if (!start || !end) {
                throw new Error('Preencha ambas as datas');
            }
            
            endpoint = `/reports/period?start=${start}&end=${end}`;
            title = `Relatório: ${formatDate(start)} à ${formatDate(end)}`;
        } else {
            const tableNumber = document.getElementById('table-number').value;
            
            if (!tableNumber) {
                throw new Error('Informe o número da mesa');
            }
            
            endpoint = `/reports/table/${tableNumber}`;
            title = `Relatório Mesa ${tableNumber}`;
        }
        
        const { data } = await makeRequest(endpoint, 'GET');
        displayReport(type === 'period' ? 'period-report' : 'table-report', data, title);
    } catch (error) {
        showError(`${type}-report`, error);
    }
}

// Funções auxiliares
function formatDate(dateString) {
    const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('pt-BR', options);
}

function showError(elementId, error) {
    const element = document.getElementById(elementId);
    element.innerHTML = `<p class="error">${error.message}</p>`;
    console.error(error);
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    // Formulário de reserva
    document.getElementById('reservation-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const formData = {
            responsibleName: document.getElementById('responsibleName').value,
            date: document.getElementById('date').value,
            time: document.getElementById('time').value,
            tableNumber: document.getElementById('tableNumber').value,
            peopleCount: document.getElementById('peopleCount').value
        };
        
        try {
            await createReservation(formData);
            alert('Reserva criada com sucesso!');
            e.target.reset();
            loadReservations();
        } catch (error) {
            alert(error.message);
        }
    });
    
    // Carrega dados iniciais
    loadReservations();
});