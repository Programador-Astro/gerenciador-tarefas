const API_URL = 'https://gerenciador-tarefas-3roz.onrender.com/';


// Carrega as tarefas
async function carregarTarefas() {
  const res = await fetch(API_URL);
  const tarefas = await res.json();

  const lista = document.getElementById('lista-tarefas');
  lista.innerHTML = '';

  tarefas.forEach(tarefa => {
    const li = document.createElement('li');
    li.className = 'list-group-item d-flex justify-content-between align-items-center';

    const statusClass = tarefa.status === 'concluída' ? 'success' : 'secondary';

    const div = document.createElement('div');
    div.innerHTML = `<strong>${tarefa.titulo}</strong> - ${tarefa.descricao} `;

    const statusSpan = document.createElement('span');
    statusSpan.className = `badge bg-${statusClass} ms-2`;
    statusSpan.textContent = tarefa.status;
    statusSpan.style.cursor = 'pointer';

    statusSpan.addEventListener('click', async () => {
      const novoStatus = tarefa.status === 'pendente' ? 'concluída' : 'pendente';

      await fetch(`${API_URL}/${tarefa.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: novoStatus })
      });

      carregarTarefas();
    });

    div.appendChild(statusSpan);

    const divBotoes = document.createElement('div');
    divBotoes.className = 'd-flex gap-2';

    const btnEdit = document.createElement('button');
    btnEdit.className = 'btn btn-sm btn-warning';
    btnEdit.innerHTML = '✏️';
    btnEdit.onclick = () => abrirModalEdicao(tarefa);

    const btnDelete = document.createElement('button');
    btnDelete.className = 'btn btn-sm btn-danger';
    btnDelete.innerHTML = '🗑️';
    btnDelete.onclick = () => deletarTarefa(tarefa.id);

    divBotoes.appendChild(btnEdit);
    divBotoes.appendChild(btnDelete);

    li.appendChild(div);
    li.appendChild(divBotoes);
    lista.appendChild(li);
  });
}

// Submissão do formulário (criação de tarefa)
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

// Deletar tarefa
async function deletarTarefa(id) {
  await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
  carregarTarefas();
}

// Edição via Modal
let tarefaEditando = null;

function abrirModalEdicao(tarefa) {
  tarefaEditando = tarefa;
  document.getElementById('editar-id').value = tarefa.id;
  document.getElementById('editar-titulo').value = tarefa.titulo;
  document.getElementById('editar-descricao').value = tarefa.descricao;

  const modal = new bootstrap.Modal(document.getElementById('modalEdicao'));
  modal.show();
}

document.getElementById('salvar-edicao').addEventListener('click', async () => {
  const id = document.getElementById('editar-id').value;
  const titulo = document.getElementById('editar-titulo').value;
  const descricao = document.getElementById('editar-descricao').value;

  await fetch(`${API_URL}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ titulo, descricao })
  });

  const modal = bootstrap.Modal.getInstance(document.getElementById('modalEdicao'));
  modal.hide();

  carregarTarefas();
});

// Inicia
carregarTarefas();
