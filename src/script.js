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
    let serialNumber = tableRows + 1; // Generate Serial Number dynamically

    let dynamicTableData = document.createElement('tr');
    dynamicTableData.classList.add('bg-white', 'border-b', 'border-gray-300');
    dynamicTableData.id = `table-data-${serialNumber}`;

    dynamicTableData.innerHTML = `
        <td class="px-6 py-4 serial-number">${serialNumber}</td>
        <td class="px-6 py-4">
            <span class="description-text default-mode">${userInput}</span>
            <input type="text" class="description-input-second p-2 border border-gray-300 rounded-md edit-mode hidden" 
                value="${userInput}">
        </td>
        
        <td class="px-6 py-4">
            <span class="description-text default-mode">${selectedRadio === '' ? '-' : selectedRadio}</span>
            <input type="text" class="description-input-second p-2 border border-gray-300 rounded-md edit-mode hidden" 
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
    updateTotals(userInput, selectedRadio);

    // Refresh Serial Numbers after adding a new row
    refreshSerialNumbers();
}

// Function to refresh serial numbers after adding/deleting a row
function refreshSerialNumbers() {
    let rows = document.querySelectorAll('.money-flow-table tr');
    rows.forEach((row, index) => {
        let serialCell = row.querySelector('.serial-number');
        if (serialCell) {
            serialCell.textContent = index + 1;
        }
    });
}

function resetForm() {
    // Reset the user input field (clear its value)
    const inputField = document.querySelector('.user-input');
    if (inputField) {
        inputField.value = ""; // Reset the value to empty
    }
    
    // Reset the radio button (reset to the first radio button as default)
    const defaultRadio = document.querySelector('input[name="list-radio"]:first-child');
    if (defaultRadio) {
        defaultRadio.checked = true;
    }

    // Clear the `userInput` and `selectedRadio` variables as well
    userInput = "";  // Reset userInput to ensure the variable is cleared
    selectedRadio = "Income";  // Reset to the default selection
}

// -----------------------------------------------------Delete Functionality-----------------------------------------------------

// Function to delete a row from the table
document.addEventListener('click', function (event) {
    let target = event.target;

    if (target.classList.contains('edit-button')) {
        let row = target.closest('tr');
        let defaultModes = row.querySelectorAll('.default-mode');
        let editModes = row.querySelectorAll('.edit-mode');

        defaultModes.forEach(el => el.classList.add('hidden'));
        editModes.forEach(el => el.classList.remove('hidden'));
    }

    if (target.classList.contains('delete-button')) {
        target.closest('tr').remove();
        updateTableVisibility(); // Check if table has no rows left
    }

    if (target.classList.contains('save-button')) {
        let row = target.closest('tr');
        let amountInput = row.querySelector('.amount-input');
        let descriptionInput = row.querySelector('.description-input-second');

        row.querySelector('.amount-text').textContent = amountInput.value;
        row.querySelector('.description-text').textContent = descriptionInput.value;

        let defaultModes = row.querySelectorAll('.default-mode');
        let editModes = row.querySelectorAll('.edit-mode');

        defaultModes.forEach(el => el.classList.remove('hidden'));
        editModes.forEach(el => el.classList.add('hidden'));
    }
});

function updateTableVisibility() {
    let tableBody = document.querySelector('.money-flow-table tbody');
    let noDataMessage = document.querySelector('.money-flow-table-no-data');
    let dataTable = document.querySelector('.money-flow-table-with-data');

    if (tableBody.children.length === 0) {
        noDataMessage.style.display = 'flex';
        dataTable.style.display = 'none';
    } else {
        noDataMessage.style.display = 'none';
        dataTable.style.display = 'block';
    }
}
