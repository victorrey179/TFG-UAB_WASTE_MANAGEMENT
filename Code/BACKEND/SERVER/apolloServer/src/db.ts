import mongoose from "mongoose";

const MONGODB_URI =
  "mongodb+srv://vrg179:YX9ylPDH7xiqLhax@clusterbluecampus.vqohezp.mongodb.net/bluecampusDB";

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.error('error connection to MongoDB', error.message);
  });
