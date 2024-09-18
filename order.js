
function calculateRowTotal(quantity, unitPrice, unitsPerCase) {
    return (quantity * unitPrice * unitsPerCase).toFixed(2);
}

function calculateTotals() {
    let grandTotal = 0;
    let caseCountTotal = 0;
    const rows = document.querySelectorAll('tbody tr');
    
    rows.forEach(row => {
        const quantityInput = row.querySelector('.quantity');
        const totalCostCell = row.querySelector('.total-cost');
        
        if (quantityInput && totalCostCell) {
            const quantity = parseInt(quantityInput.value) || 0;
            const unitPrice = parseFloat(quantityInput.dataset.unitPrice) || 0;
            const unitsPerCase = parseFloat(quantityInput.dataset.unitsPerCase) || 1;
            
            // Correct calculation (quantity * unit price * units per case)
            const totalCost = calculateRowTotal(quantity, unitPrice, unitsPerCase);
            
            totalCostCell.innerText = '£' + totalCost;
            grandTotal += parseFloat(totalCost);
            caseCountTotal += quantity;
        }
    });

    // Debugging output to verify totals
    console.log("Grand Total:", grandTotal);
    console.log("Case Count Total:", caseCountTotal);

    // Update the displayed totals
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
