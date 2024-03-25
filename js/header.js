//<script async src="js/header.js"></script> goes in the head
//<header-component></header-component> at the top of the body

const headerTemplate = document.createElement("template");

headerTemplate.innerHTML = `
	<link href="https://fonts.googleapis.com/css2?family=Inter:wght@100..900&display=swap" rel="stylesheet">
	<link rel="stylesheet" href="css/main.css"/>
	<style>
		nav {
			padding: 0 1rem;
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
			padding: 0 1rem;
			text-decoration: none;
		}

		#upper-nav {
			background-color: #FFE270;
		}

		#upper-nav ul {
			justify-content: flex-end;
		}

		header nav {
			display: flex;
			flex-flow: row wrap;
			justify-content: space-between;
			align-items: center;
			background-color: #FFFFFF;
			box-shadow:0 5px 5px 0 rgba(0,0,0,.16);
		}

		header nav ul {
			align-items: center;
		}

		#logo {
			padding: 1rem 0;
		}

		form {
			position: relative;
			width: 100%;
			background-color: #F4F4F4;
			border: none;
		    border-radius: 1rem;
		}

		nav button {
			position: absolute;
			top: .5rem;
			right: 1rem;
			border: 0;
			cursor: pointer;
		}

		nav input[type="search"] {
			width: 100%;
			height: 2rem;
			background-color: #F4F4F4;
			padding: 0 1rem;
			border: none;
			border-radius: 1rem;
		}
	</style>

	<nav id="upper-nav">
		<ul>
			<li><a href="admin.html"><small>Admin Management</small></a></li>
			<li><a href="team.html"><small>Team Page</small></a></li>
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
				<form>
					<input type="search" placeholder="Search..."/>
					<button type="submit"><img src="assets/search-icon.png" alt="Search Icon" class="icon" width="16" height="16"/></button>
				</form>
				<a href="login.html"><img src="assets/login-icon.png" alt="Login Icon" class="icon" width="50" height="50"/></a>
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