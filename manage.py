from flask import Flask
from routes.database import db, mail
from routes.login import login_bp
from routes.home import home_bp, socketio
from routes.reset_password import reset_pass
from routes.create_project import ed_project



app = Flask(__name__, template_folder='templates', static_folder='static', static_url_path='/')

app.config["SQLALCHEMY_DATABASE_URI"] = 'sqlite:///test.db' 
app.config['MAIL_SERVER'] = 'smtp.mail.ru'
app.config['MAIL_PORT'] = 465  # или 587
app.config['MAIL_USE_SSL'] = True 
app.config['MAIL_USERNAME'] = 'your@mail.ru'
app.config['MAIL_PASSWORD'] = 'yourPassword'
app.config['MAIL_DEFAULT_SENDER'] = 'your@mail.ru'
app.config['SECRET_KEY'] = 'HighSecretKey'

app.register_blueprint(login_bp)
app.register_blueprint(home_bp, url_prefix='/home')
app.register_blueprint(reset_pass)
app.register_blueprint(ed_project)

socketio.init_app(app)
mail.init_app(app)
db.init_app(app)


if __name__=='__main__':
    socketio.run(app, debug=True)