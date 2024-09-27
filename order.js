function calculateRowTotal(quantity, unitPrice, unitsPerCase) {
    return (quantity * unitPrice * unitsPerCase).toFixed(2); // Correct formula for total cost per row
}

function calculateTotals() {
    let grandTotal = 0;
    let caseCountTotal = 0;

    // Select all product rows
    const rows = document.querySelectorAll('tbody tr');
    
    rows.forEach(row => {
    const quantityInput = row.querySelector('.quantity');
    const totalCostCell = row.querySelector('.total-cost');

    if (!quantityInput || !totalCostCell) {
        return; // Skip this row
    }

    // Log the row and quantity value for debugging
    console.log("Row being processed:", row);
    const quantity = parseInt(quantityInput.value) || 0;
    console.log("Quantity:", quantity);

    const unitPrice = parseFloat(quantityInput.dataset.unitPrice) || 0;
    const unitsPerCase = parseFloat(quantityInput.dataset.unitsPerCase) || 1;

    // Calculate total cost for this row
    const totalCost = calculateRowTotal(quantity, unitPrice, unitsPerCase);
    totalCostCell.innerText = '£' + totalCost;

    grandTotal += parseFloat(totalCost);
    caseCountTotal += quantity; // This is the case count being summed
});

    // Debugging output to verify totals
    console.log("Grand Total:", grandTotal);
    console.log("Case Count Total:", caseCountTotal);

    // Update the displayed totals in the HTML
    document.getElementById('grandTotal').innerText = '£' + grandTotal.toFixed(2);
    document.getElementById('caseCountTotal').innerText = caseCountTotal;
}

// Trigger the calculation on input changes
window.onload = function() {
    document.querySelector('tbody').addEventListener('input', function(e) {
        if (e.target.classList.contains('quantity')) {
            calculateTotals();
        }
    });

// New form submission code (added at the end to prevent conflict)
document.getElementById('orderForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent default form submission

    // Create a new FormData object
    const formData = new FormData();

    // Loop through each product row and append fields to FormData
    document.querySelectorAll("tbody tr").forEach(row => {
        const productCode = row.querySelector('input[name="productCode[]"]').value;
        const productName = row.querySelector('input[name="product[]"]').value;
        const unitPrice = parseFloat(row.querySelector('input[name="unitPrice[]"]').value.replace('£', ''));
        const vat = parseFloat(row.querySelector('input[name="vat[]"]').value.replace('%', '')) / 100;
        const quantity = parseInt(row.querySelector('.quantity').value) || 0;

        // Only calculate totalCost and append data if quantity is greater than 0
        if (quantity > 0) {
            // Calculate total cost for this row
            const totalCost = (quantity * unitPrice * (1 + vat)).toFixed(2);

            // Append fields to FormData
            formData.append('productCode[]', productCode);
            formData.append('product[]', productName);
            formData.append('unitPrice[]', unitPrice);
            formData.append('vat[]', vat);
            formData.append('quantity[]', quantity);
            formData.append('totalCost[]', totalCost); // Append total cost
        }
    });

    // Send the FormData using fetch
    fetch('https://script.google.com/macros/s/AKfycbyGhgGHn9z4-B3Zh_PMpRPzTwBUN_CYPPamP4FeXpG_MUzvnY5ylS-YjLVjmzImr9CrSw/exec', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.result === 'success') {
            alert('Order submitted successfully!');
        } else {
            alert('Error: ' + data.error);
        }
    })
    .catch(error => {
        console.error('There was a problem with the fetch operation:', error);
        alert('Error submitting order: ' + error.message);
    });
});
