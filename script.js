document.addEventListener('DOMContentLoaded', () => {
    // --- STATE ---
    // This is our application's "source of truth".
    let students = [
    ];
    let isEditing = null; // To track if we are editing an existing student

    // --- DOM ELEMENTS ---
    const form = document.getElementById('student-form');
    const nameInput = document.getElementById('name-input');
    const mobileInput = document.getElementById('mobile-input');
    const addressInput = document.getElementById('address-input');
    const studentList = document.getElementById('student-list');
    const countBadge = document.getElementById('student-count-badge');
    const submitButton = document.getElementById('submit-button');

    // --- FUNCTIONS ---

    /**
     * Renders the entire list of students to the DOM.
     */
    const renderStudents = () => {
        // Clear the current list
        studentList.innerHTML = '';

        // Update the count badge
        countBadge.textContent = `All Students: ${students.length}`;

        // If no students, show a message
        if (students.length === 0) {
            studentList.innerHTML = '<p>No students have been added yet.</p>';
            return;
        }

        // Create and append each student item
        students.forEach(student => {
            const item = document.createElement('div');
            item.className = 'student-item';
            item.innerHTML = `
                <span>${student.name}</span>
                <span>${student.mobile}</span>
                <span>${student.address}</span>
                <div class="student-actions">
                    <button class="delete-btn" data-id="${student.id}">Delete</button>
                    <button class="edit-btn" data-id="${student.id}">Edit</button>
                </div>
            `;
            studentList.appendChild(item);
        });
    };

    /**
     * Handles the form submission for both adding and updating students.
     */
    const handleFormSubmit = (event) => {
        event.preventDefault(); // Prevent page refresh

        const name = nameInput.value.trim();
        const mobile = mobileInput.value.trim();
        const address = addressInput.value.trim();

        if (isEditing !== null) {
            // --- UPDATE LOGIC ---
            students = students.map(student =>
                student.id === isEditing ? { id: isEditing, name, mobile, address } : student
            );
            isEditing = null; // Reset editing state
            submitButton.textContent = 'Add'; // Change button text back
        } else {
            // --- ADD LOGIC ---
            const newStudent = {
                id: Date.now(), // Simple unique ID
                name,
                mobile,
                address,
            };
            students.push(newStudent);
        }

        // Reset the form fields
        form.reset();
        // Re-render the list
        renderStudents();
    };

    /**
     * Handles clicks on the "Delete" and "Edit" buttons.
     */
    const handleListClick = (event) => {
        const target = event.target;
        const id = parseInt(target.dataset.id);

        // --- DELETE ACTION ---
        if (target.classList.contains('delete-btn')) {
            students = students.filter(student => student.id !== id);
            renderStudents();
        }

        // --- EDIT ACTION ---
        if (target.classList.contains('edit-btn')) {
            const studentToEdit = students.find(student => student.id === id);
            if (studentToEdit) {
                nameInput.value = studentToEdit.name;
                mobileInput.value = studentToEdit.mobile;
                addressInput.value = studentToEdit.address;
                isEditing = studentToEdit.id; // Set editing state
                submitButton.textContent = 'Update'; // Change button text
                nameInput.focus(); // Focus on the first input
            }
        }
    };

    // --- EVENT LISTENERS ---
    form.addEventListener('submit', handleFormSubmit);
    studentList.addEventListener('click', handleListClick);

    // --- INITIAL RENDER ---
    // Render the initial list when the page loads.
    renderStudents();
});