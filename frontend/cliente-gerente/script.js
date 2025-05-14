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

// Variável global para armazenar garçons
let garconsCadastrados = [];

// Função para carregar garçons
async function carregarGarcons() {
  try {
    const response = await fetch(`${API_BASE_URL}/garcons`);
    
    if (!response.ok) {
      throw new Error(`Erro ${response.status}: ${response.statusText}`);
    }
    
    const garcons = await response.json();
    const listaDiv = document.getElementById('lista-garcons');
    
    if (garcons.length === 0) {
      listaDiv.innerHTML = '<p>Nenhum garçom cadastrado.</p>';
      return;
    }

    let html = '<ul>';
    garcons.forEach(garcom => {
      html += `<li>${garcom.nome}</li>`;
    });
    html += '</ul>';

    listaDiv.innerHTML = html;
  } catch (error) {
    console.error('Erro ao carregar garçons:', error);
    showMessage(error.message, 'error');
  }
}

// Garante que a função tem o nome correto
document.addEventListener('DOMContentLoaded', carregarGarcons);

// Função para atualizar a exibição
function atualizarListaGarcons() {
  const listaDiv = document.getElementById('lista-garcons');
  
  if (garconsCadastrados.length === 0) {
    listaDiv.innerHTML = '<p>Nenhum garçom cadastrado.</p>';
    return;
  }

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
  
  garconsCadastrados.forEach(garcom => {
    html += `
      <tr>
        <td>${garcom.id}</td>
        <td>${garcom.nome}</td>
        <td>
          <button class="btn-excluir" data-id="${garcom.id}">
            Excluir
          </button>
        </td>
      </tr>
    `;
  });
  
  html += `</tbody></table>`;
  listaDiv.innerHTML = html;

  // Adiciona eventos aos botões de excluir
  document.querySelectorAll('.btn-excluir').forEach(btn => {
    btn.addEventListener('click', async (e) => {
      const id = e.target.getAttribute('data-id');
      const nome = garconsCadastrados.find(g => g.id == id)?.nome;
      
      if (confirm(`Tem certeza que deseja excluir o garçom ${nome}?`)) {
        await excluirGarcom(id);
      }
    });
  });
}

async function excluirGarcom(id) {
  try {
    const response = await fetch(`${API_BASE_URL}/gerente/garcons/${id}`, {
      method: 'DELETE'
    });

    const data = await response.json();
    
    if (response.ok) {
      showMessage(data.mensagem, 'success');
      await carregarGarcons(); // Recarrega a lista
    } else {
      showMessage(data.erro || 'Erro ao excluir garçom', 'error');
    }
  } catch (error) {
    console.error('Erro ao excluir:', error);
    showMessage('Erro ao conectar com o servidor', 'error');
  }
}
// Cadastrar novo garçom
document.getElementById('form-cadastrar-garcom').addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const nomeGarcom = document.getElementById('nome-garcom-cadastro').value.trim();
  
  if (!nomeGarcom) {
    showMessage('Por favor, insira o nome do garçom', 'error');
    return;
  }

  try {
    const response = await fetch(`${API_BASE_URL}/gerente/garcons`, {
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
      await carregarGarcons(); // Recarrega a lista após cadastro
    } else {
      showMessage(data.erro || 'Erro ao cadastrar garçom', 'error');
    }
  } catch (error) {
    console.error('Erro no cadastro:', error);
    showMessage('Erro ao conectar com o servidor', 'error');
  }
});

// Carrega os garçons quando a página é aberta
document.addEventListener('DOMContentLoaded', carregarGarcons);