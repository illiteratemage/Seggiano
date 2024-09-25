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
        const productCodeElement = row.querySelector('input[name="productCode[]"]');
        const productNameElement = row.querySelector('input[name="product[]"]');
        const unitPriceElement = row.querySelector('input[name="unitPrice[]"]');
        const vatElement = row.querySelector('input[name="vat[]"]');
        const quantityElement = row.querySelector('.quantity');

        // Only process the row if all required elements exist
        if (productCodeElement && productNameElement && unitPriceElement && vatElement && quantityElement) {
            const productCode = productCodeElement.value;
            const productName = productNameElement.value;
            const unitPrice = parseFloat(unitPriceElement.value.replace('£', ''));
            const vat = parseFloat(vatElement.value.replace('%', '')) / 100;
            const quantity = parseInt(quantityElement.value) || 0;

            // Only include products with quantities greater than 0
            if (quantity > 0) {
                const totalCost = (quantity * unitPrice * (1 + vat)).toFixed(2);
                products.push({
                    productCode: productCode,
                    product: productName,
                    unitPrice: unitPrice,
                    vat: vat * 100, // Keep VAT as a percentage
                    quantity: quantity,
                    totalCost: totalCost
                });
            }
        }
    });

    // Construct the JSON payload
    const formData = {
        products: products,
        caseCountTotal: products.reduce((sum, product) => sum + product.quantity, 0),
        grandTotal: products.reduce((sum, product) => sum + parseFloat(product.totalCost), 0)
    };

    // Log formData to the console for debugging
    console.log('Form data being submitted:', formData);

    // Send the data as JSON to your Google Apps Script
    fetch('https://script.google.com/macros/s/AKfycbzb7qORQ2p8O8fq1v8vMOudmho4-auNifnTSS8ZVs-EMnKqmVj8jSdZ0U1_KVEvpa0UHQ/exec', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData) // Send JSON data to the backend
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
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
