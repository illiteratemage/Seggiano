
function calculateRowTotal(quantity, unitPrice, unitsPerCase) {
    return (quantity * unitsPerCase * unitPrice).toFixed(2);
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
            const unitPrice = parseFloat(quantityInput.dataset.unitPrice);
            const unitsPerCase = parseFloat(quantityInput.dataset.unitsPerCase);
            const totalCost = calculateRowTotal(quantity, unitPrice, unitsPerCase);
            
            totalCostCell.innerText = '£' + totalCost;
            grandTotal += parseFloat(totalCost);
            caseCountTotal += quantity;
        }
    });
    document.getElementById('grandTotal').innerText = '£' + grandTotal.toFixed(2);
    document.getElementById('caseCountTotal').innerText = caseCountTotal;
}

window.onload = function() {
    document.querySelectorAll('.quantity').forEach(input => {
        input.addEventListener('input', calculateTotals);
    });
};
