document.addEventListener('DOMContentLoaded', () => {
    const taskForm = document.getElementById('task-form');
    const taskNameInput = document.getElementById('task-name');
    const taskDescInput = document.getElementById('task-desc');
    const taskSubjectInput = document.getElementById('task-subject');
    const taskDueDateInput = document.getElementById('task-due-date');
    const taskList = document.getElementById('task-list');
    const filterBtns = document.querySelectorAll('.filter-btn');

    // Modal elements
    const editModal = document.getElementById('edit-modal');
    const closeModalBtn = document.querySelector('.close-btn');
    const editForm = document.getElementById('edit-form');
    const editTaskId = document.getElementById('edit-task-id');
    const editTaskName = document.getElementById('edit-task-name');
    const editTaskDesc = document.getElementById('edit-task-desc');
    const editTaskSubject = document.getElementById('edit-task-subject');
    const editTaskDueDate = document.getElementById('edit-task-due-date');

    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

    taskForm.addEventListener('submit', (e) => {
        e.preventDefault();
        addTask(taskNameInput.value, taskDescInput.value, taskSubjectInput.value, taskDueDateInput.value);
        taskForm.reset();
    });

    taskList.addEventListener('click', (e) => {
        const target = e.target;
        const taskElement = target.closest('li');
        if (!taskElement) return;

        const taskId = taskElement.dataset.id;

        if (target.closest('.delete-btn')) {
            deleteTask(taskId);
        }
        if (target.closest('.edit-btn')) {
            openEditModal(taskId);
        }
        if (target.classList.contains('task-checkbox')) {
            toggleTaskComplete(taskId);
        }
    });

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            renderTasks(btn.dataset.filter);
        });
    });

    // Modal listeners
    closeModalBtn.addEventListener('click', closeEditModal);
    window.addEventListener('click', (e) => {
        if (e.target == editModal) {
            closeEditModal();
        }
    });
    editForm.addEventListener('submit', (e) => {
        e.preventDefault();
        updateTask();
    });

    function addTask(name, description, subject, dueDate) {
        if (name.trim() === '') return;

        const newTask = {
            id: Date.now().toString(),
            name: name,
            description: description,
            subject: subject,
            dueDate: dueDate,
            completed: false
        };

        tasks.push(newTask);
        saveAndRender();
    }

    function deleteTask(id) {
        tasks = tasks.filter(task => task.id !== id);
        saveAndRender();
    }

    function toggleTaskComplete(id) {
        const task = tasks.find(task => task.id === id);
        if (task) {
            task.completed = !task.completed;
        }
        saveAndRender();
    }

    function openEditModal(id) {
        const task = tasks.find(task => task.id === id);
        if (task) {
            editTaskId.value = task.id;
            editTaskName.value = task.name;
            editTaskDesc.value = task.description;
            editTaskSubject.value = task.subject;
            editTaskDueDate.value = task.dueDate;
            editModal.style.display = 'block';
        }
    }

    function closeEditModal() {
        editModal.style.display = 'none';
    }

    function updateTask() {
        const id = editTaskId.value;
        const task = tasks.find(task => task.id === id);
        if (task) {
            task.name = editTaskName.value;
            task.description = editTaskDesc.value;
            task.subject = editTaskSubject.value;
            task.dueDate = editTaskDueDate.value;
        }
        saveAndRender();
        closeEditModal();
    }

    function saveAndRender() {
        localStorage.setItem('tasks', JSON.stringify(tasks));
        const currentFilter = document.querySelector('.filter-btn.active').dataset.filter;
        renderTasks(currentFilter);
    }

    function renderTasks(filter = 'all') {
        taskList.innerHTML = '';
        const filteredTasks = tasks.filter(task => {
            if (filter === 'pending') return !task.completed;
            if (filter === 'completed') return task.completed;
            return true;
        });

        filteredTasks.forEach(task => {
            const li = document.createElement('li');
            li.dataset.id = task.id;
            if (task.completed) {
                li.classList.add('completed');
            }

            li.innerHTML = `
                <input type="checkbox" class="task-checkbox" ${task.completed ? 'checked' : ''}>
                <div class="task-details">
                    <span class="task-name">${task.name}</span>
                    <p class="task-desc">${task.description}</p>
                    <span class="task-subject">${task.subject}</span>
                    ${task.dueDate ? `<span class="task-due-date">Vence: ${task.dueDate}</span>` : ''}
                </div>
                <div class="task-actions">
                    <button class="edit-btn"><i class="fas fa-edit"></i></button>
                    <button class="delete-btn"><i class="fas fa-trash-alt"></i></button>
                </div>
            `;

            taskList.appendChild(li);
        });
    }

    renderTasks();
});
