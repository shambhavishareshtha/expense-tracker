// Array to store our expense objects
// Load from localStorage if available, otherwise start with an empty array
let expenses = JSON.parse(localStorage.getItem('expenses')) || [];

// Consistent currency symbol
const CURRENCY = "₹";

// Selecting DOM elements
const expenseForm = document.getElementById('expense-form');
const expenseNameInput = document.getElementById('expense-name');
const expenseAmountInput = document.getElementById('expense-amount');
const expenseList = document.getElementById('expense-list');

// Selection updated to match new IDs in HTML for formatted output
const totalAmountDisplay = document.getElementById('total-amount-formatted');

// UI Elements for summary and messages
const errorMessage = document.getElementById('error-message');
const emptyMessage = document.getElementById('empty-message');
const totalContainer = document.getElementById('total-container');
const currentMonthDisplay = document.getElementById('current-month');
const monthlyTotalDisplay = document.getElementById('monthly-total-formatted');
const itemCountDisplay = document.getElementById('item-count');

// Function to save the current expenses array to LocalStorage
function saveToLocalStorage() {
    localStorage.setItem('expenses', JSON.stringify(expenses));
}

// Function to update the Monthly Summary section
function updateMonthlySummary() {
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const now = new Date();
    const currentMonthName = months[now.getMonth()];

    // Display current month
    currentMonthDisplay.textContent = currentMonthName;

    // Calculate total spent
    const total = expenses.reduce((sum, expense) => sum + expense.amount, 0);

    // Update summary text with currency symbol
    monthlyTotalDisplay.textContent = `${CURRENCY}${total.toFixed(2)}`;
    itemCountDisplay.textContent = expenses.length;
}

// Function to calculate and update the total amount shown on page
function calculateTotal() {
    const total = expenses.reduce((sum, expense) => sum + expense.amount, 0);
    // Display total with currency symbol
    totalAmountDisplay.textContent = `${CURRENCY}${total.toFixed(2)}`;
}

// Function to render expenses to the screen
function renderExpenses() {
    // Clear the current list first
    expenseList.innerHTML = '';

    // Handle Empty State: show message if no expenses
    if (expenses.length === 0) {
        emptyMessage.style.display = 'block';
        totalContainer.style.display = 'none';
        expenseList.style.display = 'none';
    } else {
        emptyMessage.style.display = 'none';
        totalContainer.style.display = 'block';
        expenseList.style.display = 'block';
    }

    // Loop through the expenses array and create HTML for each one
    expenses.forEach(function (expense, index) {
        const expenseDiv = document.createElement('div');
        expenseDiv.classList.add('expense-item');

        // Render each row with the consistent currency symbol
        expenseDiv.innerHTML = `
            <span class="expense-name">${expense.name}</span>
            <div>
                <span class="expense-amount">${CURRENCY}${expense.amount.toFixed(2)}</span>
                <button class="delete-btn" data-index="${index}">Delete</button>
            </div>
        `;

        expenseList.appendChild(expenseDiv);
    });

    // Update totals and summaries whenever we re-render
    calculateTotal();
    updateMonthlySummary();
}

// Function to show error message
function showError(message) {
    errorMessage.textContent = message;
    errorMessage.style.display = 'block';
}

// Function to hide error message
function hideError() {
    errorMessage.style.display = 'none';
}

// Handling the form submission with new validation rules
expenseForm.addEventListener('submit', function (event) {
    // Prevent the page from reloading
    event.preventDefault();

    // Read and trim values from the inputs
    const name = expenseNameInput.value.trim();
    const amountStr = expenseAmountInput.value;
    const amount = parseFloat(amountStr);

    // 1. Expense Name Validation: Only letters and spaces allowed
    // We use a Regular Expression: /^[a-zA-Z\s]+$/
    const nameRegex = /^[a-zA-Z\s]+$/;
    if (name === "" || !nameRegex.test(name)) {
        showError("Expense name must contain only letters and spaces.");
        return;
    }

    // 2. Amount Validation: Must be more than zero and a multiple of 10
    if (amountStr === "" || isNaN(amount) || amount <= 0) {
        showError("Please enter a valid amount greater than zero.");
        return;
    }

    // Rule: Amount must be exactly divisible by 10 (multiple of 10)
    if (amount % 10 !== 0) {
        showError("Amount must be a multiple of 10 (e.g. 10, 20, 50).");
        return;
    }

    // If we reach here, input is valid
    hideError();

    // Create a new expense object
    const newExpense = {
        name: name,
        amount: amount
    };

    // Push the new expense into the array and save
    expenses.push(newExpense);
    saveToLocalStorage();

    // Refresh UI and clear form
    renderExpenses();
    expenseForm.reset();
});

// Event Delegation for Deleting Expenses
expenseList.addEventListener('click', function (event) {
    if (event.target.classList.contains('delete-btn')) {
        const index = event.target.getAttribute('data-index');

        // Remove from array and update everything
        expenses.splice(index, 1);
        saveToLocalStorage();
        renderExpenses();
    }
});

// Initial render when the page loads
renderExpenses();
