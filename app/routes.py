from flask import Blueprint, jsonify, request, render_template
from .models import Tarefa
from . import db
main = Blueprint('main', __name__)






@main.route("/")
def home():
    return render_template("index.html")



@main.route("/tarefas", methods=["GET"])
def listar_tarefas():
    tarefas = Tarefa.query.all()
    lista = []
    for tarefa in tarefas:
        lista.append({
            "id": tarefa.id,
            "titulo": tarefa.titulo,
            "descricao": tarefa.descricao,
            "status": tarefa.status,
            "data_criacao": tarefa.data_criacao.strftime("%Y-%m-%d %H:%M:%S")
        })
    return jsonify(lista)


@main.route("/tarefas", methods=["POST"])
def criar_tarefa():
    dados = request.get_json()

    nova_tarefa = Tarefa(
        titulo=dados.get("titulo"),
        descricao=dados.get("descricao"),
        status=dados.get("status", "pendente")
    )

    db.session.add(nova_tarefa)
    db.session.commit()

    return jsonify({
        "mensagem": "Tarefa criada com sucesso!",
        "tarefa": {
            "id": nova_tarefa.id,
            "titulo": nova_tarefa.titulo,
            "descricao": nova_tarefa.descricao,
            "status": nova_tarefa.status,
            "data_criacao": nova_tarefa.data_criacao.strftime("%Y-%m-%d %H:%M:%S")
        }
    }), 201




@main.route("/tarefas/<int:id>", methods=["PUT"])
def atualizar_tarefa(id):
    tarefa = Tarefa.query.get_or_404(id)
    dados = request.json

    if 'status' in dados:
        tarefa.status = dados['status']
        db.session.commit()
        return jsonify({'mensagem': 'Tarefa atualizada com sucesso'}), 200
    else:
        return jsonify({'erro': 'Status não fornecido'}), 400



@main.route("/tarefas/<int:id>", methods=["DELETE"])
def deletar_tarefa(id):
    tarefa = Tarefa.query.get_or_404(id)

    db.session.delete(tarefa)
    db.session.commit()

    return jsonify({"mensagem": f"Tarefa {id} excluída com sucesso!"})



