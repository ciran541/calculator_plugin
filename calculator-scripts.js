// Initialize all functionality when the window loads
window.onload = function() {
    toggleSpouseFields();
    toggleEmploymentFields();
    toggleSpouseEmploymentFields();
    updateIncomeLabels();
    updateSpouseIncomeLabels();
    setupModalHandlers();
};

// Modal handling functions
function setupModalHandlers() {
    const modal = document.getElementById('ipaModal');
    const closeBtn = document.getElementsByClassName('close')[0];
    
    function openIpaForm() {
        const modal = document.getElementById('ipaModal');
        modal.style.display = "flex"; // Changed to flex
        document.body.style.overflow = 'hidden';
        requestAnimationFrame(() => {
            modal.classList.add('show');
        });
    }
    
    function closeModal() {
        const modal = document.getElementById('ipaModal');
        modal.classList.remove('show');
        modal.classList.add('hide');
        setTimeout(() => {
            modal.style.display = "none";
            modal.classList.remove('hide');
            document.body.style.overflow = '';
        }, 300);
    }
    
    closeBtn.onclick = closeModal;
    
    window.onclick = function(event) {
        if (event.target === modal) {
            closeModal();
        }
    }
}

function openIpaForm() {
    const modal = document.getElementById('ipaModal');
    modal.style.display = "block";
}

function updateBorrowerTitle() {
    const purchaseType = document.querySelector('input[name="purchaseType"]:checked').value;
    const borrower1Title = document.getElementById('borrower1Title');
    borrower1Title.textContent = (purchaseType === 'single') ? 'Income Details' : "Borrower 1's Income Details";
}

function toggleSpouseFields() {
    const purchaseType = document.querySelector('input[name="purchaseType"]:checked').value;
    const spouseFields = document.getElementById('spouseFields');
    spouseFields.style.display = (purchaseType === 'joint') ? 'block' : 'none';
    updateBorrowerTitle();
}

function toggleEmploymentFields() {
    const employmentType = document.querySelector('input[name="employmentType"]:checked').value;
    const employeeFields = document.querySelectorAll('.employeeField');
    const selfEmployedFields = document.querySelectorAll('.selfEmployedField');
    const noaFields = document.querySelectorAll('.noaField');

    employeeFields.forEach(field => {
        field.style.display = (employmentType === 'employee') ? 'block' : 'none';
    });

    selfEmployedFields.forEach(field => {
        field.style.display = (employmentType === 'self-employed') ? 'block' : 'none';
    });

    noaFields.forEach(field => {
        field.style.display = 'block';
    });
}

function toggleSpouseEmploymentFields() {
    const spouseEmploymentType = document.querySelector('input[name="spouseEmploymentType"]:checked').value;
    const spouseEmployeeFields = document.querySelectorAll('.spouseEmployeeField');
    const spouseSelfEmployedFields = document.querySelectorAll('.spouseSelfEmployedField');
    const spouseNoaFields = document.querySelectorAll('.spouseNoaField');

    spouseEmployeeFields.forEach(field => {
        field.style.display = (spouseEmploymentType === 'employee') ? 'block' : 'none';
    });

    spouseSelfEmployedFields.forEach(field => {
        field.style.display = (spouseEmploymentType === 'self-employed') ? 'block' : 'none';
    });

    spouseNoaFields.forEach(field => {
        field.style.display = 'block';
    });
}

function updateIncomeLabels() {
    const employmentType = document.querySelector('input[name="employmentType"]:checked').value;
    const noaLabel = document.querySelector('label[for="noa"]');
    const noaInput = document.getElementById('noa');

    if (employmentType === 'employee') {
        noaLabel.textContent = 'Annual Bonus (SGD)';
        noaInput.placeholder = 'Enter your annual bonus';
    } else if (employmentType === 'self-employed') {
        noaLabel.textContent = 'Annual Income (SGD)';
        noaInput.placeholder = 'Enter your annual income';
    }
}

function updateSpouseIncomeLabels() {
    const spouseEmploymentType = document.querySelector('input[name="spouseEmploymentType"]:checked').value;
    const spouseNoaLabel = document.querySelector('label[for="spouseNoa"]');
    const spouseNoaInput = document.getElementById('spouseNoa');

    if (spouseEmploymentType === 'employee') {
        spouseNoaLabel.textContent = 'Annual Bonus (SGD)';
        spouseNoaInput.placeholder = 'Enter Borrower 2\'s annual bonus';
    } else if (spouseEmploymentType === 'self-employed') {
        spouseNoaLabel.textContent = 'Annual Income (SGD)';
        spouseNoaInput.placeholder = 'Enter Borrower 2\'s annual income';
    }
}

function formatNumberWithCommas(number) {
    return Math.round(number).toLocaleString('en-US', { 
        minimumFractionDigits: 0, 
        maximumFractionDigits: 0 
    });
}

function validateField(fieldId) {
    const field = document.getElementById(fieldId);
    const errorMessage = document.getElementById(`${fieldId}-error`);
    const value = field.value.trim();

    if (fieldId === 'mobileNumber') {
        const mobileRegex = /^[0-9]{8,15}$/;
        if (!mobileRegex.test(value)) {
            errorMessage.style.display = 'block';
            return false;
        }
    } else if (fieldId === 'emailAddress') {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            errorMessage.style.display = 'block';
            return false;
        }
    } else {
        if (!value) {
            errorMessage.style.display = 'block';
            return false;
        }
    }
    errorMessage.style.display = 'none';
    return true;
}

function validateRequiredFields() {
    const purchaseType = document.querySelector('input[name="purchaseType"]:checked').value;
    const employmentType = document.querySelector('input[name="employmentType"]:checked').value;
    const spouseEmploymentType = document.querySelector('input[name="spouseEmploymentType"]:checked').value;

    const fields = ['propertyPrice', 'age', 'creditCardPayment', 'noa'];

    if (employmentType === 'employee') {
        fields.push('basicSalary');
    }

    if (purchaseType === 'joint') {
        fields.push('spouseAge', 'spouseCreditCardPayment', 'spouseNoa');
        if (spouseEmploymentType === 'employee') {
            fields.push('spouseBasicSalary');
        }
    }

    let isValid = true;
    fields.forEach(field => {
        if (!validateField(field)) {
            isValid = false;
        }
    });

    return isValid;
}


function calculateEligibility() {
    if (!validateRequiredFields()) {
        return;
    }

    const employmentType = document.querySelector('input[name="employmentType"]:checked').value;
    const basicSalary = parseFloat(document.getElementById('basicSalary').value) || 0;
    const noa = parseFloat(document.getElementById('noa').value) || 0;
    const purchaseType = document.querySelector('input[name="purchaseType"]:checked').value;
    const propertyType = document.querySelector('input[name="propertyType"]:checked').value;
    const age = parseInt(document.getElementById('age').value) || 0;
    const propertyPrice = parseFloat(document.getElementById('propertyPrice').value) || 0;
    const creditCardPayment = parseFloat(document.getElementById('creditCardPayment').value) || 0;

    let spouseBasicSalary = 0;
    let spouseNoa = 0;
    let spouseCreditCardPayment = 0;
    let spouseAge = 0;
    let spouseEmploymentType = 'employee'; // Default to employee if not joint

    if (purchaseType === 'joint') {
        spouseBasicSalary = parseFloat(document.getElementById('spouseBasicSalary').value) || 0;
        spouseNoa = parseFloat(document.getElementById('spouseNoa').value) || 0;
        spouseCreditCardPayment = parseFloat(document.getElementById('spouseCreditCardPayment').value) || 0;
        spouseAge = parseInt(document.getElementById('spouseAge').value) || 0;
        spouseEmploymentType = document.querySelector('input[name="spouseEmploymentType"]:checked').value;
    }

    let applicantIncome = (employmentType === 'employee') ? basicSalary + (noa * 0.7 / 12) : noa * 0.7 / 12;
    let spouseIncome = (purchaseType === 'joint' && spouseEmploymentType === 'employee') 
        ? spouseBasicSalary + (spouseNoa * 0.7 / 12) 
        : spouseNoa * 0.7 / 12;

    const totalIncome = applicantIncome + spouseIncome;
    let weightedAverageAge = (purchaseType === 'joint') 
        ? Math.ceil(((age * applicantIncome) + (spouseAge * spouseIncome)) / totalIncome) 
        : age;

    const maxAgeLimit = 65;
    const maxLoanTenure = (propertyType === 'hdb') ? 25 : 30;
    const tenure = Math.min(maxAgeLimit - weightedAverageAge, maxLoanTenure);

    const totalCommitments = creditCardPayment + spouseCreditCardPayment;
    const msrAvailable = totalIncome * 0.30;
    const tdsrAvailable = Math.max((totalIncome * 0.55) - totalCommitments, 0);
    const availableAmount = (propertyType === 'hdb') ? Math.min(msrAvailable, tdsrAvailable) : tdsrAvailable;

    const finalLoanAmount = PV(0.048 / 12, tenure * 12, availableAmount);
    const loanPercentage = Math.min((finalLoanAmount / propertyPrice) * 100, 75).toFixed(2);

    const resultDiv = document.getElementById('result');
    const resultContainer = document.querySelector('.result-loan_container');

    resultDiv.innerHTML = `
    <h4 class="loan-details-title">Loan Eligibility Details</h4>
    <div class="result-para">The indicative loan amount you can borrow for a <strong class="highlight-text">${propertyType.toUpperCase()}</strong> property is <strong class="highlight-text">SGD ${formatNumberWithCommas(finalLoanAmount)}</strong> over <strong class="highlight-text">${tenure} years</strong>.</div>
    <div class="result-para">You will be able to loan <strong class="highlight-text">${loanPercentage}%</strong> of a <strong class="highlight-text">SGD ${formatNumberWithCommas(propertyPrice)}</strong> property purchase.</div>
    <div class="result-para">The weighted average age used for determining tenure is <strong class="highlight-text">${weightedAverageAge}</strong>.</div>
`;
    resultContainer.style.display = 'block';

    // Store results in hidden fields
    document.getElementById('calculatedLoanAmount').value = finalLoanAmount;
    document.getElementById('calculatedLoanPercentage').value = loanPercentage;
    document.getElementById('calculatedTenure').value = tenure;
    document.getElementById('calculatedWeightedAge').value = weightedAverageAge;

    // Scroll to results with animation
    setTimeout(() => {
        const resultPosition = resultContainer.getBoundingClientRect().top + window.scrollY - 100;
        window.scrollTo({
            top: resultPosition,
            behavior: 'smooth'
        });
    }, 100);
}

function validateRequiredFields() {
    const purchaseType = document.querySelector('input[name="purchaseType"]:checked').value;
    const employmentType = document.querySelector('input[name="employmentType"]:checked').value;
    let spouseEmploymentType = 'employee'; // Default value

    const fields = ['propertyPrice', 'age', 'creditCardPayment', 'noa'];

    if (employmentType === 'employee') {
        fields.push('basicSalary');
    }

    if (purchaseType === 'joint') {
        // Get spouse employment type only if joint is selected
        spouseEmploymentType = document.querySelector('input[name="spouseEmploymentType"]:checked').value;
        
        fields.push('spouseAge', 'spouseCreditCardPayment', 'spouseNoa');
        
        if (spouseEmploymentType === 'employee') {
            fields.push('spouseBasicSalary');
        }
    }

    let isValid = true;
    fields.forEach(field => {
        if (!validateField(field)) {
            isValid = false;
        }
    });

    return isValid;
}

// Financial calculation functions
function PV(rate, nper, pmt) {
    if (rate === 0) return pmt * nper;
    return pmt * (1 - Math.pow(1 + rate, -nper)) / rate;
}

function PMT(rate, nper, pv) {
    if (rate === 0) return pv / nper;
    return pv * rate / (1 - Math.pow(1 + rate, -nper));
}

// Remove existing event listeners and add new ones
document.querySelectorAll('input[name="employmentType"]').forEach(radio => {
    radio.addEventListener('change', function() {
        toggleEmploymentFields();
        updateIncomeLabels();
    });
});

document.querySelectorAll('input[name="spouseEmploymentType"]').forEach(radio => {
    radio.addEventListener('change', function() {
        toggleSpouseEmploymentFields();
        updateSpouseIncomeLabels();
    });
});

document.querySelectorAll('input[name="purchaseType"]').forEach(radio => {
    radio.addEventListener('change', function() {
        toggleSpouseFields();
        updateBorrowerTitle();
    });
});

// Form submission handling
document.getElementById('ipaForm').addEventListener('submit', function(e) {
    e.preventDefault();

    if (!validateField('name') || !validateField('emailAddress') || !validateField('mobileNumber')) {
        return;
    }

    const formData = new FormData(this);
    
    // Add calculated values
    formData.append('calculatedLoanAmount', document.getElementById('calculatedLoanAmount').value);
    formData.append('calculatedLoanPercentage', document.getElementById('calculatedLoanPercentage').value);
    formData.append('calculatedTenure', document.getElementById('calculatedTenure').value);
    formData.append('calculatedWeightedAge', document.getElementById('calculatedWeightedAge').value);
    
    // Add property and borrower details
    formData.append('propertyPrice', document.getElementById('propertyPrice').value);
    formData.append('propertyType', document.querySelector('input[name="propertyType"]:checked').value);
    formData.append('purchaseType', document.querySelector('input[name="purchaseType"]:checked').value);
    formData.append('borrower1EmploymentType', document.querySelector('input[name="employmentType"]:checked').value);
    formData.append('borrower1Age', document.getElementById('age').value);
    formData.append('borrower1BasicSalary', document.getElementById('basicSalary').value);
    formData.append('borrower1AnnualBonus', document.getElementById('noa').value);
    formData.append('borrower1CreditCardPayment', document.getElementById('creditCardPayment').value);

    // Add spouse details if joint
    const purchaseType = document.querySelector('input[name="purchaseType"]:checked').value;
    if (purchaseType === 'joint') {
        formData.append('spouseEmploymentType', document.querySelector('input[name="spouseEmploymentType"]:checked').value);
        formData.append('spouseAge', document.getElementById('spouseAge').value);
        formData.append('spouseBasicSalary', document.getElementById('spouseBasicSalary').value);
        formData.append('spouseNoa', document.getElementById('spouseNoa').value);
        formData.append('spouseCreditCardPayment', document.getElementById('spouseCreditCardPayment').value);
    }

    const scriptURL = 'https://script.google.com/macros/s/AKfycbx3NAkQ4n_aSXNjR25GlGSDxDYzuSN6jZAPRdsd1pewRuA1WztpPXSQm9mb6IlOZL0i/exec';

    fetch(scriptURL, {
        method: 'POST',
        body: formData
    })
    .then(response => {
        if (response.ok) {
            alert("Thank you! Your form is submitted successfully.");
            document.getElementById('ipaModal').style.display = "none";
            window.location.reload();
        } else {
            throw new Error('Network response was not ok.');
        }
    })
    .catch(error => {
        console.error('Error!', error.message);
        alert("There was an error submitting your form. Please try again.");
    });
});
// Input validation listeners
const inputFields = document.querySelectorAll('input[type="number"], input[type="text"], input[type="email"], input[type="tel"]');
inputFields.forEach(field => {
    field.addEventListener('input', function() {
        validateField(this.id);
    });
});