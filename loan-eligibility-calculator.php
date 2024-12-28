<?php
/*
Plugin Name: Loan Eligibility Calculator
Description: A plugin to calculate loan eligibility.
Version: 2.1
Author: ciranjivi
*/

// Enqueue CSS and JS with higher specificity and proper dependencies
function lec_enqueue_scripts() {
    wp_enqueue_style(
        'lec-style', 
        plugins_url('styles.css', __FILE__),
        array(), 
        '2.1'
    );
    wp_enqueue_script(
        'lec-script', 
        plugins_url('calculator-scripts.js', __FILE__), 
        array('jquery'), 
        '2.1', 
        true
    );
}
add_action('wp_enqueue_scripts', 'lec_enqueue_scripts');

// Add defer attribute to script
add_filter('script_loader_tag', 'lec_defer_scripts', 10, 3);
function lec_defer_scripts($tag, $handle, $src) {
    if ($handle === 'lec-script') {
        return str_replace(' src', ' defer src', $tag);
    }
    return $tag;
}

// Shortcode to display the calculator
function lec_calculator_shortcode() {
    ob_start();
    ?>
    <div class="loan_body">
    <div class="loan_container">
        <div class="calculator">
            <form id="loanForm" method="post" name="contact-form">
                <div class="loan_form-grid">
                    <!-- Property Details Section -->
                    <section class="loan_form-section property-details">
                        <div class="cal-head">Property Details</div>
                        <div class="loan_input-group">
                            <label for="propertyPrice">Property Valuation (SGD) <span class="required">*</span></label>
                            <input type="number" id="propertyPrice" name="propertyvaluation" value="100000" required>
                            <span class="error-message" id="propertyPrice-error">This field is required.</span>
                        </div>
                        <div class="loan_input-group">
                            <label>Property Type <span class="required">*</span></label>
                            <div class="radio-group">
                                <label>
                                    <input type="radio" name="propertyType" value="private" checked required> 
                                    Private Property
                                </label>
                                <label>
                                    <input type="radio" name="propertyType" value="hdb" required> 
                                    HDB
                                </label>
                            </div>
                        </div>
                        <div class="loan_input-group">
                            <label>Number of Borrowers <span class="required">*</span></label>
                            <div class="radio-group" id="purchaseTypeGroup">
                                <label>
                                    <input type="radio" name="purchaseType" value="single" checked onchange="toggleSpouseFields()" required> 
                                    Single
                                </label>
                                <label>
                                    <input type="radio" name="purchaseType" value="joint" onchange="toggleSpouseFields()" required> 
                                    Joint
                                </label>
                            </div>
                        </div>
                        
                    </section>

                    <!-- Borrower 1 Details Section -->
                    <section class="loan_form-section borrower-details" id="borrower1">
                        <div class="cal-head" id="borrower1Title">Income Details</div>
                        <div class="loan_input-group">
                            <label>Employment Status <span class="required">*</span></label>
                            <div class="radio-group" id="employmentTypeGroup">
                                <label>
                                    <input type="radio" name="employmentType" value="employee" checked onchange="toggleEmploymentFields(); updateIncomeLabels()" required> 
                                    Employed
                                </label>
                                <label>
                                    <input type="radio" name="employmentType" value="self-employed" onchange="toggleEmploymentFields(); updateIncomeLabels()" required> 
                                    Self-Employed
                                </label>
                            </div>
                        </div>
                        <div class="loan_input-group">
                            <label for="age">Age <span class="required">*</span></label>
                            <input type="number" id="age" name="age" placeholder="Enter your age" min="18" max="65" required>
                            <span class="error-message" id="age-error">This field is required.</span>
                        </div>
                        <div class="loan_input-group employeeField">
                            <label for="basicSalary">Basic Salary (SGD) <span class="required">*</span></label>
                            <input type="number" id="basicSalary" name="monthlyBasic" placeholder="Enter your basic salary" required>
                            <span class="error-message" id="basicSalary-error">This field is required.</span>
                        </div>
                        <div class="loan_input-group noaField">
                            <label for="noa">Annual Bonus (SGD) <span class="required">*</span></label>
                            <input type="number" id="noa" name="annualBonus" placeholder="Enter your annual bonus" required>
                            <span class="error-message" id="noa-error">This field is required.</span>
                        </div>
                        <div class="loan_input-group">
                            <label for="creditCardPayment">Monthly Financial Commitments (SGD) <span class="required">*</span></label>
                            <input type="number" id="creditCardPayment" name="creditCardPayment" placeholder="Enter Monthly Financial Commitments" required>
                            <span class="error-message" id="creditCardPayment-error">This field is required.</span>
                        </div>
                    </section>

                    <!-- Borrower 2 Details Section -->
                    <section class="loan_form-section borrower-details" id="spouseFields" style="display: none;">
                        <div class="cal-head">Borrower 2's Income Details</div>
                        <div class="loan_input-group">
                            <label>Employment Status <span class="required">*</span></label>
                            <div class="radio-group" id="spouseEmploymentTypeGroup">
                                <label>
                                    <input type="radio" name="spouseEmploymentType" value="employee" checked onchange="toggleSpouseEmploymentFields(); updateSpouseIncomeLabels()" required> 
                                    Employed
                                </label>
                                <label>
                                    <input type="radio" name="spouseEmploymentType" value="self-employed" onchange="toggleSpouseEmploymentFields(); updateSpouseIncomeLabels()" required> 
                                    Self-Employed
                                </label>
                            </div>
                        </div>
                        <div class="loan_input-group">
                            <label for="spouseAge">Age <span class="required">*</span></label>
                            <input type="number" id="spouseAge" name="spouseAge" placeholder="Enter Borrower 2's age" min="18" max="65" required>
                            <span class="error-message" id="spouseAge-error">This field is required.</span>
                        </div>
                        <div class="loan_input-group spouseEmployeeField">
                            <label for="spouseBasicSalary">Basic Salary (SGD) <span class="required">*</span></label>
                            <input type="number" id="spouseBasicSalary" name="spouseBasicSalary" placeholder="Enter Borrower 2's basic salary" required>
                            <span class="error-message" id="spouseBasicSalary-error">This field is required.</span>
                        </div>
                        <div class="loan_input-group spouseNoaField">
                            <label for="spouseNoa">Annual Income (SGD) <span class="required">*</span></label>
                            <input type="number" id="spouseNoa" name="spouseNoa" placeholder="Enter Borrower 2's annual income" required>
                            <span class="error-message" id="spouseNoa-error">This field is required.</span>
                        </div>
                        <div class="loan_input-group">
                            <label for="spouseCreditCardPayment">Monthly Financial Commitments (SGD) <span class="required">*</span></label>
                            <input type="number" id="spouseCreditCardPayment" name="spouseCreditCardPayment" placeholder="Enter Borrower 2's Monthly Financial Commitments" required>
                            <span class="error-message" id="spouseCreditCardPayment-error">This field is required.</span>
                        </div>
                    </section>
                </div>

                <div class="button-loan_container">
                    <button type="button" onclick="calculateEligibility()">Calculate Eligibility</button>
                </div>

                <div class="result-loan_container" style="display: none;">
                    <div class="result" id="result"></div>
                    <div class="button-loan_container">
                        <button type="button" class="ipa-button" onclick="openIpaForm()">Get your IPA now!</button>
                    </div>
                    <div class="disclaimer-loan_container">
                        <p>Disclaimer: The above figures are for illustrative purposes only and do not constitute a formal In-Principle-Approval (IPA) from a bank.</p>
                    </div>
                </div>

                <!-- Hidden fields for calculated results -->
                <input type="hidden" id="calculatedLoanAmount" name="calculatedLoanAmount">
                <input type="hidden" id="calculatedLoanPercentage" name="calculatedLoanPercentage">
                <input type="hidden" id="calculatedTenure" name="calculatedTenure">
                <input type="hidden" id="calculatedWeightedAge" name="calculatedWeightedAge">
            </form>
        </div>
    </div>

    <!-- IPA Form Modal -->
    <div id="ipaModal" class="modal">
        <div class="modal-content">
            <span class="close">&times;</span>
            <div class="cal-head">Get Your In-Principle-Approval</div>
            <div class="loan_para">Protect your purchase with a free and non-obligatory <br>In-Principle-Approval (IPA)!</div>
            <div class="loan_para">Let us help you take the first step - it's quick and easy</div>
            <form id="ipaForm">
                <div class="loan_input-group">
                    <label for="name">Name</label>
                    <input type="text" id="name" name="name" placeholder="Enter Your Name">
                    <span class="error-message" id="name-error">This field is required.</span>
                </div>
                <div class="loan_input-group">
                    <label for="emailAddress">Email Address</label>
                    <input type="email" id="emailAddress" name="emailAddress" placeholder="Enter Email Address">
                    <span class="error-message" id="emailAddress-error">This field is required.</span>
                </div>
                <div class="loan_input-group">
                    <label for="mobileNumber">Mobile Number</label>
                    <input type="tel" id="mobileNumber" name="mobileNumber" placeholder="Enter Mobile Number">
                    <span id="mobileNumber-error" class="error-message">Please enter a valid mobile number.</span>
                </div>
                <div class="button-loan_container">
                    <button type="submit">Submit</button>
                </div>
            </form>
        </div>
    </div>
</div>
    <?php
    return ob_get_clean();
}
add_shortcode('loan_calculator', 'lec_calculator_shortcode');