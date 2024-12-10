// Initialize students array with localStorage or default values
let students = JSON.parse(localStorage.getItem("students")) || [
    { name: "John Doe", payments: [] },
    { name: "Jane Smith", payments: [] },
    { name: "Robert Brown", payments: [] },
];

// Save students data to localStorage
function saveStudentsToLocalStorage() {
    localStorage.setItem("students", JSON.stringify(students));
}

// Populate students in dropdown and table
function populateStudents() {
    const studentDropdown = document.getElementById("student");
    const studentsTable = document.querySelector("#students-table tbody");

    // Clear existing options and table rows
    studentDropdown.innerHTML = "";
    studentsTable.innerHTML = "";

    students.forEach((student, index) => {
        // Add student to dropdown
        const option = document.createElement("option");
        option.value = index; // Use index as value
        option.textContent = student.name; // Display student name
        studentDropdown.appendChild(option);

        // Calculate total paid amount
        const totalPaid = student.payments.reduce((sum, payment) => sum + payment.amount, 0);

        // Add student to the students table
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${student.name}</td>
            <td>${totalPaid.toFixed(2)}</td>
            <td><button onclick="deleteStudent(${index})">Delete</button></td>
        `;
        studentsTable.appendChild(row);
    });
}

// Add a new student dynamically
document.getElementById("add-student-form").addEventListener("submit", (event) => {
    event.preventDefault();

    const studentName = document.getElementById("new-student-name").value.trim();

    if (!studentName) {
        alert("Please enter a valid student name.");
        return;
    }

    // Add new student to the array
    students.push({ name: studentName, payments: [] });

    // Save updated data to localStorage
    saveStudentsToLocalStorage();

    // Update UI
    populateStudents();

    // Clear the form
    event.target.reset();
});

// Update payment history for selected student
function updatePaymentHistory() {
    const studentIndex = parseInt(document.getElementById("student").value);
    const paymentHistory = document.getElementById("payment-history");

    // Clear previous history
    paymentHistory.innerHTML = "";

    if (isNaN(studentIndex)) {
        paymentHistory.innerHTML = "<tr><td colspan='4'>No payments available.</td></tr>";
        return;
    }

    const student = students[studentIndex];

    // If the student has no payments, show a message
    if (student.payments.length === 0) {
        paymentHistory.innerHTML = "<tr><td colspan='4'>No payments found for this student.</td></tr>";
        return;
    }

    // Populate payment history for the selected student
    student.payments.forEach((payment) => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${student.name}</td>
            <td>${payment.month}</td>
            <td>${payment.date}</td>
            <td>${payment.amount.toFixed(2)}</td>
        `;
        paymentHistory.appendChild(row);
    });
}

// Add a payment for the selected student
document.getElementById("add-payment-form").addEventListener("submit", (event) => {
    event.preventDefault();

    const studentIndex = parseInt(document.getElementById("student").value);
    const paymentAmount = parseFloat(document.getElementById("payment-amount").value.trim());
    const paymentDate = document.getElementById("payment-date").value;
    const paymentMonth = document.getElementById("payment-month").value;

    if (isNaN(studentIndex) || isNaN(paymentAmount) || !paymentDate || !paymentMonth) {
        alert("Please select a valid student, enter a valid amount, pick a date, and choose a month.");
        return;
    }

    // Add payment to the selected student's payments array
    students[studentIndex].payments.push({
        amount: paymentAmount,
        date: paymentDate,
        month: paymentMonth,
    });

    // Save updated data to localStorage
    saveStudentsToLocalStorage();

    // Refresh the UI
    populateStudents();
    updatePaymentHistory();

    // Clear the form
    event.target.reset();
});

// Delete a student
function deleteStudent(index) {
    // Confirm before deletion
    if (confirm("Are you sure you want to delete this student?")) {
        // Remove the student from the array
        students.splice(index, 1);

        // Save updated data to localStorage
        saveStudentsToLocalStorage();

        // Update UI
        populateStudents();
        updatePaymentHistory();
    }
}

// Populate students on page load
document.addEventListener("DOMContentLoaded", () => {
    populateStudents();
    updatePaymentHistory();
});