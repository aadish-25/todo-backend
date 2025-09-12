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

     * Initialize the Express app.
     * Add `cors` middleware to allow requests from frontend.
     * Add `cookie-parser` to parse cookies for authentication.
     * Add `express.json()` to parse incoming JSON requests.
     * Serve static files from a `public` folder.

   * **Routes**:

     * Import your route files and mount them on appropriate paths (e.g., `/api/auth`).

   * **Export**:

     * Export the configured app so it can be used in `index.js`.

   **index.js** – Connect DB & Start Server

   * Configure environment variables using `dotenv`.
   * Import `app.js` and the `connectDB()` function.
   * Use a `try-catch` to connect to MongoDB.
   * Once the DB connection is successful, start the server on `process.env.PORT`.
   * Handle DB connection errors gracefully by logging and exiting the process.
