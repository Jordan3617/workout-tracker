// Add this to your existing script.js

//let exercises = []; // Array to store exercises
let exercises = JSON.parse(localStorage.getItem('exercises')) || []; // Load exercises from localStorage

function toggleModal(modalId) {
    const modal = document.getElementById(modalId);

    if (modalId === 'removeExerciseModal') {
        // Populate the exercise select dropdown when opening the remove modal
        populateExerciseSelect();
    }

    modal.style.display = modal.style.display === 'none' ? 'block' : 'none';
}

function addExercise() {
    const exerciseName = document.getElementById('exerciseName').value;
    const initialSets = document.getElementById('initialSets').value;
    const initialReps = document.getElementById('initialReps').value;

    if (exerciseName && initialSets && initialReps) {
        const exerciseList = document.getElementById('exerciseList');

        const exerciseTab = document.createElement('div');
        exerciseTab.className = 'exerciseTab';
        exerciseTab.innerHTML = `
            <span>${exerciseName}</span>
            <span>${initialSets} / ${initialReps}</span>
        `;
        exerciseList.appendChild(exerciseTab);

        // Store the exercise in the array
        exercises.push({
            name: exerciseName,
            sets: initialSets,
            reps: initialReps
        });

        // Clear input fields
        document.getElementById('exerciseName').value = '';
        document.getElementById('initialSets').value = '';
        document.getElementById('initialReps').value = '';

        // Enable the remove button if there is at least one exercise
        const removeBtn = document.getElementById('removeBtn');
        removeBtn.disabled = false;

        // Hide the add exercise form
        toggleModal('addExerciseModal');
    } else {
        alert('Please fill in all fields');
    }

    // Save exercises to localStorage
    localStorage.setItem('exercises', JSON.stringify(exercises));

    // Reinitialize the exercise list after adding an exercise
    initializeExerciseList();
}

// Function to populate the exercise select dropdown
function populateExerciseSelect() {
    const exerciseSelect = document.getElementById('exerciseSelect');
    exerciseSelect.innerHTML = '';

    exercises.forEach((exercise, index) => {
        const option = document.createElement('option');
        option.value = index;
        option.textContent = exercise.name;
        exerciseSelect.appendChild(option);
    });
}

function toggleModal(modalId) {
    const modal = document.getElementById(modalId);

    if (modalId === 'removeExerciseModal') {
        // Populate the exercise select dropdown when opening the remove modal
        populateExerciseSelect();
    }

    modal.style.display = modal.style.display === 'none' ? 'block' : 'none';
}

function removeExercise() {
    const exerciseSelect = document.getElementById('exerciseSelect');
    const selectedExerciseIndex = exerciseSelect.value;

    if (selectedExerciseIndex !== null && selectedExerciseIndex !== undefined) {
        // Remove the selected exercise from the array
        exercises.splice(selectedExerciseIndex, 1);

        // Remove the selected exercise from the list
        const exerciseList = document.getElementById('exerciseList');
        exerciseList.removeChild(exerciseList.children[selectedExerciseIndex]);

        // Disable the remove button if there are no exercises left
        const removeBtn = document.getElementById('removeBtn');
        removeBtn.disabled = exercises.length === 0;

	// Save exercises to localStorage
        localStorage.setItem('exercises', JSON.stringify(exercises));

	// Reinitialize the exercise list after adding an exercise
    	initializeExerciseList();

        // Close the remove modal
        toggleModal('removeExerciseModal');
    }
}

// Function to initialize the exercise list
function initializeExerciseList() {
    const exerciseList = document.getElementById('exerciseList');
    exerciseList.innerHTML = ''; // Clear existing list

    // Add existing exercises to the list
    exercises.forEach(exercise => {
        const exerciseTab = document.createElement('div');
        exerciseTab.className = 'exerciseTab';
        exerciseTab.innerHTML = `
            <span>${exercise.name}</span>
            <span><strong>Sets:</strong> ${exercise.sets} | <strong>Reps:</strong> ${exercise.reps}</span>
        `;
        exerciseList.appendChild(exerciseTab);
    });

    // Initialize the remove button state
    initializeRemoveButton();
}

// ... (rest of the existing code)

// Function to initialize the remove button state
function initializeRemoveButton() {
    const removeBtn = document.getElementById('removeBtn');
    removeBtn.disabled = exercises.length === 0;
}

// Initialize the exercise list when the page loads
initializeExerciseList();

// Initialize the remove button state when the page loads
initializeRemoveButton();