/*function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';

    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
}

// Check for the user's theme preference in local storage
const savedTheme = localStorage.getItem('theme');
if (savedTheme) {
    document.documentElement.setAttribute('data-theme', savedTheme);
}

// Add a click event listener to the custom switch checkbox
const customSwitchCheckbox = document.getElementById('customSwitches');
customSwitchCheckbox.addEventListener('change', toggleTheme);*/
function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';

    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
}

// Function to update the checkbox state based on the theme
function updateCheckboxState() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const customSwitchCheckbox = document.getElementById('customSwitches');

    if (currentTheme === 'dark') {
        customSwitchCheckbox.checked = true;
    } else {
        customSwitchCheckbox.checked = false;
    }
}

// Check for the user's theme preference in local storage
const savedTheme = localStorage.getItem('theme');
if (savedTheme) {
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateCheckboxState(); // Update checkbox state on page load
}

// Add a change event listener to the custom switch checkbox
const customSwitchCheckbox = document.getElementById('customSwitches');
customSwitchCheckbox.addEventListener('change', toggleTheme);