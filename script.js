const addBtns = document.querySelectorAll(".add-btn:not(.solid)");
const saveItemBtns = document.querySelectorAll(".solid");
const addItemContainers = document.querySelectorAll(".add-container");
const addItems = document.querySelectorAll(".add-item");
// Item Lists
const itemLists = document.querySelectorAll(".drag-item-list");
const backlogList = document.getElementById("backlog-list");
const progressList = document.getElementById("progress-list");
const completeList = document.getElementById("complete-list");
const onHoldList = document.getElementById("on-hold-list");
const listColumns = document.querySelectorAll(".drag-item-list");
const backlogListEl = document.getElementById("backlog-list");
const progressListEl = document.getElementById("progress-list");
const completeListEl = document.getElementById("complete-list");
const onHoldListEl = document.getElementById("on-hold-list");

// Items
let updatedOnLoad = false;

// Initialize Arrays
let backlogListArray = [];
let progressListArray = [];
let completeListArray = [];
let onHoldListArray = [];
let listArrays = [];
// backlogListArray = ["Play Death Stranding Director's Cut"];
// progressListArray = ["Watch Lord of the Rings", "Listen to David Bowie"];
// completeListArray = ["Go to Muse concert", "Go to Nick Cave concert"];
// onHoldListArray = ["Make more money"];

// Drag Functionality
let draggedItem;
let currentColumn;
let dragging = false;

// Get Arrays from localStorage if available, set default values if not
function getSavedColumns() {
  //   console.log(backlogListArray);
  //   if (localStorage.getItem("backlogItems")) {
  //     backlogListArray = JSON.parse(localStorage.backlogItems);
  //     progressListArray = JSON.parse(localStorage.progressItems);
  //     completeListArray = JSON.parse(localStorage.completeItems);
  //     onHoldListArray = JSON.parse(localStorage.onHoldItems);
  //   } else {
  //   console.log(backlogListArray);
  backlogListArray.push("Play Death Stranding Director's Cut");
  progressListArray = ["Watch Lord of the Rings", "Listen to David Bowie"];
  completeListArray = ["Go to Muse concert", "Go to Nick Cave concert"];
  onHoldListArray = ["Make more money"];
  //   }
}

// Set localStorage Arrays
function updateSavedColumns() {
  listArrays = [
    backlogListArray,
    progressListArray,
    completeListArray,
    onHoldListArray,
  ];
  const arrayNames = ["backlog", "progress", "complete", "onHold"];
  listArrays.forEach((array, i) => {
    localStorage.setItem(`${arrayNames[i]}Items`, JSON.stringify(`${array}`));
  });
}

// Filter Arrays to remove empty values
// function filterArray(array) {
//   const filteredArray = array.filter(item => item !== null);
//   return filterArray;
// }

// Create DOM Elements for each list item
function createItemEl(columnEl, column, item, index) {
  //   console.log("columnEl:", columnEl);
  //   console.log("column:", column);
  //   console.log("item:", item);
  //   console.log("index:", index);
  // List Item
  const listEl = document.createElement("li");
  listEl.classList.add("drag-item");
  listEl.textContent = item;
  listEl.draggable = true;
  listEl.setAttribute("ondragstart", " drag(event)");
  listEl.contentEditable = true;
  listEl.id = index;
  listEl.setAttribute("onfocusout", `updateItem(${index},${column})`);
  //Append
  columnEl.appendChild(listEl);
}

// Update Columns in DOM - Reset HTML, Filter Array, Update localStorage
function updateDOM() {
  //   Check localStorage once
  if (!updatedOnLoad) {
    getSavedColumns();
  }
  // Backlog Column
  backlogList.textContent = "";
  backlogListArray.forEach((backlogItem, index) => {
    createItemEl(backlogListEl, 0, backlogItem, index);
  });
  // backlogListArray = filterArray(backlogListArray);
  // Progress Column
  progressList.textContent = "";
  progressListArray.forEach((progressItem, index) => {
    createItemEl(progressListEl, 1, progressItem, index);
  });
  // progressListArray = filterArray(progressListArray);
  // Complete Column
  completeList.textContent = "";
  completeListArray.forEach((completeItem, index) => {
    createItemEl(completeList, 2, completeItem, index);
  });
  // completeListArray = filterArray(completeListArray);
  // On Hold Column
  onHoldList.textContent = "";
  onHoldListArray.forEach((onHoldItem, index) => {
    createItemEl(onHoldList, 3, onHoldItem, index);
  });
  // onHoldListArray = filterArray(onHoldListArray);
  // Run getSavedColumns only once, Update Local Storage
  updatedOnLoad = true;
  updateSavedColumns();
}
// UpdateItem/Delete
function updateItem(id, column) {
  const selectedArray = listArrays[column];
  const selectedColumnEl = listColumns[column].children;
  console.log(selectedColumnEl[id].textContent);
  if (!dragging) {
    if (!selectedColumnEl[id].textContent) {
      delete selectedArray[id];
    } else selectedArray[id] = selectedColumnEl[id].textContent;
    // console.log(selectedArray);
    updateDOM();
  }
}

// Add to column list, reset textbox
function addToColumn(column) {
  const itemText = addItems[column].textContent;
  const selectedArray = listArrays[column];
  selectedArray.push(itemText);
  addItems[column].textContent = "";
  updateDOM();
}

// Show add item input box
function ShowInputBox(column) {
  addBtns[column].style.visibility = "hidden";
  saveItemBtns[column].style.display = "flex";
  addItemContainers[column].style.display = "flex";
}
// Hide add item input box
function hideInputBox(column) {
  addBtns[column].style.visibility = "visible";
  saveItemBtns[column].style.display = "none";
  addItemContainers[column].style.display = "none";
  addToColumn(column);
}
// Allow arrays to reflect drag and drop
function rebuildArrays() {
  // console.log(progressList.children);
  backlogListArray = [];
  for (let i = 0; i < backlogList.children.length; i++) {
    backlogListArray.push(backlogList.children[i].textContent);
  }
  progressListArray = [];
  for (let i = 0; i < progressList.children.length; i++) {
    progressListArray.push(progressList.children[i].textContent);
  }
  completeListArray = [];
  for (let i = 0; i < completeList.children.length; i++) {
    completeListArray.push(completeList.children[i].textContent);
  }
  onHoldListArray = [];
  for (let i = 0; i < onHoldList.children.length; i++) {
    onHoldListArray.push(onHoldList.children[i].textContent);
  }
  updateDOM();
}

// On Load
// console.log(typeof backlogListArray);

// Drag function
function drag(e) {
  draggedItem = e.target;
  dragging = true;
  // console.log(draggedItem);
}
// When Item enters column
function dragEnter(column) {
  //   console.log(listColumns[column]);
  listColumns[column].classList.add("over");
  currentColumn = column;
}
// Column Allows for Item to Drop
function allowDrop(e) {
  e.preventDefault();
}

// Drop function
function drop(e) {
  e.preventDefault();
  //   Remove background color
  listColumns.forEach(col => col.classList.remove("over"));
  //   Add item to column
  const parent = listColumns[currentColumn];
  parent.appendChild(draggedItem);
  dragging = false;
  rebuildArrays();
}

updateDOM();
