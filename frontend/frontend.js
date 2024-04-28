const express = require("express");
const path = require("path");
const dotenv = require("dotenv");

dotenv.config();
const serverUrl = `http://localhost:${process.env.SERVER_PORT}`;
const databaseUrl = `http://localhost:${process.env.DATABASE_URL}`;

const app = express();
app.use(express.static("public"));

const router = express.Router();
router.use(express.urlencoded({ extended: true }));

// Use static to find static files: images, css, and js
router.use("*/images", express.static(path.join(__dirname, "public/images")));
router.use("*/css", express.static(path.join(__dirname, "public/css")));
router.use("*/js", express.static(path.join(__dirname, "public/js")));

// Middleware
const logPageUrl = (req, res, next) => {
	console.log(`Request at ${req.originalUrl}`);
	next();
}
router.use(logPageUrl);

// Helper function
const isNumeric = (string) => /^\d+$/.test(string);

router.get("/", (req, res) => {
	return res.status(200).set("Content-Type", "text/html").sendFile(path.join(__dirname, "public/html/index.html"));
});

router.get("/products/:id", (req, res) => {
	const productId = req.params.id;
	if (!req.params.id || !isNumeric(req.params.id)) {
		return res.status(400).send("Please provide a valid product ID");
	}
	return res.status(200).set("Content-Type", "text/html").sendFile(path.join(__dirname, "public/html/detail.html"));
});

router.get("/search", (req, res) => {
	if (req.query && Object.keys(req.query).length > 0) {
		return res.status(200).set("Content-Type", "text/html").sendFile(path.join(__dirname, "public/html/search-result.html"));
	} else {
		return res.status(200).set("Content-Type", "text/html").sendFile(path.join(__dirname, "public/html/search.html"));
	}
});

router.get(["/sneakers", "/sports", "/dressed", "/sandals"], (req, res) => {
	return res.status(200).set("Content-Type", "text/html").sendFile(path.join(__dirname, "public/html/category.html"));
});

router.get("/login", (req, res) => {
	return res.status(200).set("Content-Type", "text/html").sendFile(path.join(__dirname, "public/html/login.html"));
});

router.get("/team-page", (req, res) => {
	return res.status(200).set("Content-Type", "text/html").sendFile(path.join(__dirname, "public/html/team-page.html"));
});

router.get("/account-management", (req, res) => {
	return res.status(200).set("Content-Type", "text/html").sendFile(path.join(__dirname, "public/html/account-management.html"));
});

router.get("/product-management", (req, res) => {
	return res.status(200).set("Content-Type", "text/html").sendFile(path.join(__dirname, "public/html/product-management.html"));
});

router.get("*", (req, res) => {
	return res.status(404).set("Content-Type", "text/plain").send("Not Found");
});

// Global error handler
const errorHandler = (err, req, res, next) => {
	console.log(err.stack);
	return res.status(err.status || 500).set("Content-Type", "applicaton/json").json({
		error: true,
		message: "Internal Server Error"
	});
}
router.use(errorHandler);

app.use("/", router);
app.listen(process.env.SERVER_PORT, () => {
	console.log(`Server listening on the port: ${process.env.SERVER_PORT}`);
});