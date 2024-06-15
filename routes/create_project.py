from flask import render_template, request, redirect, session, Blueprint
from .database import db, User, Project


ed_project = Blueprint('edit_project', __name__)


@ed_project.route('/home/create_project', methods=['GET', 'POST'])
def create_project():
    user_id = session.get('user_id')
    user = User.query.get(user_id)
    user_name = user.name

    if request.method == 'GET': return render_template('create_project.html', user_name=user_name)
    else: 
        project_name = request.form['name_project']
        project_description = request.form['project_description']
        program_language = ','.join(request.form.getlist('programming_languages')) 
        direction = ','.join(request.form.getlist('directions'))
        public_project = True if request.form['public_project'] == 'True' else False
        if user_id:
            project = Project(user_id=user_id, project_name=project_name, project_description=project_description,
                                program_language=program_language, direction=direction, public_project=public_project)
            db.session.add(project)
            db.session.commit()

        return redirect('/home')