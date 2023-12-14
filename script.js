//let exercises = []; // Array to store exercises
let exercises = JSON.parse(localStorage.getItem('exercises')) || []; // Load exercises from localStorage

document.addEventListener('DOMContentLoaded', function () {
    // Array of possible background image URLs
    const backgroundUrls = [
    "url('https://i0.wp.com/www.strengthlog.com/wp-content/uploads/2021/02/Full-body-workout-training-program.jpg?resize=2048%2C1367&ssl=1')",
    "url('https://247wallst.com/wp-content/uploads/2018/06/crossfit.jpg')",
    "url('https://i0.wp.com/post.healthline.com/wp-content/uploads/2023/02/female-dumbbells-1296x728-header-1296x729.jpg?w=1155&h=2268')",
    "url('https://www.planetfitness.com/sites/default/files/feature-image/break-workout_602724.jpg')",
    "url('https://the-home-gym.com/wp-content/uploads/2022/05/bigstock-205660306-1024x683.jpg')",
    // Add more URLs as needed
];

    // Function to pick a random background URL
    function getRandomBackgroundUrl() {
        const randomIndex = Math.floor(Math.random() * backgroundUrls.length);
        return backgroundUrls[randomIndex];
    }

    // Set the background image
    document.body.style.backgroundImage = getRandomBackgroundUrl();
});

document.addEventListener('DOMContentLoaded', function () {
    const calendar = new FullCalendar.Calendar(document.getElementById('calendar'), {
        headerToolbar: {
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay'
        },
        events: [], // You'll populate this array with exercise events
        dateClick: function (info) {
            // Handle date click, display exercise list for the clicked day
            const clickedDate = info.dateStr;
            displayExercisesForDate(clickedDate);
        }
    });

    // Call this function to update events when exercises are added/removed
    function updateCalendarEvents() {
        const calendarEvents = exercises.map(exercise => ({
            title: exercise.name,
            start: exercise.date, // Assuming you have a date property in exercises
            color: '#4caf50' // Green color for days with exercises
        }));
        $('#calendar').fullCalendar('removeEvents');
        $('#calendar').fullCalendar('addEventSource', calendarEvents);
    }

    // Function to display exercise list for a specific date
    function displayExercisesForDate(date) {
        const exercisesForDate = exercises.filter(exercise => exercise.date === date);
        // Display exercisesForDate as needed
        console.log(`Exercises for ${date}:`, exercisesForDate);
    }

    // Initialize the calendar when the page loads
    initializeCalendar();
});

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

    // Update the calendar events
    updateCalendarEvents();
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

        // Update the calendar events
        updateCalendarEvents();

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
            <span>
                <strong>Sets:</strong> 
                <button class="roundButton decrement" onclick="updateExerciseProperty('${exercise.name}','sets','decrement')">-</button>
                ${exercise.sets}
                <button class="roundButton increment" onclick="updateExerciseProperty('${exercise.name}','sets','increment')">+</button>
                |
                <strong>Reps:</strong> 
                <button class="roundButton decrement" onclick="updateExerciseProperty('${exercise.name}','reps','decrement')">-</button>
                ${exercise.reps}
                <button class="roundButton increment" onclick="updateExerciseProperty('${exercise.name}','reps','increment')">+</button>
            </span>
        `;
        exerciseList.appendChild(exerciseTab);
    });

    // Initialize the remove button state
    initializeRemoveButton();
}

// Function to update exercise property for a specific exercise
function updateExerciseProperty(exerciseName, property, operation) {
    const exercise = findExerciseByName(exerciseName);
    if (exercise) {
        if (operation === 'increment') {
            exercise[property]++;
        } else if (operation === 'decrement' && exercise[property] > 0) {
            exercise[property]--;
        }
        updateLocalStorageAndUI();
    }
}

// Function to find an exercise by name
function findExerciseByName(exerciseName) {
    return exercises.find(exercise => exercise.name === exerciseName);
}

// Function to update local storage and reinitialize the exercise list
function updateLocalStorageAndUI() {
    localStorage.setItem('exercises', JSON.stringify(exercises));
    initializeExerciseList();
}

// Function to initialize the remove button state
function initializeRemoveButton() {
    const removeBtn = document.getElementById('removeBtn');
    removeBtn.disabled = exercises.length === 0;
}

// Initialize the exercise list when the page loads
initializeExerciseList();

// Initialize the remove button state when the page loads
initializeRemoveButton();

// Initialize the calendar when the page loads
initializeCalendar();

function initializeCalendar() {
    // Initialize FullCalendar
    $('#calendar').fullCalendar('today');
    // You can add additional initialization here if needed
}