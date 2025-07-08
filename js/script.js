// Definition of subjects, their coefficients and types
const matieres = {
  anatomy: { label: "Anatomie", coeff: 2, type: "tp" },
  biophysique: { label: "Biophysique", coeff: 2, type: "tp" },
  chimie: { label: "Chimie", coeff: 2, type: "tp" },
  biochimie: { label: "Biochimie", coeff: 2, type: "emd" },
  biostatistiques: { label: "Biostatistiques", coeff: 2, type: "emd_tp2" },
  cytologie: { label: "Cytologie", coeff: 2, type: "emd_tp2" },
  histologie: { label: "Histologie", coeff: 1, type: "emd1" },
  embryologie: { label: "Embryologie", coeff: 1, type: "emd1" },
  physiologie: { label: "Physiologie", coeff: 1, type: "emd2" },
  ssh: { label: "SSH", coeff: 1, type: "ssh" },
};

/**
 * Displays a custom message instead of alert().
 * @param {string} message - The message to display.
 */
function showMessageBox(message) {
  const messageBox = document.getElementById("customMessageBox");
  const messageBoxText = document.getElementById("messageBoxText");
  messageBoxText.textContent = message;
  messageBox.style.display = "block";
}

/**
 * Hides the custom error message box.
 */
function hideMessageBox() {
  document.getElementById("customMessageBox").style.display = "none";
}

/**
 * This function is executed when the page loads to dynamically create the input fields.
 */
window.onload = () => {
  const form = document.getElementById("gpa-form");
  for (const [key, mat] of Object.entries(matieres)) {
    const div = document.createElement("div");
    div.classList.add("matiere");

    const h3 = document.createElement("h3");
    h3.textContent = mat.label;
    div.appendChild(h3);

    const inputGroup = document.createElement("div");
    inputGroup.classList.add("input-group");

    // Helper function to create an input field and attach event listeners
    const createInputField = (id, labelText) => {
      const label = document.createElement('label');
      label.textContent = labelText + ': ';
      const input = document.createElement('input');
      input.type = "number";
      input.id = id;
      input.min = "0";
      input.max = "20";
      input.step = "0.01";
      input.setAttribute('autocomplete', 'off'); // Disable autocomplete for keyboard behavior

      // Load saved value from localStorage
      const savedValue = localStorage.getItem(id);
      if (savedValue !== null) {
        input.value = savedValue;
      }

      // Save value to localStorage on input change
      input.addEventListener('input', (event) => {
        localStorage.setItem(id, event.target.value);
      });

      label.appendChild(input);
      return label;
    };

    // Construction of input fields based on subject type
    if (mat.type === "tp") {
      inputGroup.appendChild(createInputField(`${key}_emd1`, 'EMD1'));
      inputGroup.appendChild(createInputField(`${key}_tp1`, 'TP1'));
      inputGroup.appendChild(createInputField(`${key}_emd2`, 'EMD2'));
      inputGroup.appendChild(createInputField(`${key}_tp2`, 'TP2'));
    } else if (mat.type === "emd") {
      inputGroup.appendChild(createInputField(`${key}_emd1`, 'EMD1'));
      inputGroup.appendChild(createInputField(`${key}_emd2`, 'EMD2'));
    } else if (mat.type === "emd_tp2") {
      inputGroup.appendChild(createInputField(`${key}_emd1`, 'EMD1'));
      inputGroup.appendChild(createInputField(`${key}_emd2`, 'EMD2'));
      inputGroup.appendChild(createInputField(`${key}_tp2`, 'TP2'));
    } else if (mat.type === "emd1") {
      inputGroup.appendChild(createInputField(`${key}_emd1`, 'EMD1'));
    } else if (mat.type === "emd2") {
      inputGroup.appendChild(createInputField(`${key}_emd2`, 'EMD2'));
    } else if (mat.type === "ssh") {
      inputGroup.appendChild(createInputField(`${key}_emd2`, 'EMD2'));
      inputGroup.appendChild(createInputField(`${key}_td`, 'TD'));
    }

    div.appendChild(inputGroup);

    const noteDiv = document.createElement("div");
    noteDiv.id = `note_${key}`;
    noteDiv.classList.add("note");
    div.appendChild(noteDiv);

    form.appendChild(div);
  }

  // After all inputs are created, add event listener to the last one
  const inputElements = form.querySelectorAll('input[type="number"]');
  if (inputElements.length > 0) {
    const lastInput = inputElements[inputElements.length - 1];
    lastInput.addEventListener('keydown', (event) => {
      if (event.key === 'Enter') {
        event.preventDefault(); // Prevent default form submission (if any)
        calculerMoyenne();
      }
    });
  }
};

/**
 * Retrieves the value of an input field and checks its validity.
 * @param {string} id - The ID of the input field.
 * @returns {number|null} The numeric value or null if invalid.
 */
function val(id) {
  const inputElement = document.getElementById(id);
  if (!inputElement) return null; // To ensure the element exists

  const v = inputElement.value;
  const parsedValue = parseFloat(v);

  if (v === "" || isNaN(parsedValue) || parsedValue < 0 || parsedValue > 20) {
    inputElement.classList.add("invalid"); // Add class to visually indicate error
    return null;
  }
  inputElement.classList.remove("invalid"); // Remove error class if value is valid
  return parsedValue;
}

/**
 * Calculates the subject's grade based on its type and input fields.
 * @param {string} key - The key of the subject.
 * @param {object} mat - The subject object.
 * @returns {number|null} The subject's grade or null if there are missing/invalid fields.
 */
function calculateMatiereNote(key, mat) {
  let note = null;
  let champs = [];

  if (mat.type === "tp") {
    champs = [val(key + "_emd1"), val(key + "_tp1"), val(key + "_emd2"), val(key + "_tp2")];
    if (champs.includes(null)) return null;
    note = ((champs[0] * 0.8 + champs[1] * 0.2) + (champs[2] * 0.8 + champs[3] * 0.2)) / 2;
  } else if (mat.type === "emd") {
    champs = [val(key + "_emd1"), val(key + "_emd2")];
    if (champs.includes(null)) return null;
    note = (champs[0] + champs[1]) / 2;
  } else if (mat.type === "emd_tp2") {
    champs = [val(key + "_emd1"), val(key + "_emd2"), val(key + "_tp2")];
    if (champs.includes(null)) return null;
    const moyenne = (champs[0] + champs[1]) / 2;
    note = moyenne * 0.8 + champs[2] * 0.2;
  } else if (mat.type === "emd1") {
    note = val(key + "_emd1");
    if (note === null) return null;
  } else if (mat.type === "emd2") {
    note = val(key + "_emd2");
    if (note === null) return null;
  } else if (mat.type === "ssh") {
    champs = [val(key + "_emd2"), val(key + "_td")];
    if (champs.includes(null)) return null;
    note = champs[0] * 0.6 + champs[1] * 0.4;
  }
  return note;
}

/**
 * Calculates the overall average and updates the results in the interface.
 */
function calculerMoyenne() {
  let total = 0;
  let coeffTotal = 0;
  let sous10 = 0;
  let matiereSous5Count = 0; // Count of subjects with grade less than 5
  let matiereRattrapageList = []; // List of subjects requiring rattrapage

  let erreur = false;

  for (const [key, mat] of Object.entries(matieres)) {
    const note = calculateMatiereNote(key, mat);

    if (note === null) {
      erreur = true;
      // We don't break the loop here, we continue to identify all erroneous fields
    } else {
      if (note < 10) sous10++;
      if (note < 5) {
        matiereSous5Count++;
        matiereRattrapageList.push(mat.label); // Add subject to rattrapage list
      }

      total += note * mat.coeff;
      coeffTotal += mat.coeff;

      const noteDiv = document.getElementById("note_" + key);
      noteDiv.textContent = `Note: ${note.toFixed(2)}`;
      noteDiv.style.color = note < 5 ? "red" : note < 10 ? "orange" : "green";
    }
  }

  if (erreur) {
    showMessageBox("Veuillez remplir tous les champs avec des valeurs valides (entre 0 et 20) avant de calculer.");
    return;
  }

  const moyenne = total / coeffTotal;
  const points = total;
  const pointsTotalMax = 20 * coeffTotal;
  const manquePourValidation = Math.max(0, (10 * coeffTotal) - total);

  let validationMessage = '';
  if (moyenne >= 10 && matiereSous5Count === 0) {
    validationMessage = '<p style="color:green;">✅ Félicitations ! Vous avez validé cette année 🎉</p>';
  } else if (moyenne < 10) {
    validationMessage = `<p style="color:red;">⚠️ Vous n'avez pas encore validé. Il vous manque ${manquePourValidation.toFixed(2)} points supplémentaires pour valider.</p>`;
  } else if (matiereSous5Count > 0) {
    // If average is >= 10 but there are subjects under 5, it's still a validation issue
    validationMessage = `<p style="color:red;">⚠️ Vous n'avez pas validé à cause de matières avec une note inférieure à 5.</p>`;
  }


  const resultat = `
    <p>Moyenne générale: <strong>${moyenne.toFixed(2)}</strong></p>
    <p>Total des points: ${points.toFixed(2)} / ${pointsTotalMax.toFixed(2)}</p>
    ${matiereRattrapageList.length > 0 ? `<p style="color:red;">⚠️ Matière(s) en rattrapage (note < 5): ${matiereRattrapageList.join(", ")}</p>` : ''}
    ${sous10 > 0 && moyenne < 10 ? `<p>${sous10} matière(s) avec moins de 10.</p>` : ''}
    ${validationMessage}
  `;
  document.getElementById("resultat").innerHTML = resultat;

  // Smooth scroll to the result section
  document.getElementById("resultat").scrollIntoView({ behavior: 'smooth' });
}

