# My diploma project - 🧄(Garlic)🧄

## About the Project

   This web application for collaborative project development includes project and task management, real-time communication authentication, and security ...

## Demo

You can try the demo version of the project at [this link](https://ilaman.pythonanywhere.com/).

<hr>

## Installation

Instructions for installing the project on your local machine.

1. Clone the repository:
    ```bash
    git clone https://github.com/I-L-A-M-A-N/diploma_project.git
    ```
2. Navigate to the project directory:
    ```bash
    cd diploma_project/
    ```
3. Create a virtual environment:
    ```bash
    python -m venv venv
    ```
4. Activate the virtual environment:

    - On Windows:
        ```bash
        venv\Scripts\activate
        ```
    - On Unix or MacOS:
        ```bash
        source venv/bin/activate
        ```
5. Install the dependencies:
    - On Windows:
    ```bash
    pip install -r requirements.txt
    ```
    - On Unix:
    ```bash
    pip3 install -r requirements.txt
    ```
6. Create database:
   ```bash
   python3
   from manage import app, db
   app.app_context().push()
   db.create_all()
   exit()
   ```
7. Start the project:
    - On Windows:
    ```bash
    python manage.py
    ```
    - On Unix:
    ```bash
    python3 manage.py
    ```
<hr>
<h3 align='center'>autorization</h3>
<img src='static/gif/example1.gif'>
<h3 align='center'>chat</h3>
<img src='static/gif/example2.gif'>
