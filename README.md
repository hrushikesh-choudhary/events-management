# events-management
> The management systems for different types of event can be very challenging. The primary purpose of creating the database for the entertainment booking and purchase management system is to make the entire system of organizing and managing such events easy and in real-time. There are a number of benefits of using this database for such events. This system gets updated automatically so you can keep track of the number of tickets that have been sold out, tickets that are left, the number of presents and future events, and manage the payment methods with great ease. So, you just sit and relax and let this system do all hard work for you


`api/` contains the backend APIs that interact with PostgreSQL and is built using Python (Flask)

`frontend/` contains the frontend of the Application built in React

### Steps to run the code:

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
1. cd frontend/ 
2. npm install
3. npm start

Now, launch chrome and navigate to http://localhost:3000/ or the port that npm start would return.

If you've reached here then it means that you have completed all the step.
Now, enjoy the application! Book events, explore events! Go wild.
