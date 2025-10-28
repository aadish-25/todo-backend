import app from "./app.js";
import { connectDB } from "./src/db/db.js";

connectDB()
  .then(() => {
    app.listen(process.env.PORT, () => {
      console.log(`Example app listening on http://localhost:${process.env.PORT}`);
    });
  })
  .catch((err) => {
    console.error("Cannot listen on PORT", err);
  });
