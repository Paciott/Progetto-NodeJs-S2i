// Imports
import express from 'express';
import { usersRouter} from './routes/users.js';
import { postsRouter} from './routes/posts.js';
import { interactionsRouter} from './routes/interactions.js';
import dotenv from 'dotenv';
dotenv.config();

// Express configuration
const app = express();
const port = process.env.PORT || 3000;
app.use(express.json());

app.get("/", (req, res) => {
  res.status(200).send("Hello there! App is working correctly!");
});

// Routes initialization fro CRUD operations
app.use("/users", usersRouter);
app.use("/posts", postsRouter);
app.use("/interactions", interactionsRouter);

// Fallback for non existing routes
app.use((req, res) => {
  res.status(404).send("Sorry, this page doesn't exist!");
});

// Server
app.listen(port, () => {
  console.log(`App launched on port ${port}!`)
})