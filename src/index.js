import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  where,
  orderBy,
  serverTimestamp,
  getDoc,
  updateDoc,
} from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCyGmdSWS7KqlOAKLiK-lhlpphjm93EAUE",
  authDomain: "to-do-live-b2cbf.firebaseapp.com",
  projectId: "to-do-live-b2cbf",
  storageBucket: "to-do-live-b2cbf.appspot.com",
  messagingSenderId: "675566933502",
  appId: "1:675566933502:web:27d38531add4e33f8c1caf",
  measurementId: "G-5EC4J8YX7G",
};

initializeApp(firebaseConfig);
const db = getFirestore();
const colRef = collection(db, "todo-items");
const q = query(colRef, orderBy("createdAt", "desc"));

function getItemsOld() {
  getDocs(colRef).then((snapshot) => {
    let items = [];
    snapshot.docs.forEach((doc) => {
      items.push({
        ...doc.data(),
        id: doc.id,
      });
    });
    generateItems(items);
  });
}

onSnapshot(q, (snapshot) => {
  let items = [];
  snapshot.docs.forEach((doc) => {
    items.push({
      ...doc.data(),
      id: doc.id,
    });
  });
  console.log(items);
});

// item.status=="completed" ? "checked". If status==completed is true then turn to checked.
function generateItems(items) {
  let itemsHTML = "";
  items.forEach((item) => {
    itemsHTML += `
      <div class="todo-item">
        <div class="check">
          <div data-id="${item.id}" class="check-mark ${
      item.status == "completed" ? "checked" : ""
    }">
            <img src="/assets/check.png">
          </div> 
        </div>
        <div class="todo-text ${item.status == "completed" ? "checked" : ""}">
            ${item.text}
        </div>
      </div>
    `;
  });
  document.querySelector(".todo-items").innerHTML = itemsHTML;
  createEventListeners();
}

function createEventListeners() {
  let todoCheckMarks = document.querySelectorAll(".todo-item .check-mark");
  todoCheckMarks.forEach((checkMark) => {
    checkMark.addEventListener("click", function () {
      markCompleted(checkMark.dataset.id);
    });
  });
}

function markCompleted(id) {
  const docRef = doc(db, "todo-items", id);
  getDoc(docRef).then((doc) => {
    if (doc.exists) {
      if (doc.data().status == "active") {
        updateDoc(docRef, {
          status: "completed",
        });
      } else {
        updateDoc(docRef, {
          status: "active",
        });
      }
    }
  });
  getItems();
}

const newItemDiv = document.querySelector(".new-todo-input");
function addItem(event) {
  event.preventDefault();
  let newItemForm = document.getElementById("submitNew");
  let newItem = document.getElementById("todo-input");
  addDoc(colRef, {
    text: newItem.value,
    status: "active",
    createAt: serverTimestamp(),
  }).then(() => {
    // reset(): Use a selector that matches the form, not the wrapper. or you will have a error.
    // newItemForm.reset();
    window.location.reload();
  });
}
newItemDiv.addEventListener("submit", addItem);

getItemsOld();
