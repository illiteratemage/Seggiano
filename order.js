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

    // Construct the products array
    let products = [];
    const rows = document.querySelectorAll('tbody tr');

    rows.forEach(row => {
        const productCode = row.querySelector('input[name="productCode"]').value;
        const productName = row.querySelector('input[name="product"]').value;
        const unitPrice = row.querySelector('input[name="unitPrice"]').value;
        const vat = row.querySelector('input[name="vat"]').value;
        const quantity = row.querySelector('.quantity').value;

        // Only include products with quantities greater than 0
        if (quantity > 0) {
            const totalCost = (quantity * unitPrice).toFixed(2);
            products.push({
                productCode: productCode,
                product: productName,
                unitPrice: parseFloat(unitPrice),
                vat: vat,
                quantity: parseInt(quantity),
                totalCost: totalCost
            });
        }
    });

    // Construct the JSON payload
    const formData = {
        products: products,
        caseCountTotal: products.length, // Assuming each row is 1 case
        grandTotal: products.reduce((sum, product) => sum + parseFloat(product.totalCost), 0)
    };

    // Send the data as JSON to your Google Apps Script
    fetch('https://script.google.com/macros/s/AKfycbzwIvfhB0bfwWsGAllft11iv9n-1eYVB4gL8aDBEEdW_h0S_iD2qwE1anOYNMzGa7eEMw/exec', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData) // Convert the formData object to JSON
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
        console.error('Error:', error);
    });
});
};
