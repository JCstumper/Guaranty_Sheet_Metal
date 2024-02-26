# Steps to Setup and Start Project

1. Start PostgreSQL Container and Create Users Table
2. Start REST API
3. Start React Project

## Start PostgreSQL Container and Create Users Table

To start the PostgreSQL container using `docker-compose` you will need to comment out the services `api` and `frontend`.

Otherwise `docker-compose` will attempt to find the `dockerfile` for both and will fail to launch.

After commnenting out the services `api` and `frontend`, open up `Docker Desktop`. \
`Docker Desktop` can be minimized after opening.

Additonally, make sure you are in the `root` folder.

Next, run the following commands.

### `docker-compose up -d`

This will start the PostgreSQL container and will allow you to still use your current shell.

### `docker ps`

Will bring up a list of currently active containers. You'll want to copy the `CONTAINER ID`.

### `docker exec -it <CONTAINER ID> bash`

Will bring you into the bash shell that is on the container. Also, the `CONTAINER ID` will be different each time you use `docker-compose up`.

### `psql -U admin -d GuarantyDatabase`

This will log you into the PostgreSQL database as the `admin` user.

### `\c GuarantyDatabase`

Will connect you to the database. Allowing you to actually execute SQL queries.

### `create extension if not exists "uuid-ossp";`

Executing this command will allow us to use the `uuid_generate_v4()` function, which creates a randomized string. This will prevent data from clashing together for the `user_id`.

    CREATE TABLE users(
        user_id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        username VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        password VARCHAR(255) NOT NULL
    );

This will create the `users` table within the database.

## Start REST API

To start the REST API, you will first need to navigate to the `api` folder.

Once in the folder you can run the following command.

### `npm start`

This is a script made to execute `nodemon server.js`, which all it is doing is starting the server for the API.

## Start React Project

Once in the `testingUI` folder, start the REACT project by using the command:

### `npm start`

Since the REST API is currently setup to `PORT 3000`, the REACT project will ask if you want to run on a different `PORT`.

Type `y` and it will automatically set you up with a new `PORT` number.

## Registering a New User

You can register a new user in the `users` table by clicking the `Register` button at the bottom of the `Login` page.

Once on the `Register` page, enter the information on the screen and hit `Submit`.

Afterwards, it will take you to the `Login` page where you will be able to login into website.

## Signing In

Enter `Username` and `Password` to log into the website.

After entering in the information and pressing the `Login` button, it will take you to a `Dashboard` page, which at the moment does not include much.

## Tips

- To leave the GuarantyDatabase within the container, enter `exit` into the command line until you are back in your shell.

- To shutdown the container, type `docker compose down`.

- To stop the REST API hit `CTR`+`C`.