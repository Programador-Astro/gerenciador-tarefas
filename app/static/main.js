
const API_URL = 'http://localhost:5000/tarefas';

async function carregarTarefas() {
  const res = await fetch(API_URL);
  const tarefas = await res.json();

  const lista = document.getElementById('lista-tarefas');
  lista.innerHTML = '';

  tarefas.forEach(tarefa => {
    const li = document.createElement('li');
    li.className = 'list-group-item d-flex justify-content-between align-items-center';
    li.innerHTML = `
      <div>
        <strong>${tarefa.titulo}</strong> - ${tarefa.descricao}
        <span class="badge bg-${tarefa.status === 'concluída' ? 'success' : 'secondary'} ms-2">${tarefa.status}</span>
      </div>
      <button class="btn btn-sm btn-danger" onclick="deletarTarefa(${tarefa.id})">🗑️</button>
    `;
    lista.appendChild(li);
  });
}

document.getElementById('form-tarefa').addEventListener('submit', async (e) => {
  e.preventDefault();
  const titulo = document.getElementById('titulo').value;
  const descricao = document.getElementById('descricao').value;
  const status = document.getElementById('status').value;

  await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ titulo, descricao, status })
  });

  document.getElementById('form-tarefa').reset();
  carregarTarefas();
});

async function deletarTarefa(id) {
  await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
  carregarTarefas();
}

carregarTarefas();