let totalAmount = 0;
let srNoCounter = 1;
let editRow = null;

function addItem() {
    const productName = document.getElementById('product-name').value;
    const sqFeetLength = parseFloat(document.getElementById('sq-feet-length').value);
    const sqFeetWidth = parseFloat(document.getElementById('sq-feet-width').value);
    const rate = parseFloat(document.getElementById('rate').value);

    if (productName && rate > 0) {
        let totalSqFeet = 1;  // Default to 1 if dimensions are not provided
        if (!isNaN(sqFeetLength) && !isNaN(sqFeetWidth)) {
            totalSqFeet = sqFeetLength * sqFeetWidth;
        }

        const totalAmountForItem = totalSqFeet * rate;

        if (editRow) {
            // Update existing row
            totalAmount -= parseFloat(editRow.cells[6].textContent.replace('₹', ''));
            editRow.cells[1].textContent = productName;
            editRow.cells[2].textContent = !isNaN(sqFeetLength) ? sqFeetLength.toFixed(2) : 'N/A';
            editRow.cells[3].textContent = !isNaN(sqFeetWidth) ? sqFeetWidth.toFixed(2) : 'N/A';
            editRow.cells[4].textContent = totalSqFeet.toFixed(2);
            editRow.cells[5].textContent = `₹${rate.toFixed(2)}`;
            editRow.cells[6].textContent = `₹${totalAmountForItem.toFixed(2)}`;

            totalAmount += totalAmountForItem;
            editRow = null;
        } else {
            // Add new row
            const billTableBody = document.querySelector('#bill-table tbody');
            const newRow = document.createElement('tr');

            newRow.innerHTML = `
                <td>${srNoCounter}</td>
                <td>${productName}</td>
                <td>${!isNaN(sqFeetLength) ? sqFeetLength.toFixed(2) : 'N/A'}</td>
                <td>${!isNaN(sqFeetWidth) ? sqFeetWidth.toFixed(2) : 'N/A'}</td>
                <td>${totalSqFeet.toFixed(2)}</td>
                <td>₹${rate.toFixed(2)}</td>
                <td>₹${totalAmountForItem.toFixed(2)}</td>
                <td class="action-column">
                    <button onclick="editItem(this)">Edit</button>
                    <button onclick="deleteItem(this)">Delete</button>
                </td>
            `;

            billTableBody.appendChild(newRow);
            totalAmount += totalAmountForItem;
            srNoCounter++;
        }

        document.getElementById('total-amount').textContent = `${totalAmount.toFixed(2)}`;
        document.getElementById('bill-form').reset();
    } else {
        alert('Please enter valid item details.');
    }
}

function editItem(button) {
    editRow = button.parentElement.parentElement;
    document.getElementById('product-name').value = editRow.cells[1].textContent;
    document.getElementById('sq-feet-length').value = editRow.cells[2].textContent !== 'N/A' ? editRow.cells[2].textContent : '';
    document.getElementById('sq-feet-width').value = editRow.cells[3].textContent !== 'N/A' ? editRow.cells[3].textContent : '';
    document.getElementById('rate').value = editRow.cells[5].textContent.replace('₹', '');
}

function deleteItem(button) {
    const row = button.parentElement.parentElement;
    const amount = parseFloat(row.cells[6].textContent.replace('₹', ''));
    totalAmount -= amount;
    document.getElementById('total-amount').textContent = `${totalAmount.toFixed(2)}`;
    row.remove();
}

function calculateBalance() {
    const paidAmount = parseFloat(document.getElementById('paid-amount').value) || 0;
    const remainingAmount = totalAmount - paidAmount;
    document.getElementById('remaining-amount').textContent = `${remainingAmount.toFixed(2)}`;
    document.getElementById('display-paid-amount').textContent = `${paidAmount.toFixed(2)}`;
}

function preparePrint() {
    const billTable = document.getElementById('bill-table').outerHTML;
    const printWindow = window.open('', '', 'width=800,height=600');
    printWindow.document.write('<html><head><title>Print Bill</title><link rel="stylesheet" href="style.css"></head><body>');
    printWindow.document.write('<div class="container">');
    printWindow.document.write(document.querySelector('.logo').outerHTML);
    printWindow.document.write('<h2>Bill Details</h2>');
    printWindow.document.write(billTable);
    printWindow.document.write(`<h3>Total Amount: ₹<span>${totalAmount.toFixed(2)}</span></h3>`);
    printWindow.document.write(`<h3>Paid Amount: ₹<span>${document.getElementById('display-paid-amount').textContent}</span></h3>`);
    printWindow.document.write(`<h3>Remaining Balance: ₹<span>${document.getElementById('remaining-amount').textContent}</span></h3>`);
    printWindow.document.write('</div>');
    printWindow.document.close();
    printWindow.print();
}
