// -----------------------------------------------------Date-----------------------------------------------------

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


document.querySelector('.user-input').addEventListener('input', function (event) {
    userInput = event.target.value.trim();

});


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


function addToTable() {

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


    let amount = parseFloat(userInput) || 0;


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


    if (selectedRadio === "Income") {
        totalIncome += amount;
        incomeIDs.push(dynamicTableData.id);
        console.log('Income IDs:', incomeIDs);
    } else if (selectedRadio === "Expense") {
        totalExpense += amount;
        expenseIDs.push(dynamicTableData.id);
        console.log('Expense IDs:', expenseIDs);
    }


    allEntries.push({
        id: dynamicTableData.id,
        amount: amount,
        type: selectedRadio
    });


    updateTotals();


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


    dynamicTableData.querySelector('.delete-button').addEventListener('click', function (event) {
        deleteTable(event, amount);
    });
    dynamicTableData.querySelector('.edit-button').addEventListener('click', function (event) {
        editTable(event);
    });
    dynamicTableData.querySelector('.save-button').addEventListener('click', function (event) {
        saveTable(event);
    });

    document.querySelector('#user-input').value = "";
    refreshSerialNumbers();
}


function updateTotals() {
    const totalIncomeElement = document.querySelector('.total-income h3');
    const totalExpenseElement = document.querySelector('.total-expense h3');


    totalIncomeElement.textContent = formatAmount(totalIncome);
    totalExpenseElement.textContent = formatAmount(totalExpense);
}


function formatAmount(amount) {
    return amount.toFixed(2);
}


function deleteTable(event, amount) {
    let row = event.target.closest('tr');
    let rowRadio = row.querySelector('.description-text').textContent;


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


    allEntries = allEntries.filter(entry => entry.id !== row.id);

    row.remove();
    updateTotals();
    refreshSerialNumbers();
}


function refreshSerialNumbers() {
    let rows = document.querySelectorAll('.money-flow-table tr');
    rows.forEach((row, index) => {
        let serialCell = row.querySelector('.serial-number');
        if (serialCell) {
            serialCell.textContent = index + 1;
        }
    });
}


function filterEntries(type) {
    let filteredEntries = allEntries.filter(entry => type === 'All' || entry.type === type);

    let dynamicTableBody = document.querySelector('.money-flow-table');
    dynamicTableBody.innerHTML = '';

    let serialNumber = 1;  // Initialize serial number

    filteredEntries.forEach(entry => {
        let dynamicTableData = document.createElement('tr');
        dynamicTableData.classList.add('bg-white', 'border-b', 'border-gray-300');

        dynamicTableData.innerHTML = `
            <td class="px-6 py-4 serial-number">${serialNumber}</td>  <!-- Use serialNumber here -->
            <td class="px-6 py-4">
                <span class="description-text default-mode">${entry.amount}</span>
                <input type="text" class="description-input-second p-2 border border-gray-300 rounded-md edit-mode hidden" 
                    value="${entry.amount}">
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

        dynamicTableData.querySelector('.delete-button').addEventListener('click', function (event) {
            deleteTable(event, entry.amount);
        });
        dynamicTableData.querySelector('.edit-button').addEventListener('click', function (event) {
            editTable(event);
        });
        dynamicTableData.querySelector('.save-button').addEventListener('click', function (event) {
            saveTable(event);
        });

        serialNumber++;  
    });
    
    recalculateTotals();

    
}



function recalculateTotals() {
    totalIncome = allEntries.filter(entry => entry.type === "Income").reduce((acc, entry) => acc + entry.amount, 0);
    totalExpense = allEntries.filter(entry => entry.type === "Expense").reduce((acc, entry) => acc + entry.amount, 0);

    updateTotals();
}


// function resetForm() {
//     const inputField = document.querySelector('#user-input');
//     if (inputField) {
//         inputField.value = "";
//     }

//     const defaultRadio = document.querySelector('input[name="list-radio"]:first-child');
//     if (defaultRadio) {
//         defaultRadio.checked = true;
//     }

//     userInput = "";
//     selectedRadio = "Income";
// }

// -----------------------------------------------------Save Functionality-----------------------------------------------------
function saveTable(event) {
    let row = event.target.closest('tr');


    let defaultModes = row.querySelectorAll('.default-mode');
    let editModes = row.querySelectorAll('.edit-mode');


    let descriptionInput = row.querySelector('.description-input-second');


    if (!descriptionInput) {
        console.error('Description input not found!');
        return;
    }


    let descriptionText = row.querySelector('.description-text');


    if (!descriptionText) {
        console.error('Description text element not found!');
        return;
    }


    descriptionText.textContent = descriptionInput.value;


    defaultModes.forEach(el => el.classList.remove('hidden'));
    editModes.forEach(el => el.classList.add('hidden'));


    let incomeRadio = document.getElementById('radio-income');
    let expenseRadio = document.getElementById('radio-expense');

    let amount = parseFloat(descriptionInput.value) || 0;


    if (incomeRadio.checked) {
        totalIncome = amount;
    } else if (expenseRadio.checked) {
        totalExpense = amount;
    }


    updateTotals();
}

// -----------------------------------------------------Edit and Delete Functionality-----------------------------------------------------
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


