# Skynox Task App

## An API built with Express and MongoDB.

- This API provides a secure user registration and login system which can persist the login state in the backend itself.
- Each user created in this environment will exist for after 5 minutes after creation.
- Use `token` provided by user-signup and user-login routes for Authorization.

## Installation

Install the node modules using npm in the application root.

```bash
npm install
```

### Development Environment

Create a `.env` file in `config` directory in root from `example.env` and add required config. keys for **local / development** environment

```bash
cp ./config/example.env ./config/.env
```

### Production Environment

No need to create `.env` file. Store the required config. keys on the **host / production** environment as per the `config/example.env` config. variables.

## Usage

Run the application using the following command for **Production** environment.

```bash
npm run start
```

Run the application **locally** (nodemon) using the following command for **Development** environment.

```bash
npm run dev
```

## Documentation

Navigate to the index route in the browser (ex: `http://localhost:3000` in development environment) to access the API documentation home page (SwaggerUI).

There you can find instructions and environment to perform the following operations:

- User signup/registration
- User login
- Read logged in user profile
- Logout user from current session (based on Bearer auth. token)
- Logout user from all sessions (depending on Bearer auth. token)

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.

## License

[MIT](https://choosealicense.com/licenses/mit/)
