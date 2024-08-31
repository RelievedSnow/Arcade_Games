const toggleBtn = document.querySelector('.toggle-btn');
const toggleBtnIcon = document.querySelector('.toggle-btn i');
const dropdownMenu = document.querySelector('.dropdown-menu');

toggleBtn.onclick = function () {
    dropdownMenu.classList.toggle('open');
    const isOpen = dropdownMenu.classList.contains('open');

    // Toggle the icon class
    if (isOpen) {
        toggleBtnIcon.classList.remove('bi-list');
        toggleBtnIcon.classList.add('bi-x');
    } else {
        toggleBtnIcon.classList.remove('bi-x');
        toggleBtnIcon.classList.add('bi-list');
    }

    // Debugging outputs
    console.log("Menu is now " + (isOpen ? "open" : "closed"));
    console.log("Icon class is now: " + toggleBtnIcon.className);
}


function alertLogin(){
    alert("Please log in to access this game.");
    window.location.href = "/logIn";
}
