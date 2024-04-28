//<script async src="js/header.js"></script> goes in the head
//<header-component></header-component> at the top of the body

const headerTemplate = document.createElement("template");

headerTemplate.innerHTML = `
	<link rel="stylesheet" href="css/main.css"/>
	<style>
		nav {
			gap: 0 1rem;
		}

		nav > ul, .container, header > nav, header form {
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

			&:hover {
				-webkit-text-stroke-width: 0.1ex;
			}
		}

		#top-nav {
			background-color: #FFE270;
			padding: 0.25px 0;
		}

		#top-nav ul {
			justify-content: flex-end;
		}

		header nav {
			position: relative;
			z-index: 1;
			justify-content: space-between;
			background-color: #FFFFFF;
			padding: 13px 0;
			box-shadow:0 5px 5px 0 rgba(0,0,0,.16);
		}

		header nav ul {
			align-items: center;
		}

		header form {
			justify-content: space-evenly;
			width: 100%;
			background-color: #F4F4F4;
			border: none;
		    border-radius: 1rem;
		    padding: 0 1rem;
		}

		nav button {
			background: transparent;
			border: 0;
			cursor: pointer;
		}

		nav input[type="search"] {
			width: 100%;
			height: 2rem;
			background: transparent;
			border: none;
			border-radius: 1rem;

			&:focus {
				outline: none;
			}
		}

		[type="search"]::-webkit-search-decoration,
		[type="search"]::-webkit-search-cancel-button {
		  appearance: none;
		}
	</style>

	<nav id="top-nav">
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
					<button type="submit"><img src="assets/search-icon.svg" alt="Search Icon" class="icon" width="16" height="16"/></button>
				</form>
				<a href="login.html"><img src="assets/login-icon-test.png" alt="Login Icon" class="icon" width="32" height="32"/></a>
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