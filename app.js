let edit_record_id = -1;

window.onload = function loadScreen() {
  document.getElementById("edit-heading").style.display = "none";
  document.getElementById("edit-btn").style.display = "none";
  document.getElementById("edit-cnl-btn").style.display = "none";
  loadDataFromLocalStorage();
};
// recuperer les données pour l'afficher au tableau
function loadDataFromLocalStorage() {
  const tableBody = document.getElementById("generatedTableData");
  let tableData = JSON.parse(localStorage.getItem("crudtable")) || [];
  tableBody.innerHTML = "";
  let html = ``;
  if (tableData) {
    tableData.forEach((data, idx) => {
      html += `
            <tr>
                <th scope="row">${idx + 1}</th>
                <td>${data.name}</td>
                <td>${data.age}</td>
                <td><button onclick="updateDataFromLocalStorage('${data.record_id
        }')" class="btn btn-info">Edit</button></td>
                <td><button data-toggle="modal" data-target="#deleteModalCenter" onclick="deleteDataFromLocalStorage('${data.record_id
        }')" class="btn btn-danger">Delete</button></td>
            </tr>
          `;
    });
  }
  tableBody.innerHTML = html;
}
// fonction valier si l-utilisateur met corectement les informations sinon erreur
function validate(field1, field2) {
  if (Boolean(field1) && Boolean(field2)) {
    return true;
  } else {
    return false;
  }
}

function genrateUniqueId(length) {
  var randomChars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz012345";
  var result = "";
  for (var i = 0; i < length; i++) {
    result += randomChars.charAt(
      Math.floor(Math.random() * randomChars.length)
    );
  }
  return result;
}
// la fonction creer pour ajouter des elements  dans le localstorage

function createNewRecord() {
  const currentName = document.getElementById("nameField").value;
  const currentAge = document.getElementById("ageField").value;
  if (validate(currentName, currentAge)) {
    let tableData = JSON.parse(localStorage.getItem("crudtable")) || [];
    const new_record_id = genrateUniqueId(6);
    tableData.push({
      record_id: new_record_id,
      name: currentName,
      age: Number(currentAge),
    });
    localStorage.setItem("crudtable", JSON.stringify(tableData));
    showSnakeBar("Ajout", "reussi", 1500);
    loadDataFromLocalStorage();
    emptyFieldBox();
  } else {
    showSnakeBar("erreur réessayer", "erreur", 1500);
    emptyFieldBox();
  }
}

// supprimer des données
function deleteDataFromLocalStorage(records_id) {
  $("#deleteModelBtn").on("click", function () {
    let tableData = JSON.parse(localStorage.getItem("crudtable")) || [];
    tableData = tableData.filter(({ record_id }) => record_id !== records_id);
    localStorage.setItem("crudtable", JSON.stringify(tableData));
    showSnakeBar("Supression", "reussi", 1500);
    loadDataFromLocalStorage();
  });
  $("#deleteCnlModelBtn").on("click", function () {
    showSnakeBar("Annulation", "Annuler", 1500);
    loadDataFromLocalStorage();
  });
}
//la fonction mise ajour pour recuperer des element deja inscrits dans le tableau et les modifiers
function updateDataFromLocalStorage(rcd_id) {
  displayNoneInsertMarkup();
  let tableData = JSON.parse(localStorage.getItem("crudtable")) || [];
  const filterRecord = tableData.filter(
    ({ record_id }) => record_id === rcd_id
  );
  updateFields(filterRecord[0]);
  edit_record_id = rcd_id;
}
//le button qui ecoute l'action pour mettre a jour les elements
function updateButtonPress() {
  let tableData = JSON.parse(localStorage.getItem("crudtable")) || [];
  tableData = tableData.map((data) => {
    if (data.record_id === edit_record_id) {
      const obj = {
        record_id: data.record_id,
        name: document.getElementById("nameField").value,
        age: Number(document.getElementById("ageField").value),
      };
      return obj;
    }
    return data;
  });
  localStorage.setItem("crudtable", JSON.stringify(tableData));
  loadDataFromLocalStorage();
  displayNoneEditMarkup();
  emptyFieldBox();
  showSnakeBar("Mise à jour ", "reussi", 1500);
}
// annulation de la mise a jour
function updateCancelButton() {
  displayNoneEditMarkup();
  emptyFieldBox();
  showSnakeBar("Annulation da la mise à jour", "Annuler", 1500);
}

function emptyFieldBox() {
  document.getElementById("nameField").value = "";
  document.getElementById("ageField").value = "";
}

function updateFields(record) {
  document.getElementById("nameField").value = record.name;
  document.getElementById("ageField").value = record.age;
}

function displayNoneInsertMarkup() {
  document.getElementById("insert-heading").style.display = "none";
  document.getElementById("insert-btn").style.display = "none";
  document.getElementById("edit-heading").style.display = "block";
  document.getElementById("edit-btn").style.display = "block";
  document.getElementById("edit-cnl-btn").style.display = "block";
}

function displayNoneEditMarkup() {
  document.getElementById("insert-heading").style.display = "block";
  document.getElementById("insert-btn").style.display = "block";
  document.getElementById("edit-heading").style.display = "none";
  document.getElementById("edit-btn").style.display = "none";
  document.getElementById("edit-cnl-btn").style.display = "none";
}

function showSnakeBar(msg, type, interval) {
  var snackbar = document.getElementById("snackbar");
  snackbar.innerHTML = `<span>${msg}</span> <button style="margin-left: 10px;" class="btn ${type === "success"
    ? "btn-outline-success"
    : type === "cancelled"
      ? "btn-outline-info"
      : type === "error"
        ? "btn-outline-danger"
        : "btn-outline-warning"
    }"> ${type.toUpperCase()} </button>`;
  snackbar.style.color =
    type === "success"
      ? "green"
      : type === "cancelled"
        ? "#007bff"
        : type === "error"
          ? "red"
          : "#ffc107";
  snackbar.className = "show";
  setTimeout(function () {
    snackbar.className = snackbar.className.replace("show", "");
  }, interval);
}
