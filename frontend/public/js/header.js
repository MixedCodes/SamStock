const headerTemplate = document.createElement("template");

headerTemplate.innerHTML = `
	<link rel="stylesheet" href="css/main.css"/>
	<style>
		nav, header {
			position: relative;
			z-index: 2;
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
			height: 20px;
			display: flex;
			justify-content: flex-end;
			align-items: center;
			background-color: #FFE270;
		}

		header nav {
			height: 80px;
			justify-content: space-between;
			background-color: #FFFFFF;
			box-shadow: 0 5px 5px 0 rgba(0,0,0,.16);
		}

		header nav ul {
			align-items: center;
		}

		header form {
			justify-content: space-evenly;
			width: 100%;
			background-color: #F4F4F4;
			border: none;
			border-radius: 5px;
		}

		nav button {
			background: transparent;
			border: 0;
			cursor: pointer;
			padding-right: 1rem;
		}

		.container > a {
			pointer: cursor;
		}

		.search-container {
            display: flex;
            align-items: center;
            margin-left: 1rem;
            padding: 0.5rem 1rem;
            border-radius: 5px;
            background-color: #FFE270;
            color: black;
            text-decoration: none;
			gap: 8px;
        }

	</style> 

	<nav id="top-nav">
		<ul>
			<li><a href="/account-management"><small>Admin Management</small></a></li>
			<li><a href="/team-page"><small>Team Page</small></a></li>
		</ul>
	</nav>
	<header>
		<nav id="navbar">
			<ul>
				<li><a href="/"><img src="images/samstock-logo.png" alt="SamStock Logo" id="logo" width="100" height="50"/></a></li>
				<li><a href="/sneakers" id="sneakers" data-category="sneakers">Sneakers</a></li>
				<li><a href="/sports" id="sports">Sports</a></li>
				<li><a href="/dressed" id="dressed">Dressed</a></li>
				<li><a href="/sandals" id="sandals">Sandals</a></li>
			</ul>
			<div class="container">
                <a href="/search" class="search-container"> 
                    Advanced Search <img src="images/search-icon.svg" alt="Search Icon" class="icon" width="16" height="16"/>
                    
                </a>
                <a href="/login"><img src="images/login-icon-test.png" alt="Login Icon" class="icon" width="32" height="32" style="mix-blend-mode: multiply"/></a>
            </div>
		</nav>
	</header>
`;

class Header extends HTMLElement {
	constructor() { super(); }

	connectedCallback() {
		const shadowRoot = this.attachShadow({ mode: "open" });
		shadowRoot.appendChild(headerTemplate.content);
		this.currentUrl = this.getAttribute("data-current-url");
	}
}

customElements.define("header-component", Header);