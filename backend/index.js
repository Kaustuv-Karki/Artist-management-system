import { app } from "./app.js";
import { connectDB } from "./db/index.js";

const PORT = 5000;

connectDB()
  .then(() => {
    console.log("Connected to the database");
  })
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.log("Mongo db connection fail");
  });
