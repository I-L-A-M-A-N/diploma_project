from .database import db, User
from flask import render_template, request, redirect, session, Blueprint
from werkzeug.security import generate_password_hash, check_password_hash


login_bp = Blueprint('login', __name__)


@login_bp.route('/', methods=['POST', 'GET'])
@login_bp.route('/login', methods=['POST', 'GET'])
def index():
    
    if request.method == 'GET': return render_template('index.html')
    else:
        login_or_email = request.form.get('login_or_email')
        user_password = request.form.get('user_password')
        invalid_login_or_password = 'Неверный логин-почта или пароль'
        # Ищем пользователя по логину или email
        user = User.query.filter((User.name == login_or_email) | (User.email == login_or_email)).first()
        if not user or not check_password_hash(user.password, user_password):
            return render_template('info.html', error_or_success=invalid_login_or_password)
        session['user_id'] = user.user_id
        session['user_name'] = user.name
        return redirect('/home')
    

@login_bp.route('/register', methods=['POST'])
def register():
    name = request.form.get('username')
    email = request.form.get('email')
    password = request.form.get('password')
    error_name_or_email = 'Пользователь с таким логином уже существует'
    successfully = 'Пользователь успешно создан!'
    # Проверяем, существует ли пользователь с таким логином или email
    if User.query.filter((User.name == name) | (User.email == email)).first():
        return render_template('info.html', error_or_success=error_name_or_email)
    
    # Хэшируем пароль перед сохранением в базу данных
    hashed_password = generate_password_hash(password)
    new_user = User(name=name, email=email, password=hashed_password)
    db.session.add(new_user)
    db.session.commit()
    return render_template('info.html', error_or_success=successfully)
