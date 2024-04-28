// Import packages
const express = require("express");
const path = require("path");
const dotenv = require("dotenv");
const mysql = require("mysql2");
const cors = require("cors");
const jwt = require("jsonwebtoken");

// Create connection with the credentials from .env
dotenv.config();
const connection = mysql.createConnection({
	host: process.env.MYSQL_HOST,
	user: process.env.MYSQL_USERNAME,
	password: process.env.MYSQL_PASSWORD,
	database: process.env.MYSQL_DATABASE,
});

// Connect to the database with the credentials
connection.connect((err) => {
	if (err) { throw err; }
	console.log(`Connected to the database: ${process.env.MYSQL_DATABASE}`);
});
module.exports = connection;

// Use builtin middlewares to handle requests
const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Set CORS and Access Control Allow Headers
const allowList = [`http://localhost:${process.env.SERVER_PORT}`, `http://localhost:${process.env.DATABASE_PORT}`];
app.all((req, res, next) => {
	res.header("Access-Control-Allow-Origin", allowList);
    res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE");
    res.header("Access-Control-Allow-Headers", "Content-Type");
    next()
});

// Specify allowed origin, methods, and use status 200 ask an OK status
const corsOptions = {
	origin: allowList,
	methods: "GET, PUT, POST, DELETE",
	optionSuccessStatus: 200
}
app.use(cors(corsOptions));

// Middlewares
const logPageUrl = (req, res, next) => {
	console.log(`${req.method} Request at ${req.originalUrl}`);
	next();
}
app.use(logPageUrl);

// Middle ware to authenticate the token; This refers to the verification of privileged routes
const authenticateToken = (req, res, next) => {
	const authHeader = req.headers.authorization;
	if (authHeader) {
		const token = authHeader.split(" ")[1]; 
		if (token == null) { return res.status(401).json({ error: true, data: "0", message: "Token not found." }); }

        jwt.verify(token, process.env.ACCESS_TOKEN, (err, account) => {
        	if (err) {
        		return res.status(400).json({ error: true, data: "0", message: "Token invalid." });
        	}
        	req.account = account;
        	next();
        });
	} else {
		return res.status(403).json({ error: true, data: "0", message: "You are not authenticated." });
	}
}

// Helper function
const isNumeric = (string) => /^\d+$/.test(string);

// Start Routing
const productQuery = "SELECT p.prod_id, p.prod_name, p.prod_gender, p.prod_price, p.prod_image, p.prod_desc, b.brand_id, b.brand_name, c.category_id, c.category_name FROM product AS p INNER JOIN brand AS b ON p.brand_id = b.brand_id INNER JOIN category AS c ON p.category_id = c.category_id"
app.get("/products", (req, res, next) => {
	let sql = productQuery;
	const categoryId = req.query.category;

	// If category query exists, add another condition
	if (req.query.category) { sql += " WHERE c.category_id = ?"; }
	if (req.query.sort === "random") { sql += " ORDER BY RAND()"; }
	else { sql += " ORDER BY p.prod_id";}

	connection.query(sql, categoryId, (err, data) => {
	if (err) { next(err); }
		return res.status(200).set("Content-Type", "application/json").json({
			error: false,
			data: data,
			message: "The products are listed."
		});
	});
});

// get product by id
app.get("/products/:id", (req, res, next) => {
	const productId = parseInt(req.params.id);
	if (!productId || !isNumeric(productId) || productId < 1) {
		return res.status(400).set("Content-Type", "application/json").json({
			error: true,
			message: "Please provide a product ID."
		});
	}
	const sql = productQuery + " WHERE p.prod_id = ?";

	connection.query(sql, productId, (err, data) => {
		if (err) { next(err); }
		return res.status(200).set("Content-Type", "application/json").json({
			error: false,
			data: data,
			message: "The product is retrieved."
		});
	});
});

// Add product
app.post("/products", authenticateToken, (req, res, next) => {
	let productValues = [req.body.name, req.body.price, req.body.gender, req.body.image, req.body.desc, req.body.brand, req.body.category];

	// Check if id is blank
	if(req.body.id) {
		productValues.unshift(req.body.id);

		const productSql = "INSERT INTO product (prod_id, prod_name, prod_price, prod_gender, prod_image, prod_desc, brand_id, category_id) VALUES (?)";
		connection.query(productSql, [productValues], (err, product) => {
			if (err) { next(err); }

			const productItemSql = "INSERT INTO product_item(prod_id, size_id, quantity) VALUES (?, ?, ?)"
			const sizeEntries = Object.entries(req.body.sizes);
			for (let i = 0; i < sizeEntries.length; i++) {
				let [sizeId, quantity] = sizeEntries[i];
				sizeId = parseInt(sizeId);
				quantity = parseInt(quantity);

				if (!isNumeric(quantity) || quantity < 1) { continue; }
				connection.query(productItemSql, [product.insertId, sizeId, quantity], (err, size) => {
					if (err) { next(err); }
				});
			}

			actionSql = "INSERT INTO manage_product(super_id, prod_id, action, action_date) VALUES (?)";
			connection.query(actionSql, [[req.account.acc_id, product.insertId, "add", new Date()]], (err, data) => {
				if (err) { next(err); }
			});

			return res.status(200).set("Content-Type", "application/json").json({
				error: false,
				data: product.affectedRows,
				message: "The product has been created successfully."
			});
		});
	} else {
		const productSql = "INSERT INTO product (prod_name, prod_price, prod_gender, prod_image, prod_desc, brand_id, category_id) VALUES (?)";
		connection.query(productSql, [productValues], (err, product) => {
			if (err) { next(err); }

			const productItemSql = "INSERT INTO product_item(prod_id, size_id, quantity) VALUES (?, ?, ?)"
			const sizeEntries = Object.entries(req.body.sizes);
			for (let i = 0; i < sizeEntries.length; i++) {
				let [sizeId, quantity] = sizeEntries[i];
				quantity = parseInt(quantity);

				if (!isNumeric(quantity) || quantity < 1) { continue; }
				connection.query(productItemSql, [product.insertId, sizeId, quantity], (err, size) => {
					if (err) { next(err); }
				});
			}

			actionSql = "INSERT INTO manage_product(super_id, prod_id, action, action_date) VALUES (?)";
			connection.query(actionSql, [[req.account.acc_id, product.insertId, "add", new Date()]], (err, data) => {
				if (err) { next(err); }
			});

			return res.status(200).set("Content-Type", "application/json").json({
				error: false,
				data: product.affectedRows,
				message: "The product has been created successfully."
			});
		});
	}
});


// Edit product
app.put("/products/:id", authenticateToken, (req, res, next) => {
	const productId = parseInt(req.params.id);
	if (!productId || !isNumeric(productId) || productId < 1) {
		return res.status(400).set("Content-Type", "application/json").json({
			error: true,
			message: "Please provide a product ID."
		});
	}

	const productValues = [req.body.name, req.body.price, req.body.gender, req.body.image, req.body.desc, req.body.brand, req.body.category];
	const productSql = "UPDATE product SET prod_name = ?, prod_price = ?, prod_gender = ?, prod_image = ?, prod_desc = ?, brand_id = ?, category_id = ? WHERE prod_id = ?";

	connection.query(productSql, [...productValues, productId], (err, product) => {
		if (err) { next(err); }

		// Perform an upsert operation (insert if not exitst and update if exitsts)
		const updateProductItem = "INSERT INTO product_item (prod_id, size_id, quantity, sku) VALUES (?) ON DUPLICATE KEY UPDATE quantity = ?";
		const deleteProductItem = "DELETE FROM product_item WHERE prod_id = ? AND size_id = ?";
		
		const sizeEntries = Object.entries(req.body.sizes);
		for (let i = 0; i < sizeEntries.length; i++) {
			let [sizeId, quantity] = sizeEntries[i];
			sizeId = parseInt(sizeId);
			quantity = parseInt(quantity);

			if (!isNumeric(quantity) || quantity < 0) { continue; }
			if (quantity === 0) {
				connection.query(deleteProductItem, [productId, sizeId], (err, size) => {
					if (err) { next(err); }
				});
			} else {
				connection.query(updateProductItem, [[productId, sizeId, quantity, `P${productId}-S${sizeId}`], quantity], (err, size) => {
					if (err) { next(err); }
				});
			}
		}

		const actionSql = "INSERT INTO manage_product(super_id, prod_id, action, action_date) VALUES (?)";
		connection.query(actionSql, [[req.account.acc_id, productId, "edit", new Date()]], (err, data) => {
			if (err) { next(err); }
		})

		return res.status(200).set("Content-Type", "application/json").json({
			error: false,
			data: product.affectedRows,
			message: "The product has been updated successfully."
		});
	});
});

// Delete product
app.delete("/products/:id", authenticateToken, (req, res, next) => {
	const productId = parseInt(req.params.id);
	if (!productId || !isNumeric(productId) || productId < 1) {
		return res.status(400).set("Content-Type", "application/json").json({
			error: true,
			message: "Please provide a product ID."
		});
	}

	const sql = "DELETE FROM product WHERE prod_id = ?";
	connection.query(sql, productId, (err, product) => {
		if (err) { next(err); }

		const actionSql = "INSERT INTO manage_product(super_id, prod_id, action, action_date) VALUES (?)";
		connection.query(actionSql, [[req.account.acc_id, productId, "delete", new Date()]], (err, data) => {
			if (err) { next(err); }
		})

		return res.status(200).set("Content-Type", "application/json").json({
			error: false,
			data: product.affectedRows,
			message: "The product has been deleted successfully."
		});
	});
});

// Get product items (sizes)
app.get("/product-items/:id", (req, res, next) => {
	const productId = parseInt(req.params.id);
	if (!productId || !isNumeric(productId) || productId < 1) {
		return res.status(400).set("Content-Type", "application/json").json({
			error: true,
			message: "Please provide a product ID."
		});
	}
	const sql = "SELECT DISTINCT s.size_id, s.size_name, pi.quantity FROM size AS s INNER JOIN product_item AS pi ON s.size_id = pi.size_id WHERE pi.prod_id = ? ORDER BY s.size_id";

	connection.query(sql, productId, (err, data) => {
		if (err) { next(err); }
		return res.status(200).set("Content-Type", "application/json").json({
			error: false,
			data: data,
			message: "The product items are listed."
		});
	});
});

// Get banner imgages
app.get("/category-images/:id", (req,res) => {
	const categoryId = req.params.id;
	if (!categoryId || !isNumeric(categoryId) || categoryId < 1) {
		return res.status(400).set("Content-Type", "application/json").json({
			error: true,
			message: "Please provide a category ID."
		});
	}

	const sql = "SELECT * FROM category_image WHERE category_id = ?";
	connection.query(sql, categoryId, (err, data) => {
		if (err) { next(err); }
		return res.status(200).set("Content-Type", "application/json").json({
			error: false,
			data: data,
			message: "The category images are listed."
		});
	});
});

// Handle search queries
app.get("/search", (req, res, next) => {
	const values = [];

	// Set initial search query and checks for non-blank queries and search accordingly
	let sql = "SELECT * FROM product WHERE 1 = 1";
	if (req.query.name != "") {
		sql += " AND prod_name LIKE ?";
		values.push(`%${req.query.name}%`);
	}
	if (req.query.category != "") {
		sql += " AND category_id = ?";
		values.push(req.query.category);
	}
	if (req.query.brand != "") {
		sql += " AND brand_id = ?";
		values.push(req.query.brand);
	}
	if (req.query.gender != "") {
		sql += " AND prod_gender = ?";
		values.push(req.query.gender);
	}
	if (req.query.size != "") {
		const sizeArray = req.query.size.split(",").map((size) => parseInt(size));
		sql +=
		" AND prod_id IN ( SELECT DISTINCT prod_id FROM product_item WHERE size_id IN (?) )";
		values.push(sizeArray);
	}

	connection.query(sql, values, (err, data) => {
		if (err) { next(err); }
		return res.status(200).set("Content-Type", "application/json").json({
			error: false,
			data: data,
			message: "The products are listed."
		});
	});
});

// Get categoreis
app.get("/categories", (req, res, next) => {
	connection.query("SELECT * FROM category", (err, data) => {
		if (err) { next(err); }
		return res.status(200).set("Content-Type", "application/json").json({
			error: false,
			data: data,
			message: "The categories are listed."
		});
	});
});


// Get brands
app.get("/brands", (req, res, next) => {
	connection.query("SELECT * FROM brand", (err, data) => {
		if (err) { next(err); }
		return res.status(200).set("Content-Type", "application/json").json({
			error: false,
			data: data,
			message: "The brands are listed."
		});
	});
});


// Get sizes
app.get("/sizes", (req, res, next) => {
	connection.query("SELECT * FROM size", (err, data) => {
		if (err) { next(err); }
		return res.status(200).set("Content-Type", "application/json").json({
			error: false,
			data: data,
			message: "The sizes are listed."
		});
	});
});


// Get accounts
const accountQuery = "SELECT a.*, l.login_username, l.login_password, l.last_login, is_super FROM account as a INNER JOIN login_information as l ON a.acc_id = l.acc_id";
app.get("/accounts", (req, res, next) => {
	connection.query(accountQuery, (err, data) => {
		if (err) { next(err); }
		return res.status(200).set("Content-Type", "application/json").json({
			error: false,
			data: data,
			message: "The accounts are listed."
		});
	});
});

// Get accounts by ID
app.get("/accounts/:id", (req, res, next) => {
	accountId = parseInt(req.params.id);
	if (!accountId || !isNumeric(accountId)|| accountId < 1) {
		return res.status(400).set("Content-Type", "application/json").json({
			error: true,
			message: "Please provide an account ID."
		});
	}
	const sql = accountQuery + " WHERE a.acc_id = ?";
	connection.query(sql, accountId, (err, data) => {
		if (err) { next(err); }
		return res.status(200).set("Content-Type", "application/json").json({
			error: false,
			data: data,
			message: "The account is retrieved."
		});
	});
});

// Add new account
app.post("/accounts", authenticateToken, (req, res, next) => {
	let accountValues = [req.body.fname, req.body.lname, req.body.email, req.body.address];
	let loginValues = [req.body.username, req.body.password];

	if (req.body.id) {
		accountValues.unshift(req.body.id);
		loginValues.unshift(req.body.id);

		const accountSql = "INSERT INTO account(acc_id, acc_fname, acc_lname, acc_email, acc_address) VALUES (?)";
		connection.query(accountSql, [accountValues], (err, account) => {
			if (err) { next(err); }

			loginSql = "INSERT INTO login_information(login_id, login_username, login_password, acc_id) VALUES (?, ?)";
			connection.query(loginSql, [loginValues, data.insertId], (err, login) => {
				if (err) { next(err); }

				actionSql = "INSERT INTO manage_account(super_id, acc_id, action, action_date) VALUES (?)";
				connection.query(actionSql, [[req.account.acc_id, account.insertId, "add", new Date()]], (err, data) => {
					if (err) { next(err); }
				});

				return res.status(200).set("Content-Type", "application/json").json({
						error: false,
						data: account.affectedRows,
						message: "The account has been created successfully."
				});
			});
		});
	} else {
		const accountSql = "INSERT INTO account(acc_fname, acc_lname, acc_email, acc_address) VALUES (?)";
		connection.query(accountSql, [accountValues], (err, account) => {
			if (err) { next(err); }

			loginSql = "INSERT INTO login_information(login_username, login_password, acc_id) VALUES (?, ?)";
			connection.query(loginSql, [loginValues, account.insertId], (err, login) => {
				if (err) { next(err); }

				actionSql = "INSERT INTO manage_account(super_id, acc_id, action, action_date) VALUES (?)";
				connection.query(actionSql, [[req.account.acc_id, account.insertId, "add", new Date()]], (err, data) => {
					if (err) { next(err); }
				});

				return res.status(200).set("Content-Type", "application/json").json({
						error: false,
						data: account.affectedRows,
						message: "The account has been created successfully."
				});
			});
		});
	}
});


// Edit account
app.put("/accounts/:id", authenticateToken, (req, res, next) => {
	// If the editor is not a super user, forbids the edit and return
	if (!req.account.is_super) {
		return res.status(403).json({
			error: true,
			data: 0,
			message: "You are not a superuser; you are not allowed to edit this account."
		});
	}

	const accountId = parseInt(req.params.id);
	if (!accountId || !isNumeric(accountId) || accountId < 1) {
		return res.status(400).set("Content-Type", "application/json").json({
			error: true,
			message: "Please provide an account ID."
		});
	}
	const accountValues = [req.body.fname, req.body.lname, req.body.email, req.body.address];
	const loginValues = [req.body.username, req.body.password];

	const accountSql = "UPDATE account SET acc_fname = ?, acc_lname = ?, acc_email = ?, acc_address = ? WHERE acc_id = ?";
	const loginSql = "UPDATE login_information SET login_username = ?, login_password = ? WHERE acc_id = ?";
	connection.query(accountSql, [...accountValues, accountId], (err, account) => {
		if (err) {  next(err); }

		connection.query(loginSql, [...loginValues, accountId], (err, login) => {
			if (err) { next(err); }
		});

		const actionSql = "INSERT INTO manage_account(super_id, acc_id, action, action_date) VALUES (?)";
		connection.query(actionSql, [[req.account.acc_id, accountId, "edit", new Date()]], (err, data) => {
			if (err) { next(err); }
		})

		return res.status(200).set("Content-Type", "application/json").json({
			error: false,
			data: account.affectedRows,
			message: "The account has been updated successfully."
		});
	});
});

// Delete account
app.delete("/accounts/:id", authenticateToken, (req,res) => {
	// If the editor is not a super user, forbid deletion and return
	if (!req.account.is_super) {
		return res.status(403).json({
			error: true,
			data: 0,
			message: "You are not a superuser; you are not allowed to delete this account."
		});
	}

	const accountId = parseInt(req.params.id);
	if (!accountId || !isNumeric(accountId) || accountId < 1) {
		return res.status(400).set("Content-Type", "application/json").json({
			error: true,
			message: "Please provide a product ID."
		});
	}

	const sql = "DELETE FROM account WHERE acc_id = ?";

	connection.query(sql, accountId, (err, account) => {
		if (err) { next(err); }

		const actionSql = "INSERT INTO manage_account(super_id, acc_id, action, action_date) VALUES (?)";
		connection.query(actionSql, [[req.account.acc_id, accountId, "delete", new Date()]], (err, data) => {
			if (err) { next(err); }
		})

		return res.status(200).set("Content-Type", "application/json").json({
			error: false,
			data: account.affectedRows,
			message: "The product has been deleted successfully."
		});
		return res.status(200).set("Content-Type", "application/json").json({
			error: false,
			data: data.affectedRows,
			message: "The account has been deleted successfully."
		});
	});
});

// Get account product actions
app.get("/account-actions", (req, res) => {
	const sql = "SELECT DISTINCT * FROM manage_account ORDER BY action_date DESC";

	connection.query(sql, (err, data) => {
		if (err) { next(err); }
		res.status(200).set("Content-Type", "application/json").json({
			error: false,
			data: data,
			message: "The actions are listed."
		})
	});
});

// Get manage product actions
app.get("/product-actions", (req, res) => {
	const sql = "SELECT DISTINCT * FROM manage_product ORDER BY action_date DESC";

	connection.query(sql, (err, data) => {
		if (err) { next(err); }
		res.status(200).set("Content-Type", "application/json").json({
			error: false,
			data: data,
			message: "The actions are listed."
		})
	});
});

// Authentication route for restricted routes handling
app.post("/authenticate", authenticateToken, (req, res) => {
    if (res.status === 401) {
    	return res.status;
    } else if (res.status === 403) {
    	return res.status;
    } else {
    	return req.account; 
    }
});

// Handle access token generation with account information as the payload and an expiration times of 4 hours
const generateAccessToken = (account) => {
    return jwt.sign(account, process.env.ACCESS_TOKEN, { expiresIn: "4h" });
}

app.post("/login", (req, res, next) => {
    const { username, password } = req.body;
    const sql = "SELECT * FROM login_information WHERE login_username = ? AND login_password = ?";

    connection.query(sql, [username, password], (err, data) => {
        if (err) { next(err); }

        if (data.length < 1) {
        	return res.status(400).set("Content-Type", "application/json").json({ status: "0" });
        }

		const accessToken = generateAccessToken(data[0]);
        
        return res.status(200).set("Content-Type", "application/json").json({
        	status: "1",
        	acc_id: data[0].acc_id,
			is_super: data[0].is_super,
			access_token: accessToken
        });
    });
});

// Wildcard selectors for unknown pages
app.get("*", (req, res) => {
	return res.status(404).set("Content-Type", "text/plain").send("Not found");
});

// Global error handler
const errorHandler = (err, req, res, next) => {
	console.log(err.stack);
	return res.status(err.status || 500).set("Content-Type", "applicaton/json").json({
		error: true,
		message: "Internal Server Error"
	});
}
app.use(errorHandler);

app.listen(process.env.DATABASE_PORT, () => {
	console.log(`Server listening on the port: ${process.env.DATABASE_PORT}`);
});