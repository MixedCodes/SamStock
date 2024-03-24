//<script async src="js/header.js"></script> goes in the head
//<header-component></header-component> at the top of the body

const headerTemplate = document.createElement("template");

headerTemplate.innerHTML = `
	<link href="https://fonts.googleapis.com/css2?family=Inter:wght@100..900&display=swap" rel="stylesheet">
	<link rel="stylesheet" href="css/main.css"/>
	<style>
		nav {
			padding: 0 16px;
		}

		nav ul, .container {
			display: flex;
			flex-flow: row nowrap;
			align-items: center;
		}

		nav li {
			list-style-type: none;
		}

		nav a {
			color: #000000;
			padding: 0 16px;
			text-decoration: none;
		}

		#upper-nav {
			background-color: #FFE270;
		}

		#upper-nav ul {
			height: 30px;
			justify-content: flex-end;
		}

		header nav {
			display: flex;
			flex-flow: row wrap;
			justify-content: space-between;
			align-items: center;
			background-color: #FFFFFF;
			box-shadow:0px 5px 5px 0 rgba(0,0,0,.16);
		}

		header nav ul {
			align-items: center;
		}

		#logo {
			padding: 13px 0;
		}

		nav input[type="search"] {
			width: 100%;
			height: 30px;
			background-color: #F4F4F4;
			border: none;
		    border-radius: 15px;
		    padding: 0 10px;
		}
	</style>

	<nav id="upper-nav">
		<ul>
			<li><a href="admin.html">Admin Management</a></li>
			<li><a href="team.html">Team Page</a></li>
		</ul>
	</nav>
	<header>
		<nav>
			<ul>
				<a href="index.html"><img src="assets/samstock-logo.png" alt="SamStock Logo" id="logo" width="100" height="50"/></a>
				<li><a href="sneakers.html">Sneakers</a></li>
				<li><a href="sports.html">Sports</a></li>
				<li><a href="dressed.html">Dressed</a></li>
				<li><a href="sandals.html">Sandals</a></li>
			</ul>
			<div class="container">
				<input type="search" placeholder="Search..."/>
				<a href="login.html"><img src="assets/login-icon.png" alt="Login Icon" class="icon" width="45" height="45"/></a>
			</div>
		</nav>
	</header>`

class Header extends HTMLElement {
	constructor() {
		super();
	}

	connectedCallback() {
		const shadowRoot = this.attachShadow({ mode: "closed" })
		shadowRoot.appendChild(headerTemplate.content);
	}
}

customElements.define("header-component", Header);