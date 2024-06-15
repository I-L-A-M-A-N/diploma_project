from flask import render_template, request, redirect, session, Blueprint
from werkzeug.security import generate_password_hash
from .database import db, User, Message, mail
import random
import string


reset_pass = Blueprint('reset_pass', __name__)
confirmation_codes = {}


@reset_pass.route('/email_send', methods=['POST', 'GET'])
def email_send():
    
    if request.method == 'GET': return render_template('email-send.html')
    else:
        email = request.form.get('send_email')
        user = User.query.filter_by(email=email).first()
        if not user:
            error_message = 'Пользователь с таким email не найден'
            return render_template('info.html', error_or_success=error_message)
        else:
            session['email'] = email
            confirmation_code = ''.join(random.choices(string.digits, k=4))
            confirmation_codes[email] = confirmation_code
            print(confirmation_code)
            msg = Message('Код подтверждения почты', recipients=[email])
            msg.body = f'Ваш код подтверждения: {confirmation_code}'
            mail.send(msg)
            return redirect('/confirm_code')


@reset_pass.route('/confirm_code', methods=['POST', 'GET'])
def confirm_code():
    
    if request.method == 'GET': return render_template('confirm_email.html')
    else:
        email = session.get('email')
        entered_code = request.form.get('confirmation_code')
        error_confirm_code = 'Введенный код неверный'

        if confirmation_codes.get(email) == entered_code:
            del confirmation_codes[email]
            return redirect('/reset_password')
        else: return render_template('info.html', error_or_success=error_confirm_code)


@reset_pass.route('/reset_password', methods=['POST', 'GET'])
def reset_password():
    email = session.get('email')
    error_confirm_pass = 'Пароли не совпадают'

    if request.method == 'GET': return render_template('reset_password.html')
    else:
        new_password = request.form.get('new_password')
        confirm_password = request.form.get('confirm_password')

        if new_password != confirm_password: return render_template('info.html', error_or_success=error_confirm_pass)
        user = User.query.filter_by(email=email).first()
        user.password = generate_password_hash(new_password)
        db.session.commit()
        success_message = 'Пароль успешно изменен'
        return render_template('info.html', error_or_success=success_message)