const logout = function () {
  localStorage.removeItem("loginCredentials");
  window.location.href = "index.html";
};

const userLoginCredentials = localStorage.getItem("loginCredentials");
if (!userLoginCredentials) {
  window.location.href = "index.html";
}

document.addEventListener("DOMContentLoaded", function () {
  const kanbanBoard = document.getElementById("kanban-board");
  const addColumnBtn = document.getElementById("add-column-btn");
  const taskModal = document.getElementById("task-modal");
  const closeModalBtn = document.querySelector(".close-btn");
  const taskForm = document.getElementById("task-form");
  let currentColumnId = null;

  let kanbanData = JSON.parse(localStorage.getItem("kanbanData")) || [];

  function renderBoard() {
    kanbanBoard.innerHTML = ""; // Clear existing board
    kanbanData.forEach((column) => {
      const columnElement = document.createElement("div");
      columnElement.setAttribute(
        "style",
        " background-color: lightblue; border: 1px solid #ccc; padding: 10px; margin: 10px; display: flex; flex-direction: column; max-height: 600px"
      );
      columnElement.innerText = "Styled Div";

      columnElement.classList.add("column");
      columnElement.id = `column-${column.id}`;

      columnElement.innerHTML = `
        <button class="icon-delete-btn">X</button>
        <div class="column-header">
          <input 
            type="text" 
            class="column-title" 
            value="${column.title}" 
            readonly
          />
          <button class="icon-btn">✏️</button>
        </div>
        <button class="primary-btn" style="width: 100%;">Add Task</button>
        <div class="column-body"></div>
      `;

      const deleteBtn = columnElement.querySelector(".icon-delete-btn");
      deleteBtn.onclick = () => {
        kanbanData = kanbanData.filter((col) => col.id !== column.id);
        saveData();
        renderBoard();
      };

      const columnTitle = columnElement.querySelector(".column-title");
      const editBtn = columnElement.querySelector(".icon-btn");
      editBtn.onclick = () => {
        columnTitle.readOnly = false;
        columnTitle.classList.add("editable");
        columnTitle.focus();
      };

      columnTitle.onchange = () => {
        column.title = columnTitle.value;
        saveData();
      };

      columnTitle.onblur = () => {
        columnTitle.readOnly = true;
        columnTitle.classList.remove("editable");
        saveData();
      };

      const addTaskBtn = columnElement.querySelector(".primary-btn");
      addTaskBtn.onclick = () => {
        currentColumnId = column.id;
        taskModal.style.display = "flex";
      };

      const columnBody = columnElement.querySelector(".column-body");
      columnBody.ondrop = drop;
      columnBody.ondragover = allowDrop;

      if (column.tasks.length === 0) {
        const noTasksMessage = document.createElement("div");
        noTasksMessage.innerHTML = `
        <div class="task-content" style="padding: 20px 0px">
            <p class="task-title">${"Drag and drop tasks here to organize or Add Task."}</p>
          </div>`;
        columnBody.appendChild(noTasksMessage);
      }

      column.tasks.forEach((task) => {
        const taskElement = document.createElement("div");
        taskElement.classList.add("task");
        taskElement.id = `task-${task.id}`;
        taskElement.draggable = true;
        taskElement.ondragstart = drag;

        // task
        taskElement.innerHTML = `
          <div class="task-content">
            <h4 class="task-title">${task.title}</h4>
            
            <div class="task-description">${task.description}</div>
            <span class="task-assignee">Assigned to: <strong>${task.email}</strong></span>
          </div>
        `;

        columnBody.appendChild(taskElement);
      });

      kanbanBoard.appendChild(columnElement);
    });
  }

  addColumnBtn.onclick = function () {
    const newColumn = {
      id: Date.now(),
      title: "New Column",
      tasks: [],
    };
    kanbanData.push(newColumn);
    saveData();
    renderBoard();
  };

  closeModalBtn.onclick = function () {
    taskModal.style.display = "none";
  };

  window.onclick = function (event) {
    if (event.target === taskModal) {
      taskModal.style.display = "none";
    }
  };

  taskForm.onsubmit = function (event) {
    event.preventDefault();
    const title = document.getElementById("task-title").value;
    // const description = document.getElementById("task-desc").value;
    const description = quill.root.innerHTML;
    const selectedEmail =
      selectElement.options[selectElement.selectedIndex]?.text;
    if (!selectedEmail || selectedEmail === "Select User:") {
      alert("Please select a user!");
      return;
    }
    const newTask = {
      id: Date.now(),
      title: title,
      description: description,
      email: selectedEmail,
    };
    kanbanData.forEach((column) => {
      if (column.id === currentColumnId) {
        column.tasks.push(newTask);
      }
    });
    saveData();
    renderBoard();
    taskModal.style.display = "none";
    taskForm.reset();
    quill.root.innerHTML = "";
  };

  function allowDrop(event) {
    event.preventDefault();
  }

  function drag(event) {
    event.dataTransfer.setData("text", event.target.id);
  }

  function drop(event) {
    event.preventDefault();
    const data = event.dataTransfer.getData("text");
    const draggableElement = document.getElementById(data);
    const dropzone = event.target.closest(".column-body");

    if (dropzone) {
      const columnId = parseInt(dropzone.parentElement.id.split("-")[1]);
      const taskId = parseInt(draggableElement.id.split("-")[1]);

      let task;
      kanbanData.forEach((column) => {
        const taskIndex = column.tasks.findIndex((t) => t.id === taskId);
        if (taskIndex > -1) {
          task = column.tasks.splice(taskIndex, 1)[0];
        }
      });

      kanbanData.forEach((column) => {
        if (column.id === columnId) {
          column.tasks.push(task);
        }
      });

      saveData();
      renderBoard();
    }
  }

  function saveData() {
    localStorage.setItem("kanbanData", JSON.stringify(kanbanData));
  }

  renderBoard();
});

const users = JSON.parse(localStorage.getItem("users"));
const selectElement = document.querySelector(".custom-select");

users.forEach((user) => {
  selectElement.innerHTML += `<option value="${user.id}">${user.email}</option>`;
});
