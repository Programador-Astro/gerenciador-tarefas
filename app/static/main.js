const API_URL = 'http://localhost:5000/tarefas';

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

    // Criar container para os botões
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

// Modal de edição (você pode ajustar o estilo no HTML)
function abrirModalEdicao(tarefa) {
  const novoTitulo = prompt('Novo título:', tarefa.titulo);
  const novaDescricao = prompt('Nova descrição:', tarefa.descricao);

  if (novoTitulo !== null && novaDescricao !== null) {
    fetch(`${API_URL}/${tarefa.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        titulo: novoTitulo,
        descricao: novaDescricao
      }),
    })
    .then(res => res.json())
    .then(() => carregarTarefas());
  }
}

carregarTarefas();