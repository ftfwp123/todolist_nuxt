import express from "express";
import { Pool } from "pg";
import cors from "cors";
import { Request, Response } from "express";

const app = express();
const port = 3001;

// Middleware
app.use(cors());
app.use(express.json());

const pool = new Pool({
	user: "postgres", // Replace with your PostgreSQL username
	host: "localhost", // Replace with your PostgreSQL host
	database: "postgres", // Replace with your database name
	password: "new_password", // Replace with your PostgreSQL password ==> use alter command for change the password
	port: 5432, // Replace with your PostgreSQL port
});

console.log(pool, "pool");

app.get("/api/users", async (req: Request, res: Response) => {
	try {
		const { rows } = await pool.query("SELECT * FROM users");
		res.json(rows);
		// should use bcryptjs to match the password token
	} catch (error) {
		res.status(400).send("Bad request");
	}
});

app.post("/api/users", async (req: Request, res: Response) => {
	try {
		const { username, password, email } = req.body;
		const result = await pool.query("INSERT INTO users (username, password, email) VALUES ($1, $2, $3) RETURNING *", [
			username,
			password,
			email,
		]);
		res.status(201).json({
			message: "User created successfully",
			user: result.rows[0],
		});
	} catch (error) {
		console.error("Error inserting user:", error);
		res.status(500).json({ message: "Internal server error" });
	}
});

app.delete("/api/users/:username", async (req: Request, res: Response) => {
	try {
		const { username } = req.params;
		console.log(username);

		await pool.query("DELETE FROM users WHERE username = $1 RETURNING *", [username]);

		res.json({
			message: "User deleted successfully",
		});
	} catch (error) {
		console.error("Error deleting user:", error);
		res.status(500).json({ message: "Internal server error" });
	}
});

// create /api/boards that return the value

// comment something
// comment something #2
// comment something

app.listen(port, () => {
	console.log(`Backend server running on http://localhost:${port}`);
});

// use \c to alter database (parent of the tables);
// use \du for existing user
// check database list \l
// use drop table to remove table
// next step ==> question add the table
// next step ===> create table users
// database \l
// - list element \dt
