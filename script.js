// Seleciona elementos do DOM
const taskForm = document.getElementById('task-form');
const taskInput = document.getElementById('task-input');
const taskList = document.getElementById('task-list');
const taskCount = document.getElementById('task-count');
const filterAll = document.getElementById('filter-all');
const filterCompleted = document.getElementById('filter-completed');
const filterPending = document.getElementById('filter-pending');
const sortTasksBtn = document.getElementById('sort-tasks');
const toggleThemeBtn = document.getElementById('toggle-theme');

let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
let darkMode = false;

// Função para renderizar tarefas
function renderTasks(filter = 'all') {
    taskList.innerHTML = '';
    let filteredTasks = tasks.filter(task =>
        filter === 'all' ? true : filter === 'completed' ? task.completed : !task.completed
    );
    filteredTasks.forEach((task, index) => {
        const taskItem = document.createElement('li');
        taskItem.classList.add('task-item');
        if (task.completed) taskItem.classList.add('completed');
        
        taskItem.innerHTML = `
            <span contenteditable="true" onblur="editTask(${index}, this)">${task.text}</span>
            <div>
                <button onclick="toggleTask(${index})">${task.completed ? 'Desfazer' : 'Concluir'}</button>
                <button onclick="deleteTask(${index})">Excluir</button>
            </div>
        `;
        taskList.appendChild(taskItem);
    });
    updateTaskCount();
}

// Adiciona nova tarefa
taskForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const taskText = taskInput.value.trim();
    if (taskText !== '') {
        tasks.push({ text: taskText, completed: false });
        taskInput.value = '';
        saveTasks();
        renderTasks();
    }
});

// Edita uma tarefa
function editTask(index, element) {
    tasks[index].text = element.innerText;
    saveTasks();
}

// Alterna estado de uma tarefa
function toggleTask(index) {
    tasks[index].completed = !tasks[index].completed;
    saveTasks();
    renderTasks();
}

// Exclui uma tarefa
function deleteTask(index) {
    tasks.splice(index, 1);
    saveTasks();
    renderTasks();
}

// Salva tarefas no localStorage
function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Atualiza contador de tarefas
function updateTaskCount() {
    const pendingTasks = tasks.filter(task => !task.completed).length;
    taskCount.textContent = `Tarefas pendentes: ${pendingTasks}`;
}

// Filtragem de tarefas
filterAll.addEventListener('click', () => renderTasks('all'));
filterCompleted.addEventListener('click', () => renderTasks('completed'));
filterPending.addEventListener('click', () => renderTasks('pending'));

// Ordenação de tarefas
sortTasksBtn.addEventListener('click', () => {
    tasks.sort((a, b) => a.text.localeCompare(b.text));
    saveTasks();
    renderTasks();
});

// Alterna tema
toggleThemeBtn.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    darkMode = !darkMode;
});

// Renderiza tarefas ao carregar a página
renderTasks();
