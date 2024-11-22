// Mobile Navigation Start

// Mobile Navigation End

document.addEventListener("DOMContentLoaded", function () {
  const kanbanBoard = document.getElementById("kanban-board");
  const addColumnBtn = document.getElementById("add-column-btn");
  const taskModal = document.getElementById("task-modal");
  const closeModalBtn = document.querySelector(".close-btn");
  const taskForm = document.getElementById("task-form");
  let currentColumnId = null;

  let kanbanData = JSON.parse(localStorage.getItem("kanbanData")) || [];

  function renderBoard() {
    kanbanBoard.innerHTML = "";
    kanbanData.forEach((column) => {
      const columnElement = document.createElement("div");
      columnElement.classList.add("column");
      columnElement.id = `column-${column.id}`;
      //   columnElement.draggable = true;
      //   columnElement.ondragstart = dragColumn;
      //   columnElement.ondragover = allowDropColumn;
      //   columnElement.ondrop = dropColumn;

      const columnHeader = document.createElement("div");
      columnHeader.classList.add("column-header");

      const columnTitle = document.createElement("input");
      columnTitle.type = "text";
      columnTitle.value = column.title;
      columnTitle.readOnly = true; // Make it read-only by default
      columnTitle.onchange = function () {
        column.title = columnTitle.value;
        saveData();
      };

      const editBtn = document.createElement("button");
      editBtn.textContent = "✏️";
      editBtn.classList.add("icon-btn");
      editBtn.onclick = function () {
        columnTitle.readOnly = false; // Make it editable
        columnTitle.classList.add("editable");
        columnTitle.focus();
      };

      columnTitle.onblur = function () {
        columnTitle.readOnly = true; // Make it read-only again on blur
        columnTitle.classList.remove("editable");
        column.title = columnTitle.value;
        saveData();
      };

      const addTaskBtn = document.createElement("button");
      addTaskBtn.textContent = "Add Task";
      addTaskBtn.style.width = "100%";
      addTaskBtn.classList.add("primary-btn");
      addTaskBtn.onclick = function () {
        currentColumnId = column.id;
        taskModal.style.display = "flex";
      };

      const deleteBtn = document.createElement("button");
      //   deleteBtn.textContent = "🗑️";
      deleteBtn.textContent = "X";
      deleteBtn.classList.add("icon-delete-btn");
      deleteBtn.onclick = function () {
        kanbanData = kanbanData.filter((col) => col.id !== column.id);
        saveData();
        renderBoard();
      };

      columnElement.appendChild(deleteBtn); // Add delete button at the top of the card
      columnElement.appendChild(columnHeader);
      columnHeader.appendChild(columnTitle);
      columnHeader.appendChild(editBtn);
      columnElement.appendChild(addTaskBtn); // Add Task button below the header
      const columnBody = document.createElement("div");
      columnBody.classList.add("column-body");
      columnBody.ondrop = drop;
      columnBody.ondragover = allowDrop;

      column.tasks.forEach((task) => {
        const taskElement = document.createElement("div");
        taskElement.classList.add("task");
        taskElement.id = `task-${task.id}`;
        taskElement.draggable = true;
        taskElement.ondragstart = drag;
        taskElement.innerHTML = `<div class="task-content">
      <h4 class="task-title">${task.title}</h4>
      <p class="task-description">${task.description}</p>
      <span class="task-assignee">Assigned to: <strong>${task.email}</strong></span>
    </div>`;

        columnBody.appendChild(taskElement);
      });

      columnElement.appendChild(columnBody);
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

    const description = document.getElementById("task-desc").value;
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

  function allowDropColumn(event) {
    event.preventDefault();
  }

  function dragColumn(event) {
    event.dataTransfer.setData("text", event.target.id);
  }

  function dropColumn(event) {
    event.preventDefault();
    const data = event.dataTransfer.getData("text");
    const draggedColumn = document.getElementById(data);
    const dropzone = event.target.closest(".kanban-board");

    if (dropzone && draggedColumn) {
      const draggedIndex = Array.from(dropzone.children).indexOf(draggedColumn);
      const droppedIndex = Array.from(dropzone.children).indexOf(
        event.target.closest(".column")
      );

      if (draggedIndex > -1 && droppedIndex > -1) {
        const [draggedColumnData] = kanbanData.splice(draggedIndex, 1);
        kanbanData.splice(droppedIndex, 0, draggedColumnData);
        saveData();
        renderBoard();
      }
    }
  }

  function saveData() {
    localStorage.setItem("kanbanData", JSON.stringify(kanbanData));
  }

  renderBoard();
});

// Select User
const users = JSON.parse(localStorage.getItem("users"));

// Get the <select> element
const selectElement = document.querySelector(".custom-select");

// Populate the select with options
users.forEach((user) => {
  const option = document.createElement("option");
  option.value = user.id; // Use the user ID as the value
  option.textContent = user.email; // Display the email
  selectElement.appendChild(option);
});
