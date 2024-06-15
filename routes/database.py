from flask_sqlalchemy import SQLAlchemy
from flask_mail import Mail, Message
from datetime import datetime

db = SQLAlchemy()
mail = Mail()


class User(db.Model):
    user_id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(30), nullable=False, unique=True)
    email = db.Column(db.String(100), nullable=False, unique=True)
    password = db.Column(db.String(100), nullable=False)


class UserSkill(db.Model):
    __tablename__ = 'user_skill'
    user_id = db.Column(db.Integer, db.ForeignKey('user.user_id'), primary_key=True)
    program_language = db.Column(db.String, nullable=False)
    direction = db.Column(db.String, nullable=False)


class Project(db.Model):
    __tablename__ = 'project'
    project_id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.user_id'))
    project_name = db.Column(db.String, nullable=False)
    project_description = db.Column(db.String(500), nullable=False)
    program_language = db.Column(db.String, nullable=False)
    direction = db.Column(db.String, nullable=False)
    public_project = db.Column(db.Boolean, nullable=False)


class UserProject(db.Model):
    __tablename__ = 'user_project'
    project_id = db.Column(db.Integer, db.ForeignKey('project.project_id'), primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.user_id'), primary_key=True)


class Task(db.Model):
    __tablename__ = 'task'
    task_id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.user_id'), nullable=True)
    task_description = db.Column(db.String, nullable=False)
    task_status = db.Column(db.String, nullable=False)
    parent_id = db.Column(db.Integer, db.ForeignKey('task.task_id'), nullable=True)


class ProjectTask(db.Model):
    __tablename__ = 'project_task'
    project_id = db.Column(db.Integer, db.ForeignKey('project.project_id'), primary_key=True)
    task_id = db.Column(db.Integer, db.ForeignKey('task.task_id'), primary_key=True)


class Message(db.Model):
    __tablename__ = 'message'
    message_id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.user_id'), nullable=False)
    message_body = db.Column(db.String, nullable=False)
    message_time = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)


class ProjectMessage(db.Model):
    __tablename__ = 'project_message'
    project_id = db.Column(db.Integer, db.ForeignKey('project.project_id'), primary_key=True)
    message_id = db.Column(db.Integer, db.ForeignKey('message.message_id'), primary_key=True)


class QueryUser(db.Model):
    __tablename__ = 'query_user'
    query_id = db.Column(db.Integer, primary_key=True)
    project_id = db.Column(db.Integer, db.ForeignKey('project.project_id'), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('user.user_id'), nullable=False)
    create_id = db.Column(db.Integer, db.ForeignKey('user.user_id'), nullable=False)