from flask import render_template, request, url_for, redirect, session, Blueprint, jsonify
from .database import db, User, UserSkill, Project, UserProject, Task, ProjectTask, Message, ProjectMessage, QueryUser
import requests

home_bp = Blueprint('home', __name__)


@home_bp.route('/', methods=['GET', 'POST'])
def login():
    user_id = session.get('user_id')
    user_name = session.get('user_name')
    projects_id = Project.query.filter_by(user_id=user_id).all()

    user_project_id = UserProject.query.filter_by(user_id=user_id).with_entities(UserProject.project_id).all()
    user_project_id_object = [id_[0] for id_ in user_project_id]
    user_projects = Project.query.filter(Project.project_id.in_(user_project_id_object)).all()
    projects_id.extend(user_projects)
    projects_info = []
    for project in projects_id:
        project_info = {
            'project_id': project.project_id,
            'project_name': project.project_name,
            'project_description': project.project_description,
            'program_language': project.program_language,
            'direction': project.direction
                        }
        projects_info.append(project_info)

    if request.method == 'GET': return render_template('home.html', user_name=user_name, projects_info=projects_info)
    else: return redirect('/home/<project_name>')


@home_bp.route('/account', methods=['GET', 'POST'])
def account():
    user_id = session.get('user_id')
    user = User.query.get(user_id)
    user_name = session.get('user_name')

    if request.method == 'GET':
        user_skill = UserSkill.query.filter_by(user_id=user_id).first()
        programming_languages = user_skill.program_language.split(',') if user_skill else []
        directions = user_skill.direction.split(',') if user_skill else []
        return render_template('account.html', user_name=user_name, programming_languages=programming_languages, directions=directions)
    else:
        new_user_name = request.form['user_name']  
        programming_languages = ','.join(request.form.getlist('programming_languages'))  
        directions = ','.join(request.form.getlist('directions'))
        user_skill = UserSkill.query.filter_by(user_id=user_id).first()

        if user_skill:
            user_skill.program_language = programming_languages
            user_skill.direction = directions
            db.session.merge(user_skill)  
            db.session.commit()
        else:
            user_skill = UserSkill(user_id=user_id, program_language=programming_languages, direction=directions)
            db.session.add(user_skill)
            db.session.commit()

        user.name = new_user_name
        db.session.commit()
        user_name = user.name
        session['user_name'] = user_name
        return redirect('/home')
    

@home_bp.route('/all_project')
def all_project():
    user_id = session.get('user_id')
    user_name = session.get('user_name')
    project_ids = UserProject.query.filter_by(user_id=user_id).with_entities(UserProject.project_id).all()
    project_ids = [row.project_id for row in project_ids]
    # Получаем список идентификаторов проектов, на которые пользователь отправил запрос на вступление
    queried_project_ids = QueryUser.query.filter_by(user_id=user_id).with_entities(QueryUser.project_id).all()
    queried_project_ids = [row.project_id for row in queried_project_ids]

    projects = Project.query.filter(
    Project.public_project==True, 
    Project.user_id != user_id, 
    ~Project.project_id.in_(project_ids),
    ~Project.project_id.in_(queried_project_ids)
).all()
    
    projects_info = []
    query_user_project= []

    for project in projects:
        project_info = {
            'project_id': project.project_id,
            'project_name': project.project_name,
            'project_description': project.project_description,
            'program_language': project.program_language,
            'direction': project.direction
                        }

        projects_info.append(project_info)
    
    return render_template('all_project.html', user_name=user_name, projects_info=projects_info)


@home_bp.route('/all_project/<int:project_id>', methods=['POST'])
def project_join(project_id):
    user_id = session.get('user_id')
    project = Project.query.filter_by(project_id=project_id).first()
    if project:
        create_id = project.user_id 
        user_query_join = QueryUser(project_id=project_id, user_id=user_id, create_id=create_id)
        db.session.add(user_query_join)    
        db.session.commit()
    
    return redirect('/home/all_project')


@home_bp.route('/all_project/action', methods=['POST'])
def query_join():
    create_id = session.get('user_id')
    data_query = request.json
    action = data_query.get('action')
    query_id = data_query.get('query_id')
    if action == 'reject':
        user_query = QueryUser.query.filter_by(query_id=query_id).first()
        db.session.delete(user_query)
        db.session.commit()
    else:
        user_query = QueryUser.query.filter_by(query_id=query_id).first()
        user_id = user_query.user_id
        project_id = user_query.project_id
        user_project = UserProject(project_id=project_id, user_id=user_id)
        db.session.add(user_project)
        db.session.delete(user_query)
        db.session.commit()
    
    return redirect('/home/all_project')



from flask_socketio import SocketIO, emit
from flask_socketio import send
socketio = SocketIO()


@socketio.on('new_task')
@home_bp.route('/<int:project_id>/<project_name>', methods=['GET', 'POST'])
def my_project(project_id, project_name):
    user_id = session.get('user_id')
    proj_id = project_id
    session['project_id'] = proj_id
    user_name = session.get('user_name')
    project_tasks = ProjectTask.query.filter_by(project_id=proj_id).all()
    query_joins = QueryUser.query.filter_by(project_id=proj_id).all()
    project = Project.query.get(project_id)
    create_id_project = project.user_id
    project_query = []
    for query_join in query_joins:
        query_id = query_join.query_id
        prjct_id = query_join.project_id
        create_id = query_join.create_id
        usr_id = query_join.user_id
        user_info = UserSkill.query.get(usr_id)
        id_for_name = User.query.get(usr_id)
        query_proj = {}
        if user_info:
            query_proj = {
                'query_id': query_id,
                'project_id': prjct_id,
                'create_id': create_id,
                'user_info': {
                    'user_id': user_info.user_id,
                    'program_lang': user_info.program_language,
                    'direction': user_info.direction,
                    'name': id_for_name.name
                    }
            }
            project_query.append(query_proj)

    projects_task_info = []
    for project_task in project_tasks:
        task_id = project_task.task_id
        task = Task.query.get(task_id)
        
        task_info = {}  # Инициализация переменной task_info

        if task:
            task_info = {
            'task_id': task.task_id,
            'user_id': task.user_id,
            'task_description': task.task_description,
            'task_status': task.task_status,
            'parent_id': task.parent_id
        }
        projects_task_info.append(task_info)

    project_messages = ProjectMessage.query.filter_by(project_id=proj_id).all()
    all_messages_project = []
    for project_message in project_messages:
        message_ids = project_message.message_id
        message = Message.query.get(message_ids)
        
        users_id = message.user_id
        users = User.query.get(users_id)
        users_name = users.name

        message_all = {}
        if message:
            message_all = {
                'message_id': message.message_id,
                'message_body': message.message_body,
                'message_time': message.message_time,
                'users_id': users_id,
                'users_name': users_name
            }
            all_messages_project.append(message_all)
    if request.method == 'GET': return render_template('my-project.html', user_name=user_name, user_id=user_id, project_id=project_id, 
                                                       project_name=project_name, projects_task_info=projects_task_info,
                                                       all_messages_project=all_messages_project, projects_query=project_query, create_id_project=create_id_project)
    
    else:
        task_json = request.json
        task_description = task_json.get('task_description')
        task_status = task_json.get('task_status')
        parent_id = task_json.get('parent_id')
        task = Task(task_description=task_description,user_id=user_id, task_status=task_status, parent_id=parent_id)
        db.session.add(task)
        db.session.commit()
        new_task_id = task.task_id  # Получаем идентификатор только что добавленной задачи
        new_project_task = ProjectTask(project_id=project_id, task_id=new_task_id)
        db.session.add(new_project_task)
        db.session.commit()  
      
        return jsonify({'message': 'Описание задачи успешно обновлено'}), 200

    
@home_bp.route('/leave_project', methods=['POST'])
def leave_project():
    project_id = session['project_id']
    user_id = session['user_id']
    user_project = UserProject.query.filter_by(project_id=project_id, user_id=user_id).first()
    db.session.delete(user_project)
    db.session.commit()
    return redirect('/home')


@home_bp.route('/option_project', methods=['GET', 'POST'])
def option_project() -> None:
    user_name = session['user_name']
    project_id = session['project_id']
    project = Project.query.get(project_id)
    projects_info = []
    if project:
        project_info = {}
        project_info = {
            'project_name': project.project_name,
            'project_description': project.project_description,
            'program_language': project.program_language,
            'direction': project.direction,
            'public_project': project.public_project
        }
        projects_info.append(project_info)
    if request.method == 'GET':
        return render_template('option_project.html', user_name=user_name, projects_info=projects_info)
    else:
        user_id = session['user_id']
        project_id = session['project_id']
        project_name = request.form['name_project']
        project_description = request.form['project_description']
        program_language = ','.join(request.form.getlist('programming_languages')) 
        direction = ','.join(request.form.getlist('directions'))
        public_project = True if request.form['public_project'] == 'True' else False
        existing_project = Project.query.filter_by(user_id=user_id).first()
        if existing_project:
            # Если проект существует, обновляем его атрибуты
            existing_project.project_name = project_name
            existing_project.project_description = project_description
            existing_project.program_language = program_language
            existing_project.direction = direction
            existing_project.public_project = public_project
            db.session.commit()

        return redirect(f'/home/{project_id}/{project_name}')



@home_bp.route('/<int:project_id>/<project_name>/<card_id>', methods=['DELETE', 'PATCH', 'POST'])
def edit_task(project_id, project_name, card_id):
    if request.method == "DELETE":
        task = Task.query.get(card_id)
        
        if task:
        # Удалите задачу
            db.session.delete(task)
    # Удалите связь задачи с проектом
            ProjectTask.query.filter_by(task_id=task.task_id).delete()
            related_tasks = Task.query.filter_by(parent_id=task.task_id).all()
            for related_task in related_tasks:
                db.session.delete(related_task)
                
            db.session.commit()

        return redirect(url_for('home.my_project', project_id=project_id, project_name=project_name, card_id=card_id))
    elif request.method == 'PATCH':
        new_description = request.json.get('task_description')
        task = Task.query.get(card_id)
        if task:
            # Обновите описание задачи
            task.task_description = new_description

            # Сохраните изменения в базе данных
            db.session.commit()

        # Верните успешный ответ (можете вернуть JSON, если это необходимо)
            return {'message': 'Описание задачи успешно обновлено'}, 200
        else:
        # Верните сообщение об ошибке, если задача не найдена
            return {'error': 'Задача с указанным идентификатором не найдена'}, 404
    else:
        data = request.json

        # Извлекаем данные о карточке и списке, куда она была перемещена
        card_id = data.get('card_id')
        list_name = data.get('list_name')
        parent_id = data.get('parent_id')

        # Обновляем данные карточки в базе данных
        task = Task.query.get(card_id)
        if task:
            task.task_status = list_name
            task.parent_id = parent_id
            db.session.commit()

            # Отправляем ответ об успешном обновлении
            return {'message': 'Данные о карточке успешно обновлены'}, 200
        else:
            # Если карточка не найдена, отправляем ошибку
            return {'error': 'Карточка с указанным ID не найдена'}, 404



@home_bp.route('/<int:project_id>/<project_name>/chat', methods=['DELETE', 'POST', 'GET'])
def chat(project_id, project_name):
    
    if request.method == 'GET':

        return {}
        
    elif request.method == 'POST':
        user_id = session.get('user_id')
        message_body = request.json.get('message')
        message = Message(user_id=user_id, message_body=message_body)
        db.session.add(message)
        db.session.commit()
        project_message = ProjectMessage(project_id=project_id, message_id=message.message_id)
        db.session.add(project_message)
        db.session.commit()
        return {"message_id": message.message_id}, 201
    else:
        message_id = request.json.get('message_id')
        message = Message.query.get(message_id)
        if message:
            db.session.delete(message)
            ProjectMessage.query.filter_by(message_id=message.message_id).delete()
            
        db.session.commit()
        return {"message": 'Task delete'}, 200




METERED_SECRET_KEY = "This is your secret key profile metered"
METERED_DOMAIN = "yourdomain.metered.live"


@home_bp.route('/video/chat', methods=['GET'])
def video_chat():
    
    return render_template('video_chat.html')


@home_bp.route("/api/create-room", methods=['POST'])
def create_room(project_name):
    room_name = {'roomName': project_name}
    response = requests.post(f"https://{METERED_DOMAIN}.metered.live/api/v1/room", 
                             params={"secretKey": METERED_SECRET_KEY},
                             json=room_name)
    room_data = response.json()
    return jsonify(room_data)

# API endpoint to validate a meeting room
@home_bp.route("/api/validate-room", methods=['POST'])
def validate_room():
    room_name = request.json.get("roomName")
    if room_name:
        response = requests.get(f"https://{METERED_DOMAIN}.metered.live/api/v1/room/{room_name}", params={"secretKey": METERED_SECRET_KEY})
        room_data = response.json()
        if room_data.get("roomName"):
            return jsonify({"roomFound": True})
    return jsonify({"roomFound": False})


@socketio.on('message')
def handle_message(*args):
    print("Received message: ", args[0])
    if args[0] != "User connected!":
        send(args, broadcast=True)


@socketio.on('create_task')
def handle_task_creation(data):
    emit('card_created', data, broadcast=True)


@socketio.on('delete_task')
def handle_delete_task(data):
    emit('delete_card', data, broadcast=True)

@socketio.on('edit_task')
def handle_edit_task(data):
    emit('task_edit', data, broadcast=True)


@socketio.on('drop_task')
def handle_drop_task(data):
    print('drop', data)
    emit('task_drop', data, broadcast=True)

