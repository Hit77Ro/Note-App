const container = document.querySelector(".container");
let popup = document.querySelector(".popup");
let popupInputs = popup.querySelectorAll("input ,textarea");
let addBox = document.querySelector(".add-note");
let addNoteBtn = document.querySelector(".popup .add-note");
let saveBtn = document.querySelector(".popup .save");
let closePopup = popup.querySelector(".close-popup");
let overlay = document.querySelector(".overlay");
let menu = document.querySelector(".note-menu");
let menuToggler = document.querySelector(".menu-toggler");
//
let inputTitle = popup.querySelector("input");
let inputDescription = popup.querySelector(".description");

class Note {
  date = new Date().toDateString();
  id = (new Date().getTime() + "").slice(-10);
  constructor(title, description) {
    this.title = title;
    this.description = description;
  }
}
class App {
  notes = [];
  add = true;
  constructor() {
    this._showPopup.bind(this);
    addBox.addEventListener("click", this._showPopup.bind(this));
    closePopup.addEventListener("click", () => this._togglerPopup(false));
    addNoteBtn.addEventListener("click", this._addNote.bind(this));
    overlay.addEventListener("click", this._hide);
    this._getData();
  }

  _showPopup() {
    inputTitle.focus();
    saveBtn.classList.add("hidden");
    addNoteBtn.classList.remove("hidden");
    this._togglerPopup(true);
  }

  _togglerPopup(show) {
    if (show) {
      this._show();
      this._blur();
      return;
    }
    this._hide();
    this._clearField();
  }

  _blur() {
    inputTitle.addEventListener("keypress", (e) =>
      e.key == "Enter" ? inputDescription.focus() : ""
    );
  }
  _hide() {
    popup.classList.remove("show");
    overlay.classList.remove("show");
  }
  _show() {
    popup.classList.add("show");
    overlay.classList.add("show");
  }
  _showMenu(menu) {
    menu.classList.add("show");
    document.addEventListener("click", (e) => {
      const target = e.target;
      if (
        !menu.parentElement.contains(target) &&
        menu.classList.contains("show")
      ) {
        menu.classList.remove("show");
      }
    });
  }
  _deleteNote(button) {
    const note = button.closest(".note");
    note.remove();
    const obj = this.notes.findIndex((el) => el.id == note.id);
    this.notes.splice(obj, 1);
    this._saveData();
  }
  _clearField() {
    popupInputs.forEach((input) => (input.value = ""));
  }
  /*
  closures issue 
  keep updating the same element  

  why ? we have one saveBtn  , and when clicking on any editBtn it attaches  a new eventlistener on saveBtn
*/

  // _editNote(button) {
  //   const note = button.closest("li.note");
  //   if (!note) return;
  //   const obj = this.notes.find((el) => el.id == note.id);
  //   const objIndex = this.notes.findIndex((el) => el.id == note.id);
  //   const CurrentTitle = note.querySelector(".note-title");
  //   const CurrentDescription = note.querySelector(".note-description");

  //   this._showPopup(true);
  //   saveBtn.classList.remove("hidden");
  //   addNoteBtn.classList.add("hidden");
  //   inputTitle.value = CurrentTitle.textContent;
  //   inputDescription.value = CurrentDescription.textContent;

  //   // using arrow function to keep this keyword
  //   saveBtn.addEventListener("click", () => {
  //     if (!this._validInputs()) return;
  //     // this.notes[objIndex].title = inputTitle.value;
  //     // this.notes[objIndex].description = inputDescription.value;
  //     this.notes[objIndex] = new Note(inputTitle.value, inputDescription.value);
  //     console.log(this.notes);
  //     // updating the note
  //     CurrentDescription.textContent = popup.querySelector("textarea").value;
  //     CurrentTitle.textContent = popup.querySelector("input").value;
  //     // updating localstorage
  //     this._saveData();

  //     //inputDescription.value
  //     console.log(CurrentDescription);
  //     // closing popup
  //     this._hide();

  //     // >
  //     this._clearField();
  //   });
  // }

  _editNote(button) {
    const note = button.closest(".note");
    if (!note) return;
    const objIndex = this.notes.findIndex((el) => el.id == note.id);
    const CurrentTitle = note.querySelector(".note-title");
    const CurrentDescription = note.querySelector(".note-description");

    this._showPopup(true);
    saveBtn.classList.remove("hidden");
    addNoteBtn.classList.add("hidden");
    inputTitle.value = CurrentTitle.textContent;
    inputDescription.value = CurrentDescription.textContent;

    // Use a separate function to handle the save button click
    const handleSaveClick = () => {
      if (!this._validInputs()) return;

      // Update the note object in this.notes array
      this.notes[objIndex].title = inputTitle.value;
      this.notes[objIndex].description = inputDescription.value;

      // Update the note title and description in the DOM
      CurrentTitle.textContent = inputTitle.value;
      CurrentDescription.textContent = inputDescription.value;

      // Save the updated data to local storage
      this._saveData();

      // Close the popup
      this._togglerPopup(false);

      // Remove the event listener after use to avoid multiple closures
      saveBtn.removeEventListener("click", handleSaveClick);
    };

    // Add the event listener to the save button
    saveBtn.addEventListener("click", handleSaveClick);
  }

  _validInputs() {
    return [...popup.querySelectorAll("input ,textarea")].every(
      (input) => input.value.trim() !== ""
    );
  }
  _addNote() {
    // helper
    const title = inputTitle.value.trim();
    const description = inputDescription.value.trim();
    let note;

    // validating form
    if (!this._validInputs()) return;
    note = new Note(title, description);

    // add note to array of notes

    this.notes.unshift(note);

    //  renderNote  to page
    this._renderNote(note);
    // save to localstorage
    this._saveData();

    // hide form
    this._togglerPopup(false);

    // resetting
  }
  _saveData() {
    localStorage.setItem("notes", JSON.stringify(this.notes));
  }
  _getData() {
    console.log("localstorage");
    let data = JSON.parse(localStorage.getItem("notes"));
    if (!data) return;
    this.notes = data;

    this.notes.forEach((el) => this._renderNote(el));
  }

  _renderNote(note) {
    const html = `<li class="note card" id=${note.id}>
    <h1 class="note-title">${note.title}</h1>
    <p class="note-description">${note.description}</p>
    <div class="note-footer">
      <span class="note-date">${note.date}</span>

      <div class="note-settings">
        <button class="menu-toggler" onclick="app._showMenu(this.nextElementSibling)">
          <i class="fas fa-ellipsis-h"></i>
        </button>
        <div class="note-menu">
          <button class="note-edit btn" onclick="app._editNote(this)">
            <i class="fas fa-edit"></i> <span class="text">edit</span>
          </button>
          <button class="note-delete btn" onclick="app._deleteNote(this)">
            <i class="fas fa-trash"></i> <span class="text">delete</span>
          </button>
        </div>
        </div>
        </div>
      </li>`;
    addBox.insertAdjacentHTML("afterend", html);
  }
}
const app = new App();
