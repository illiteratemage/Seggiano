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

        // Skip rows without quantity inputs or total cost cells (such as subheaders)
        if (!quantityInput || !totalCostCell) {
            return; // Skip to the next row
        }

        // Get the quantity entered by the user
        const quantity = parseInt(quantityInput.value) || 0;
        const unitPrice = parseFloat(quantityInput.dataset.unitPrice) || 0;
        const unitsPerCase = parseFloat(quantityInput.dataset.unitsPerCase) || 1; // Default to 1 if missing

        // Calculate total cost for this row
        const totalCost = calculateRowTotal(quantity, unitPrice, unitsPerCase);
        totalCostCell.innerText = '£' + totalCost;

        // Add to grand total
        grandTotal += parseFloat(totalCost);

        // Simply add the quantity to case count total (since each quantity = 1 case)
        caseCountTotal += quantity;
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
