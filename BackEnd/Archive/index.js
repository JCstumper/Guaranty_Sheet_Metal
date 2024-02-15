const express = require("express");
const app = express();
const pool = require("./database");
const PORT = process.env.PORT || 5000;

app.use(express.json()); // => req.body

//ROUTES

//Get all todos

// app.get("/todos", async(req, res) => {
//     try {
//         const allTodos = await pool.query("SELECT * FROM todo");

//         res.json(allTodos.rows);
//     } 
//     catch (err) {
//         console.error(err.message);
//     }
// });

// //Get a todo

// app.get("/todos/:id", async (req, res) => {
//     const { id } = req.params;
//     try {
//         const todo = await pool.query("SELECT * FROM todo WHERE todo_id = $1", [id]);
        
//         res.json(todo.rows[0]); //Retrives a singular item
//     }
//     catch (err) {
//         console.err(err.message);
//     }

// });

// //Create a todo

// app.post("/todos", async(req, res) => {
//     try {
//         const {description} = req.body;
//         const newTodo = await pool.query("INSERT INTO todo (description) VALUES ($1) RETURNING *", [description]);

//         res.json(newTodo.rows[0]);
//     }
//     catch (err) {
//         console.error(err.message);
//     }
// });

// //Update a todo

// app.put("/todos/:id", async (req, res) => {
//     try {
//         const { id } = req.params;  //WHERE
//         const { description } = req.body;   //SET

//         const updateTDOD = await pool.query("UPDATE todo SET description = $1 WHERE todo_id = $2", [description, id]);

//         res.json("Todo was updated!");
//     }
//     catch (err) {
//         console.error(err.message);
//     }
// });

// //Delete a todo

// app.delete("/todos/:id", async (req, res) => {
//     try {
//         const { id } = req.params;
//         const deleteTodo = await pool.query("DELETE FROM todo WHERE todo_id = $1", [id]);

//         res.json("Todo was successfully deleted!");
//     }
//     catch (err) {
//         console.error(err.message);
//     }
// });

//Testing User Management

app.get("/status", (request, response) => {
    const status = {
        "Status": "Running"
    };

    response.send(status);
});


app.listen(PORT, () => {
    console.log("server is listening on PORT:", PORT);
});