api/ contains the backend APIs that interact with PostgreSQL and is built using Python (Flask)
ui/ contains the frontend of the Application built in React

Steps to run the code:

Database: 
Ensure that you have created the relations from create.sql and imported the data.

APIs:
1. cd api/
2. pip install -r requirements.txt
3. add your db configuration in api/.env
    db_host="localhost"
    database="databas name"
    db_user="user"
    db_password="pass"
4. flask run

Frontend:
1. cd ui/ 
2. npm install
3. npm start

Now, launch chrome and navigate to http://localhost:3000/ or the port that npm start would return.

If you've reached here then it means that you have completed all the step.
Now, enjoy the application! Book events, explore events! Go wild.