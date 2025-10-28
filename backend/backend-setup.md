# Backend Setup Instructions

1. **Initialize Project**
   Run `npm init` in the **root repo only** (do **not** run it separately in the backend folder).
   *Assumption: your project-root has two folders: `frontend` and `backend`.*

2. **Install Packages & Update Scripts**
   Install the necessary packages and update your `package.json` scripts:

   ```json
   "scripts": {
       "dev": "nodemon backend/index.js",
       "start": "node backend/index.js"
   }
   ```

3. **Backend Folder Setup**
   Move to the `backend` folder, then create:

   * `.gitignore`
   * `.env`

4. **Create Folders**
   Create the following folders inside `backend`:

   * `middleware`
   * `utils`
   * `db`
   * `controllers`
   * `routes`
   * `models`

5. **Database Connection**
   Inside the `db` folder, create `connectDB.js`:

   * Export a function `connectDB()` to connect to MongoDB using Mongoose.
   * Use `process.env.MONGODB_URI` from your `.env`.
   * Handle connection success and errors.

6. **Express App & Server Structure**

   **app.js** – Initialize Express App

   * **Imports & Setup**:

     * Initialize the Express app and add all the necessary middlewares.
     * Configure environment variables using `dotenv` - <code>dotenv.config({ path: './.env' })</code>
     * Add `cors` middleware to allow requests from frontend.
     * Add `cookie-parser` to parse cookies for authentication.
     * Add `express.json()` to parse incoming JSON requests.
     * Serve static files from a `public` folder.

   * **Routes**:

     * Import your route files and mount them on appropriate paths (e.g., `/api/auth`).

   * **Export**:

     * Export the configured app so it can be used in `index.js`.

   **index.js** – Connect to DB using the connectDB() using then-catch

   * Import `app.js` and the `connectDB()` function.
   * Use a `try-catch` to connect to MongoDB.
   * Once the DB connection is successful, start the server on `process.env.PORT`.
   * Handle DB connection errors gracefully by logging and exiting the process.



## Setting up Authentication and related functionalities


### Register a user
1. Create an API endpoint to accept user details (like name, email, username, password, and optionally profile images).
2. Validate that all required fields are provided and that the email/username is unique.
3. (Optional) Upload profile images to a storage service (e.g., Cloudinary).
4. Hash the user's password before saving to the database.
5. Save the new user to your database and return a response (never include the password in the response).

### Login a user
1. Create an API endpoint to accept login credentials (username/email and password).
2. Find the user in the database and compare the provided password with the hashed password.
3. Before logging in, check if the user is already logged in by verifying if a valid refresh token exists in cookies or the database. If so, you may want to prevent duplicate logins or handle accordingly.
4. If valid, generate authentication tokens (like JWT access and refresh tokens).
5. Send tokens to the client (often as HTTP-only cookies for security).
> **Note:** Always check for existing login sessions (e.g., via cookies or stored refresh tokens) to avoid multiple active sessions for the same user, as shown in the provided JS files.

### Logout a user
1. Create an endpoint to handle logout requests.
2. Invalidate the user's refresh token (e.g., remove it from the database or set it to null).
3. Clear authentication cookies on the client.
4. Make sure to check for the presence of authentication cookies or tokens before attempting to log out, and handle cases where the user is not logged in.
> **Note:** Properly handle logout requests only for users who are actually logged in (i.e., have valid cookies/tokens), as demonstrated in the JS files.

### Setting up an auth middleware
1. Write a middleware function to check for a valid authentication token (usually a JWT) in cookies or headers.
2. Verify the token using your secret key.
3. If valid, attach the user info to the request object (commonly as `req.user`) and allow access to protected routes.
4. If invalid or missing, block access and return an error.

### Refreshing Access Tokens
1. Create an endpoint to accept a refresh token (from cookies or request body).
2. Verify the refresh token and ensure it matches the one stored for the user.
3. If valid, generate and return a new access token (and optionally a new refresh token).
4. Send the new tokens to the client (again, usually as HTTP-only cookies).

### Generating Access and Refresh Tokens
1. Use a library like `jsonwebtoken` to generate JWTs for authentication.
2. Store the refresh token securely (e.g., in the database, associated with the user).
3. Always keep your secret keys safe and never expose them in your codebase.