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
};
