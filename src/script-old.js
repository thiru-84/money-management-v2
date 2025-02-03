// -----------------------------------------------------Date-----------------------------------------------------
// date and time
const date = new Date();
const dateFormat = {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
};
document.getElementById("current-date").innerHTML = date.toLocaleString('en-UK', dateFormat);



// -----------------------------------------------------Collect Information-----------------------------------------------------

let userEnteredAmount = "";
let userEnteredDescription = "";
let selectedRadio = "All";

// Listen for user input and update the variables
document.querySelector('.user-entered-amount').addEventListener('input', function (event) {
    userEnteredAmount = event.target.value.trim();

});

document.querySelector('.user-entered-description').addEventListener('input', function (event) {
    userEnteredDescription = event.target.value.trim();

    // Assuming you want to update the text content of the same element when it's empty
    if (userEnteredDescription === '') {
        event.target.innerText = "-";
    }
});


// Function to get the selected radio button
function findSelectedRadio() {
    const selectedRadioElement = document.querySelector('input[name="list-radio"]:checked');
    if (selectedRadioElement) {
        const label = document.querySelector(`label[for="${selectedRadioElement.id}"]`);
        if (label) {
            selectedRadio = label.textContent.trim();
        }
    } else {
        console.log('No radio button selected!');
    }
}

// Add event listener to the radio buttons
const radios = document.querySelectorAll('input[name="list-radio"]');
radios.forEach(radio => {
    radio.addEventListener('change', findSelectedRadio);
});

// -----------------------------------------------------Add Table Functionality-----------------------------------------------------
// Function to add new row

let totalIncomeAmount = 0;
let totalExpenseAmount = 0;
let netBalanceAmount = 0;

function addToTable() {
    // Ensure amount is provided
    if (!userEnteredAmount.trim()) {
        return;
    }

    let dynamicTableBody = document.querySelector('.money-flow-table');
    let dynamicTableData = document.createElement('tr');
    dynamicTableData.classList.add('bg-white', 'border-b', 'border-gray-300');

    let tableRows = document.querySelectorAll('.money-flow-table tr').length;
    dynamicTableData.id = `table-data-${tableRows + 1}`;

    dynamicTableData.innerHTML = `
        <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
            <span class="amount-text default-mode">${userEnteredAmount}</span>
            <input type="text" class="amount-input p-2 border border-gray-300 rounded-md edit-mode hidden" 
                value="${userEnteredAmount}">
        </th>

        <td class="px-6 py-4">
            <span class="description-text default-mode">${userEnteredDescription === '' ? '-' : userEnteredDescription}</span>
            <input type="text" class="description-input-second p-2 border border-gray-300 rounded-md edit-mode hidden" 
                value="${userEnteredDescription}">
        </td>

        <td class="px-6 py-4">
            <span class="state-text default-mode">${selectedRadio}</span>
            <div class="hidden edit-mode">
                <article class="state-dropdown inline-block relative">
                    <select class="state-select select-dropdown p-2 border border-gray-300 rounded-md">
                        <option>All</option>
                        <option>Revenue</option>
                        <option>Expense</option>
                    </select>
                </article>
            </div>
        </td>

        <td class="px-6 py-4">
            <div class="flex space-x-2 default-mode">
                <button class="edit-button text-blue-500 cursor-pointer">Edit</button>
                <span>|</span>
                <button class="delete-button text-red-500 cursor-pointer">Delete</button>
            </div>
            <div class="hidden edit-mode">
                <button class="save-button text-green-700 cursor-pointer">Save</button>
            </div>
        </td>
    `;

    let selectElement = dynamicTableData.querySelector('.state-select');
    let options = selectElement.querySelectorAll('option');
    options.forEach(option => {
        if (option.textContent === selectedRadio) {
            option.selected = true;
        }
    });

    dynamicTableBody.appendChild(dynamicTableData);

    // Update "No Data" message visibility
    let checkForDataInTable = document.querySelectorAll('.money-flow-table tr').length;
    let noDatatoshow = document.querySelector('.money-flow-table-no-data');
    let dataToShow = document.querySelector('.money-flow-table-with-data');
    if (checkForDataInTable >= 1) {
        noDatatoshow.style.display = 'none';  
        dataToShow.style.display = 'block';  
    } else {
        noDatatoshow.style.display = 'flex'; 
        dataToShow.style.display = 'none';  
    }

    // Add event listeners for the new row
    dynamicTableData.querySelector('.delete-button').addEventListener('click', function (event) {
        deleteTable(event);
    });
    dynamicTableData.querySelector('.edit-button').addEventListener('click', function (event) {
        editTable(event);
    });
    dynamicTableData.querySelector('.save-button').addEventListener('click', function (event) {
        saveTable(event);
    });

    // Update total income, expense, and balance
    updateTotals(userEnteredAmount, selectedRadio);
}

// Function to update totals for income and expense
function updateTotals(amount, category) {
    let parsedAmount = parseFloat(amount);

    // If it's a valid number
    if (isNaN(parsedAmount)) {
        console.log("Invalid amount:", amount);
        return;
    }

    // Check if it's income (Revenue) or expense (Expense)
    if (category === 'Revenue' || category === 'All') {
        totalIncomeAmount += parsedAmount; // Add to income
    } else if (category === 'Expense') {
        totalExpenseAmount += parsedAmount; // Add to expense
    }

    // Calculate net balance
    netBalanceAmount = totalIncomeAmount - totalExpenseAmount;

    // Update displayed totals
    updateDisplayedTotals();
}

// Function to update the displayed totals (Income, Expense, Net Balance)
function updateDisplayedTotals() {
    let totalIncome = document.querySelector('.total-income h3');
    let totalExpense = document.querySelector('.expense h3');
    let netBalance = document.querySelector('.net-balance h3');

    totalIncome.textContent = totalIncomeAmount.toFixed(2); // Display income total
    totalExpense.textContent = totalExpenseAmount.toFixed(2); // Display expense total
    netBalance.textContent = netBalanceAmount.toFixed(2); // Display net balance (income - expense)
}



// -----------------------------------------------------Delete Functionality-----------------------------------------------------

// Function to delete a row from the table
function deleteTable(event) {
    let rowToDelete = event.target.closest('tr');
    rowToDelete.remove();
}

// Function to edit a row from the table
function editTable(event) {
    let row = event.target.closest('tr');
    let defaultModes = row.querySelectorAll('.default-mode');
    let editModes = row.querySelectorAll('.edit-mode');

    defaultModes.forEach(el => el.classList.add('hidden'));
    editModes.forEach(el => el.classList.remove('hidden'));
}

document.addEventListener('click', function (event) {
    if (event.target.classList.contains('edit-button')) {
        editTable(event);
    }
});

// -----------------------------------------------------Save Functionality-----------------------------------------------------
// Function to save a row from the table
function saveTable(event) {
    let row = event.target.closest('tr'); 
    let defaultModes = row.querySelectorAll('.default-mode'); 
    let editModes = row.querySelectorAll('.edit-mode'); 

    // Get the updated values from the inputs and dropdown
    let updatedAmount = row.querySelector('.amount-input').value;
    let updatedDescription = row.querySelector('.description-input-second').value;
    let updatedState = row.querySelector('.state-select').value;

    // Update the corresponding spans with the new values
    row.querySelector('.amount-text').textContent = updatedAmount;
    row.querySelector('.description-text').textContent = updatedDescription === '' ? '-' : updatedDescription;
    row.querySelector('.state-text').textContent = updatedState;

    // Toggle visibility of default and edit modes
    defaultModes.forEach(el => el.classList.remove('hidden'));
    editModes.forEach(el => el.classList.add('hidden'));
}


