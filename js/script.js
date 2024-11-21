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
      columnElement.draggable = true;
      columnElement.ondragstart = dragColumn;
      columnElement.ondragover = allowDropColumn;
      columnElement.ondrop = dropColumn;

      const columnHeader = document.createElement("div");
      columnHeader.classList.add("column-header");

      const columnTitle = document.createElement("input");
      columnTitle.type = "text";
      columnTitle.value = column.title;
      columnTitle.onchange = function () {
        column.title = columnTitle.value;
        saveData();
      };

      const editBtn = document.createElement("button");
      editBtn.textContent = "✏️";
      editBtn.classList.add("icon-btn");
      editBtn.onclick = function () {
        columnTitle.focus();
      };

      columnHeader.appendChild(columnTitle);
      columnHeader.appendChild(editBtn);

      const addTaskBtn = document.createElement("button");
      addTaskBtn.textContent = "Add Task";
      addTaskBtn.classList.add("primary-btn");
      addTaskBtn.onclick = function () {
        currentColumnId = column.id;
        taskModal.style.display = "flex";
      };

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
        taskElement.textContent = `${task.title}: ${task.description}`;
        columnBody.appendChild(taskElement);
      });

      columnElement.appendChild(columnHeader);
      columnElement.appendChild(addTaskBtn); // Add Task button below the header
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
    const newTask = {
      id: Date.now(),
      title: title,
      description: description,
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
