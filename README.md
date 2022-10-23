## Asset Management System

### Setting up the app
### Install Dependencies

- Python 3.10 or latest

- Virtual Environment - Create virtual environment to management the app dependencies.

#### Install virtualenv
```
pip install virtualenv
```
#### Create virtual environment
```
virtualenv venv

```

#### Activate virtual environment
on linux/Mac
```
source venv/bin/activate
```

on windows powershell
```

venv\Scripts\activate.ps1

```
on windows CMD
```

venv\Scripts\activate.bat

```



PIP Dependencies - Once your virtual environment is setup and running, install the required dependencies:

```
pip install -r requirements.txt

```
### Key Pip Dependencies

- Flask
- SQLAlchemy


### Set up the Database
Install database i.e Mysql, SQLite, Postgresql

### Run the Server
Run the app using the virtual environment you created.

To run the server on Linux/Mac, execute:

```
export FLASK_APP=app.py
export FLASK_DEBUG=1
flask run --reload


The --reload flag will detect file changes and restart the server automatically.

```

To run the server on Windows, execute:

```
for powershell

env:FLASK_APP=app.py
env:FLASK_DEBUG=1
flask run --reload


for CMD

set FLASK_APP=app.py
set FLASK_DEBUG=1
flask run --reload


```


### Default username and password
```
username: admin
password: admin
```




### Additional PIP dependences for Database
for MYSQL
```
on windows run:

pip install mysqlclient


on linux

 sudo apt-get install mysql-client


on mac

 pip install MySQL-python or pip install mysqlclient


 ```
