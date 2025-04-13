# How to set up Repo for Development:

##### installation
1. use wsl2
2. >> sudo apt update
3. >> sudo apt upgrade
4. >> sudo apt install npm
5. >> sudo apt install libpq-dev python3-dev
6. >> npm install --global yarn

##### setup backend
1. >> cd backend
2. >> sudo apt update
3. >> sudo apt install software-properties-common -y
4. >> sudo add-apt-repository ppa:deadsnakes/ppa -y
5. >> sudo apt update
6. >> sudo apt install python3.11 python3.11-venv python3.11-distutils
7. >> python3.11 -m venv "3.11venv"
8. >> source 3.11venv/bin/activate
9. >> python3.11 -m pip install --upgrade pip
10. >> python3.11 -m pip install -r requirements.txt
11. >> python3.11 backend.py

##### setup frontend
1. >> cd frontend
2. >> yarn install



# How to run the application:

##### start backend
1. >> cd backend
2. >> source venv/bin/activate
3. >> python3 backend.py

##### start frontend
1. >> cd frontend
2. >> yarn start