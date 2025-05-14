const API_BASE_URL = 'http://localhost:3000/gerente';

document.getElementById('form-periodo').addEventListener('submit', async (e) => {
  e.preventDefault();

  const inicio = document.getElementById('inicio').value;
  const fim = document.getElementById('fim').value;
  const status = document.getElementById('status').value;

  // Validação no frontend
  if (new Date(inicio) > new Date(fim)) {
    showMessage('A data inicial não pode ser maior que a data final', 'error');
    return;
  }


  try {
    const response = await fetch(`${API_BASE_URL}/relatorio/periodo?inicio=${inicio}&fim=${fim}&status=${status}`);
    const data = await response.json();

    displayResult(data);
  } catch (error) {
    showMessage('Erro ao conectar com o servidor', 'error');
  }
});

document.getElementById('form-mesa').addEventListener('submit', async (e) => {
  e.preventDefault();
  const numero = document.getElementById('numero-mesa').value;

  try {
    const response = await fetch(`${API_BASE_URL}/relatorio/mesa/${numero}`);
    const data = await response.json();

    displayResult(data);
  } catch (error) {
    showMessage('Erro ao conectar com o servidor', 'error');
  }
});

document.getElementById('form-garcom').addEventListener('submit', async (e) => {
  e.preventDefault();
  const nome = document.getElementById('nome-garcom').value;

  try {
    const response = await fetch(`${API_BASE_URL}/relatorio/garcom/${nome}`);
    const data = await response.json();

    displayResult(data);
  } catch (error) {
    showMessage('Erro ao conectar com o servidor', 'error');
  }
});

function displayResult(data) {
  const resultadoDiv = document.getElementById('resultado');
  
  if (Array.isArray(data) && data.length > 0) {
    let html = `
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Data</th>
            <th>Hora</th>
            <th>Mesa</th>
            <th>Pessoas</th>
            <th>Responsável</th>
            <th>Status</th>
            <th>Garçom</th>
          </tr>
        </thead>
        <tbody>
    `;
    
    data.forEach(reserva => {
      // Adiciona classe CSS baseada no status
      const statusClass = reserva.status.toLowerCase();
      
      html += `
        <tr>
          <td>${reserva.id}</td>
          <td>${new Date(reserva.data).toLocaleDateString()}</td>
          <td>${reserva.hora}</td>
          <td>${reserva.numero_mesa}</td>
          <td>${reserva.qtd_pessoas}</td>
          <td>${reserva.nome_responsavel}</td>
          <td class="status-${statusClass}">${reserva.status.toUpperCase()}</td>
          <td>${reserva.garcom_responsavel || '-'}</td>
        </tr>
      `;
    });
    
    html += `</tbody></table>`;
    resultadoDiv.innerHTML = html;
  } else {
    resultadoDiv.innerHTML = `
      <div class="no-results">
        Nenhum resultado encontrado para os filtros selecionados.
      </div>
    `;
  }
}

function showMessage(message, type) {
  const resultadoDiv = document.getElementById('resultado');
  resultadoDiv.textContent = message;
  resultadoDiv.className = type;
}

// Cadastrar garçom
document.getElementById('form-cadastrar-garcom').addEventListener('submit', async (e) => {
  e.preventDefault();

  const nomeGarcom = document.getElementById('nome-garcom-cadastro').value.trim();

  if (!nomeGarcom) {
    showMessage('Por favor, insira o nome do garçom', 'error');
    return;
  }

  try {
    const response = await fetch('http://localhost:3000/gerente/garcons', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ nome: nomeGarcom })
    });

    const data = await response.json();

    if (response.ok) {
      showMessage(data.mensagem, 'success');
      document.getElementById('nome-garcom-cadastro').value = '';
      carregarGarcons(); // Atualiza a lista
    } else {
      showMessage(data.erro || 'Erro ao cadastrar garçom', 'error');
    }
  } catch (error) {
    console.error('Erro no cadastro:', error);
    showMessage('Erro ao conectar com o servidor', 'error');
  }
});

// Variável para armazenar a lista de garçons
let garconsCadastrados = [];

// Função para carregar a lista de garçons
async function carregarGarcons() {
  try {
    const response = await fetch(`${API_BASE_URL}/garcons`);
    if (!response.ok) throw new Error('Erro ao carregar garçons');
    
    garconsCadastrados = await response.json();
    renderizarListaGarcons();
  } catch (error) {
    console.error('Erro:', error);
    showMessage(error.message, 'error');
  }
}

// Função para renderizar a tabela com os garçons
function renderizarListaGarcons() {
  const container = document.getElementById('lista-garcons');
  
  if (garconsCadastrados.length === 0) {
    container.innerHTML = '<p>Nenhum garçom cadastrado.</p>';
    return;
  }

  // Cria a tabela com os dados
  let html = `
    <table class="tabela-garcons">
      <thead>
        <tr>
          <th>ID</th>
          <th>Nome</th>
          <th>Ações</th>
        </tr>
      </thead>
      <tbody>
  `;

  // Adiciona cada garçom como uma linha na tabela
  garconsCadastrados.forEach(garcom => {
    html += `
      <tr>
        <td>${garcom.id}</td>
        <td>${garcom.nome}</td>
        <td>
          <button class="btn-excluir" data-id="${garcom.id}">
            <i class="fas fa-trash-alt"></i> Excluir
          </button>
        </td>
      </tr>
    `;
  });

  html += `</tbody></table>`;
  container.innerHTML = html;

  // Adiciona os eventos de clique aos botões
  adicionarEventosExclusao();
}

// Função para adicionar eventos de exclusão
function adicionarEventosExclusao() {
  document.querySelectorAll('.btn-excluir').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const id = e.currentTarget.getAttribute('data-id');
      const nome = e.currentTarget.closest('tr').querySelector('td:nth-child(2)').textContent;
      confirmarExclusao(id, nome);
    });
  });
}

// Função para confirmar a exclusão
async function confirmarExclusao(id, nome) {
  if (confirm(`Tem certeza que deseja excluir o garçom "${nome}"?`)) {
    try {
      const response = await fetch(`${API_BASE_URL}/garcons/${id}`, {
        method: 'DELETE'
      });

      const data = await response.json();
      
      if (response.ok) {
        showMessage(`Garçom "${nome}" excluído com sucesso`, 'success');
        await carregarGarcons(); // Recarrega a lista
      } else {
        throw new Error(data.erro || 'Erro ao excluir');
      }
    } catch (error) {
      console.error('Erro ao excluir:', error);
      showMessage(error.message, 'error');
    }
  }
}

// Carrega os garçons quando a página é carregada
document.addEventListener('DOMContentLoaded', carregarGarcons);

async function cadastrarGarcom(nome) {
  try {
    const response = await fetch(`${API_BASE_URL}/garcons`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ nome })
    });

    const data = await response.json();
    
    if (response.ok) {
      showMessage(data.mensagem, 'success');
      await carregarGarcons(); // Recarrega a lista
      return true;
    } else {
      // Mensagem mais amigável para garçom existente
      if (data.erro.includes('já cadastrado')) {
        showMessage('Um garçom com este nome já está ativo no sistema', 'error');
      } else {
        showMessage(data.erro || 'Erro ao cadastrar', 'error');
      }
      return false;
    }
  } catch (error) {
    console.error('Erro:', error);
    showMessage('Erro de conexão com o servidor', 'error');
    return false;
  }
}