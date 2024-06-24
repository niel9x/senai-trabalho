// Modals
const insertModal = document.getElementById("insertModal");
const displayModal = document.getElementById("displayModal");
const openInsertModalBtn = document.getElementById("openInsertModalBtn");
const openDisplayModalBtn = document.getElementById("openDisplayModalBtn");
const closeModalBtns = document.getElementsByClassName("close");

// Open modals
openInsertModalBtn.onclick = function() {
    insertModal.style.display = "block";
}

openDisplayModalBtn.onclick = function() {
    displayModal.style.display = "block";
    fetchGrades();
}

// Close modals
for (let btn of closeModalBtns) {
    btn.onclick = function() {
        btn.parentElement.parentElement.style.display = "none";
    }
}

window.onclick = function(event) {
    if (event.target == insertModal) {
        insertModal.style.display = "none";
    }
    if (event.target == displayModal) {
        displayModal.style.display = "none";
    }
}

// Insert grades
document.getElementById('insertGradeForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const formData = {
        name: document.getElementById('name').value,
        programming: document.getElementById('programming').value,
        networks: document.getElementById('networks').value,
        databases_grade: document.getElementById('databases_grade').value
    };

    fetch('/insertGrade', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
    })
    .then(response => response.text())
    .then(data => {
        alert(data);
        document.getElementById('insertGradeForm').reset();
        insertModal.style.display = "none";
    })
    .catch(error => {
        console.error('Erro ao inserir as notas:', error);
    });
});

// Fetch and display grades
function fetchGrades() {
    fetch('/getGrades')
    .then(response => response.json())
    .then(data => {
        const container = document.getElementById('gradesDisplay');
        container.innerHTML = ''; // Clear previous data
        data.forEach(grade => {
            const row = document.createElement('tr');
            const nameCell = document.createElement('td');
            const programmingCell = document.createElement('td');
            const networksCell = document.createElement('td');
            const databasesGradeCell = document.createElement('td');

            nameCell.textContent = grade.name;
            programmingCell.textContent = grade.programming;
            networksCell.textContent = grade.networks;
            databasesGradeCell.textContent = grade.databases_grade;

            row.appendChild(nameCell);
            row.appendChild(programmingCell);
            row.appendChild(networksCell);
            row.appendChild(databasesGradeCell);
            container.appendChild(row);
        });
    })
    .catch(error => {
        console.error('Erro ao buscar as notas:', error);
        document.getElementById('gradesDisplay').innerHTML = 'Failed to load data';
    });
}
