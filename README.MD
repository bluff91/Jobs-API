Jobs API project made in Node.Js using Express and MongoDB with user registration and authentification deployed on Render https://myapi-s0xb.onrender.com

Key Features:

- User registration via email(unique) and password
- User name, email and hashed password saved with mongoose in the mongoDB database
- For each user a token is generated in order to make sure he has access only to his data
- Each user is able to access the Jobs routes (CRUD) if crendtials are provided
- Each job is linked to the users via the createdBy key
- Custom Error messages and correct status codes for each potential Error
- Security assured by adding and using helmet, express-rate-limit, cors and xss-clean

Packages used: nodeMon, jsonwebtoken, bcryptjs, helmet, cors, xss-clean, express-rate-limit, dotenv, http-status-codes, mongoose, -express, express-async-errors, swaggerui-express, yamljs