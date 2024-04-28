export function openModal(modal) { modal.classList.add("open"); }


document.addEventListener("DOMContentLoaded", () => {
	 // Retrieves the add and edit modals
	const addModal = document.getElementById("add-modal");
	const editModal = document.getElementById("edit-modal");
	// Function to close both modals
	function closeModal() { 
		addModal.classList.remove("open");
		editModal.classList.remove("open"); 
	}
	// Retrieves the add button
	const addButton = document.getElementById("add-button");
	// Adds event listener to the add button to open the add modal
	addButton.addEventListener("click", () => openModal(addModal));
	// Retrieves all close buttons
	const closeButtons = document.getElementsByClassName("close-button");
	// Adds event listeners to all close buttons to close the modals when clicked
	for (let i = 0; i < closeButtons.length; i++) {
		closeButtons[i].addEventListener("click", () => closeModal());
	}
});