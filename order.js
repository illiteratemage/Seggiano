
function calculateRowTotal(quantity, unitPrice, unitsPerCase) {
    return (quantity * unitPrice * unitsPerCase).toFixed(2);
}

function calculateTotals() {
    let grandTotal = 0;
    let caseCountTotal = 0;
    const rows = document.querySelectorAll('tbody tr');
    
    const totalCostCell = row.querySelector('.total-cost');
        
        // Skip rows that don't have a quantity input or total cost cell (like subheaders)
        if (!quantityInput || !totalCostCell) {
            return; // Skip this row and move to the next one
        }
        
        const quantity = parseInt(quantityInput.value) || 0;
        
        // Add this to see what value is being read from the quantity input
        console.log("Quantity:", quantity);

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
