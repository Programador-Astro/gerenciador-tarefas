from . import db
from datetime import datetime

class Tarefa(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    titulo = db.Column(db.String(100), nullable=False)
    descricao = db.Column(db.Text, nullable=True)
    status = db.Column(db.String(20), default="pendente")
    data_criacao = db.Column(db.DateTime, default=datetime.utcnow)