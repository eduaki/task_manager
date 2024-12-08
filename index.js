const express = require("express");
const db = require("./db");

const app = express();
const port = process.env.SERVER_PORT || 3000;

app.use(express.json());

app.get("/login", (req, res) => {
	/// faz login do usuário
	const { mail, password } = req.body;
	const sqlScript =
		"SELECT * FROM users WHERE user_mail = ? && user_password = ?";

	let isAdmin;
	let user_id;

	db.query(sqlScript, [mail, password], (err, results) => {
		if (err) {
			if (err) throw err;
		}

		if (!results.length > 0) {
			res.cookie("user_loged", false);
			res.clearCookie("user_admin");
			return res.status(404).json({ error: "usuario não encontrado" });
		}

		results[0].isAdmin ? (isAdmin = true) : (isAdmin = false);
		user_id = results[0].user_id;

		res.cookie("user_admin", isAdmin);
		res.cookie("user_loged", true);
		res.cookie("user_id", user_id);

		return res.status(200).json({ done: "usuario logado com sucesso" });
	});
});

app.post("/tasks/newtask", (req, res) => {
	/// adiciona uma nova task no banco
	const sqlScript = "INSERT INTO tasks (task_name, ct_user_id) values (?, ?)";
	const { taskname } = req.body;
	const cookieString = req.headers.cookie;

	if (cookieString) {
		const cookies = cookieString.split(";").map((c) => {
			const [name, ...rest] = c.split("=");
			return { name: name.trim(), value: rest.join("=") };
		});

		cookies.forEach((c) => {
			if (c.name === "user_loged" && c.value === "false") {
				return res
					.status(401)
					.json({ error: "você precisa estar logado pra fazer essa ação" });
			}
			if (c.name === "user_id") {
				db.query(sqlScript, [taskname, c.value], (err, results) => {
					if (err) throw err;
					return res.status(200).send(results);
				});
			}
		});
	} else {
		return res
			.status(401)
			.json({ error: "você precisa estar logado pra fazer essa ação" });
	}
});

app.get("/tasks", (req, res) => {
	/// lista todas as tasks do banco
	const sqlScript = "SELECT * FROM tasks";

	db.query(sqlScript, (err, results) => {
		if (err) throw err;
		res.status(200).send(results);
	});
});

app.delete("/tasks", (req, res) => {
	/// apaga uma task atravez do ID
	const sqlScript = "DELETE FROM tasks WHERE task_id = ?";
	const cookieString = req.headers.cookie;
	const { task_id } = req.body;

	if (cookieString) {
		const cookies = cookieString.split(";").map((c) => {
			const [name, ...rest] = c.split("=");
			return { name: name.trim(), value: rest.join("=") };
		});

		cookies.forEach((c) => {
			if (c.name === "user_loged" && c.value === "false") {
				return res
					.status(401)
					.json({ error: "você precisa estar logado pra fazer essa ação" });
			}

			db.query(
				"SELECT * FROM tasks WHERE task_id = ?",
				[task_id],
				(err, results) => {
					if (err) throw err;

					if (!results.length > 0) {
						return res.status(404).json({ error: "task não encontrada" });
					}

					if (c.name === "user_id" && c.value === results[0].ct_user_id) {
						return res.status(401).json({
							error: "você só pode apagar uma task que você mesmo criou!",
						});
					} else if (c.name === "user_id" && c.value !== results[0].user_id) {
						db.query(sqlScript, [task_id], (err, results) => {
							if (err) throw err;
							return res.status(200).send(results);
						});
					}
				}
			);
		});
	} else {
		return res
			.status(401)
			.json({ error: "você precisa estar logado pra fazer essa ação" });
	}
});

app.put("/tasks/update/:task_id", (req, res) => {
	const sqlScript = "UPDATE tasks SET task_name = ? WHERE task_id = ?";
	const { task_id } = req.params;
	const { taskname } = req.body;
	const cookieString = req.headers.cookie;

	if (cookieString) {
		const cookies = cookieString.split(";").map((c) => {
			const [name, ...rest] = c.split("=");
			return { name: name.trim(), value: rest.join("=") };
		});

		cookies.forEach((c) => {
			if (c.name === "user_loged" && c.value === "false") {
				return res
					.status(401)
					.json({ error: "você precisa estar logado pra fazer essa ação" });
			}

			db.query(
				"SELECT * FROM tasks WHERE task_id = ?",
				[task_id],
				(err, results) => {
					if (err) throw err;

					if (!results.length > 0) {
						return res.status(404).json({ error: "task não encontrada" });
					}

					if (c.name === "user_id" && c.value === results[0].ct_user_id) {
						return res.status(401).json({
							error: "você só pode editar uma task que você mesmo criou!",
						});
					} else if (c.name === "user_id" && c.value !== results[0].user_id) {
						db.query(sqlScript, [taskname, Number(task_id)], (err, results) => {
							if (err) throw err;
							return res.status(200).send(results);
						});
					}
				}
			);
		});
	} else {
		return res
			.status(401)
			.json({ error: "você precisa estar logado pra fazer essa ação" });
	}
});

// metodos dos usuários
app.post("/users", (req, res) => {
	/// adiciona um usuário ao banco de dados
	const { name, mail, password, isAdmin } = req.body;

	if (!name || !mail || !password || isAdmin == null) {
		return res.status(400).json({ error: "campo obrigatório vazio" });
	}

	const emailTest = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	if (!emailTest.test(mail)) {
		return res.status(400).json({ error: "Informe um e-mail válido" });
	}

	const passwordTest =
		/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
	if (!passwordTest.test(password)) {
		return res.status(400).json({ error: "Informe uma senha valida" });
	}

	if (!typeof (isAdmin == Boolean)) {
		return res.status(400).json({ error: "isAdmin é booleano" });
	}

	const sqlScript = `INSERT INTO users (user_name, user_mail, user_password, isAdmin) VALUES (?, ?, ?, ?)`;
	db.query(sqlScript, [name, mail, password, isAdmin], (err, results) => {
		if (err) {
			if (err.code === "ER_DUP_ENTRY")
				return res
					.status(409)
					.json({ error: "E-mail ja cadastrado em outro usuário" });
			throw err;
		}
		return res.status(201).send(results);
	});
});

app.get("/users", (req, res) => {
	/// visualiza a lista de usuários salvos no banco de dados
	const sqlScript = "SELECT * FROM users";

	const cookieString = req.headers.cookie;

	if (cookieString) {
		const cookies = cookieString.split(";").map((c) => {
			const [name, ...rest] = c.split("=");
			return { name: name.trim(), value: rest.join("=") };
		});

		cookies.forEach((c) => {
			if (c.name === "user_loged" && c.value === "false") {
				return res
					.status(401)
					.json({ error: "você precisa estar logado pra fazer essa ação" });
			}
			if (c.name === "user_admin" && c.value === "true") {
				db.query(sqlScript, (err, results) => {
					if (err) throw err;
					return res.status(200).send(results);
				});
			} else if (c.name === "user_admin" && c.value === "false") {
				return res.status(401).json({
					error: "você precisa ser um administrador pra fazer essa ação",
				});
			}
		});
	} else {
		return res
			.status(401)
			.json({ error: "você precisa estar logado pra fazer essa ação" });
	}
});

app.delete("/users", (req, res) => {
	/// apaga um usuário salvo atravez do e-mail

	const { mail } = req.body;
	const sqlScript = `DELETE FROM users WHERE user_mail = ?`;

	const cookieString = req.headers.cookie;

	if (cookieString) {
		const cookies = cookieString.split(";").map((c) => {
			const [name, ...rest] = c.split("=");
			return { name: name.trim(), value: rest.join("=") };
		});

		cookies.forEach((c) => {
			if (c.name === "user_loged" && c.value === "false") {
				return res
					.status(401)
					.json({ error: "você precisa estar logado pra fazer essa ação" });
			}
			if (c.name === "user_admin" && c.value === "true") {
				db.query(sqlScript, [mail], (err, results) => {
					if (err) throw err;
					return res.status(200).send(results);
				});
			} else if (c.name === "user_admin" && c.value === "false") {
				return res.status(401).json({
					error: "você precisa ser um administrador pra fazer essa ação",
				});
			}
		});
	} else {
		return res
			.status(401)
			.json({ error: "você precisa estar logado pra fazer essa ação" });
	}
});

app.listen(port, () => {
	console.log("servidor iniciado na porta: ", port);
});
