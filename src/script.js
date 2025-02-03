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

let userInput = "";
let selectedRadio = "Income";

// Listen for user input and update the variables
document.querySelector('.user-input').addEventListener('input', function (event) {
    userInput = event.target.value.trim();

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


// -----------------------------------------------------Pass Collected Info to Table-----------------------------------------------------

let totalIncome = 0;
let totalExpense = 0;
let incomeIDs = [];
let expenseIDs = [];
let allEntries = [];

// Function to add data to the table
function addToTable() {
    // Ensure amount is provided
    if (!userInput.trim()) {
        return;
    }

    let dynamicTableBody = document.querySelector('.money-flow-table');
    if (!dynamicTableBody) {
        console.error("Table body not found!");
        return;
    }

    let tableRows = document.querySelectorAll('.money-flow-table tr').length;
    let serialNumber = tableRows + 1;

    let dynamicTableData = document.createElement('tr');
    dynamicTableData.classList.add('bg-white', 'border-b', 'border-gray-300');
    dynamicTableData.id = `table-data-${serialNumber}`;

    // Parse the amount properly (ensure it's a number)
    let amount = parseFloat(userInput) || 0;

    // Create the new row content
    dynamicTableData.innerHTML = `
        <td class="px-6 py-4 serial-number">${serialNumber}</td>
        <td class="px-6 py-4">
            <span class="description-text default-mode">${userInput}</span>
            <input type="text" class="description-input-second p-2 border border-gray-300 rounded-md edit-mode hidden" 
                value="${userInput}">
        </td>
        
        <td class="px-6 py-4">
            <span class="description-text default-mode">${selectedRadio === '' ? '-' : selectedRadio}</span>
            <input type="text" disabled class="description-input-second p-2  rounded-md edit-mode hidden" 
                value="${selectedRadio}">
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

    dynamicTableBody.appendChild(dynamicTableData);

    // Add amount to the correct total (Income or Expense)
    if (selectedRadio === "Income") {
        totalIncome += amount;
        incomeIDs.push(dynamicTableData.id);
        console.log('Income IDs:', incomeIDs);
    } else if (selectedRadio === "Expense") {
        totalExpense += amount;
        expenseIDs.push(dynamicTableData.id);
        console.log('Expense IDs:', expenseIDs);
    }

    // Store the entry
    allEntries.push({
        id: dynamicTableData.id,
        amount: amount,
        type: selectedRadio
    });

    // Update the totals in the UI
    updateTotals();

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
        deleteTable(event, amount);
    });
    dynamicTableData.querySelector('.edit-button').addEventListener('click', function (event) {
        editTable(event);
    });
    dynamicTableData.querySelector('.save-button').addEventListener('click', function (event) {
        saveTable(event);
    });

    // Refresh Serial Numbers after adding a new row
    refreshSerialNumbers();
}

// Function to update totals
function updateTotals() {
    const totalIncomeElement = document.querySelector('.total-income h3');
    const totalExpenseElement = document.querySelector('.total-expense h3');

    // Display the total as a real count (whole number or decimal if needed)
    totalIncomeElement.textContent = formatAmount(totalIncome);
    totalExpenseElement.textContent = formatAmount(totalExpense);
}

// Function to format the amount to show the proper value (e.g., 0.00 or just the count)
function formatAmount(amount) {
    return amount.toFixed(2);
}

// Function to handle row deletion
function deleteTable(event, amount) {
    let row = event.target.closest('tr');
    let rowRadio = row.querySelector('.description-text').textContent;

    // Remove amount from the totals
    if (rowRadio === "Income") {
        totalIncome -= amount;
        let index = incomeIDs.indexOf(row.id);
        if (index > -1) {
            incomeIDs.splice(index, 1);
        }
    } else if (rowRadio === "Expense") {
        totalExpense -= amount;
        let index = expenseIDs.indexOf(row.id);
        if (index > -1) {
            expenseIDs.splice(index, 1);
        }
    }

    // Remove entry from allEntries
    allEntries = allEntries.filter(entry => entry.id !== row.id);

    row.remove();
    updateTotals();
    refreshSerialNumbers();
}

// Function to refresh serial numbers after any row change
function refreshSerialNumbers() {
    let rows = document.querySelectorAll('.money-flow-table tr');
    rows.forEach((row, index) => {
        let serialCell = row.querySelector('.serial-number');
        if (serialCell) {
            serialCell.textContent = index + 1;
        }
    });
}

// Function to filter entries based on the selected filter
function filterEntries(type) {
    let filteredEntries = allEntries.filter(entry => type === 'All' || entry.type === type);

    let dynamicTableBody = document.querySelector('.money-flow-table');
    dynamicTableBody.innerHTML = '';

    // Re-add the filtered rows to the table
    filteredEntries.forEach(entry => {
        let dynamicTableData = document.createElement('tr');
        dynamicTableData.classList.add('bg-white', 'border-b', 'border-gray-300');
        dynamicTableData.id = entry.id;

        dynamicTableData.innerHTML = `
            <td class="px-6 py-4 serial-number">${entry.id}</td>
            <td class="px-6 py-4">
                <span class="description-text default-mode">${entry.amount}</span>
                <input type="text" class="description-input-second p-2 border border-gray-300 rounded-md edit-mode hidden" 
                    value="${entry.amount}">
            </td>

            <td class="px-6 py-4">
                <span class="state-text default-mode">${entry.type}</span>
                     <div class="state-dropdown-container hidden edit-mode">
                        <article class="state-dropdown inline-block relative">
                             <select class="state-select select-dropdown p-2 border border-gray-300 rounded-md">
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

        dynamicTableBody.appendChild(dynamicTableData);

        dynamicTableData.querySelector('.delete-button').addEventListener('click', function (event) {
            deleteTable(event, entry.amount);
        });
        dynamicTableData.querySelector('.edit-button').addEventListener('click', function (event) {
            editTable(event);
        });
        dynamicTableData.querySelector('.save-button').addEventListener('click', function (event) {
            saveTable(event);
        });
    });

    // Recalculate totals after filtering
    recalculateTotals();
}

// Function to recalculate totals after filtering
function recalculateTotals() {
    totalIncome = allEntries.filter(entry => entry.type === "Income").reduce((acc, entry) => acc + entry.amount, 0);
    totalExpense = allEntries.filter(entry => entry.type === "Expense").reduce((acc, entry) => acc + entry.amount, 0);

    updateTotals();
}

// Reset the form values
function resetForm() {
    const inputField = document.querySelector('.user-input');
    if (inputField) {
        inputField.value = "";
    }

    const defaultRadio = document.querySelector('input[name="list-radio"]:first-child');
    if (defaultRadio) {
        defaultRadio.checked = true;
    }

    userInput = "";
    selectedRadio = "Income";
}

// -----------------------------------------------------Save Functionality-----------------------------------------------------
document.addEventListener('click', function (event) {
    let target = event.target;

    if (target.classList.contains('save-button')) {
        let row = target.closest('tr');
        let defaultModes = row.querySelectorAll('.default-mode');
        let editModes = row.querySelectorAll('.edit-mode');

        defaultModes.forEach(el => el.classList.remove('hidden'));
        editModes.forEach(el => el.classList.add('hidden'));
    }

});


// -----------------------------------------------------Edit and Delete Functionality-----------------------------------------------------

// Function to delete a row from the table
// document.addEventListener('click', function (event) {
//     let target = event.target;

//     if (target.classList.contains('edit-button')) {
//         let row = target.closest('tr');
//         let defaultModes = row.querySelectorAll('.default-mode');
//         let editModes = row.querySelectorAll('.edit-mode');

//         // Hide default mode and show edit mode
//         defaultModes.forEach(el => el.classList.add('hidden'));
//         editModes.forEach(el => el.classList.remove('hidden'));
//     }

//     if (target.classList.contains('delete-button')) {
//         target.closest('tr').remove();
//         updateTableVisibility();
//     }

//     if (target.classList.contains('save-button')) {
//         let row = target.closest('tr');
//         let defaultModes = row.querySelectorAll('.default-mode');
//         let editModes = row.querySelectorAll('.edit-mode');

//         // Save logic for the data and hide the input/select and show the default content
//         // For example, updating the values based on the input fields:
//         let descriptionInput = row.querySelector('.description-input-second');
//         let stateSelect = row.querySelector('.state-select');
        
//         // Update the values
//         row.querySelector('.description-text').textContent = descriptionInput.value;
//         row.querySelector('.state-text').textContent = stateSelect.value;

//         // Hide edit mode and show default mode
//         defaultModes.forEach(el => el.classList.remove('hidden'));
//         editModes.forEach(el => el.classList.add('hidden'));
//     }
// });

// function updateTableVisibility() {
//     let tableBody = document.querySelector('.money-flow-table tbody');
//     let noDataMessage = document.querySelector('.money-flow-table-no-data');
//     let dataTable = document.querySelector('.money-flow-table-with-data');

//     if (tableBody.children.length === 0) {
//         noDataMessage.style.display = 'flex';
//         dataTable.style.display = 'none';
//     } else {
//         noDataMessage.style.display = 'none';
//         dataTable.style.display = 'block';
//     }
// }
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

document.addEventListener('click', function (event) {
    let target = event.target;

    

    // if (target.classList.contains('edit-button')) {
    //     let row = target.closest('tr');
    //     let defaultModes = row.querySelectorAll('.default-mode');
    //     let editModes = row.querySelectorAll('.edit-mode');
        
    //     // Hide default mode and show edit mode
    //     defaultModes.forEach(el => el.classList.add('hidden'));
    //     editModes.forEach(el => el.classList.remove('hidden'));

    //     // Ensure the dropdown within edit mode is visible
    //     let stateDropdownContainer = row.querySelector('.state-dropdown-container');
    //     if (stateDropdownContainer) {
    //         stateDropdownContainer.classList.remove('hidden');
    //     }
    // }

    if (target.classList.contains('delete-button')) {
        target.closest('tr').remove();
        updateTableVisibility();
    }

    if (target.classList.contains('save-button')) {
        let row = target.closest('tr');
        let defaultModes = row.querySelectorAll('.default-mode');
        let editModes = row.querySelectorAll('.edit-mode');
        
        let descriptionInput = row.querySelector('.description-input-second');
        let stateSelect = row.querySelector('.state-select');
        
        row.querySelector('.description-text').textContent = descriptionInput.value;
        row.querySelector('.state-text').textContent = stateSelect.value;

        defaultModes.forEach(el => el.classList.remove('hidden'));
        editModes.forEach(el => el.classList.add('hidden'));
    }
});
