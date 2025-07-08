
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

window.onload = () => { const form = document.getElementById("gpa-form"); for (const [key, mat] of Object.entries(matieres)) { const div = document.createElement("div"); div.innerHTML = <h3>${mat.label}</h3>; div.classList.add("matiere"); if (mat.type === "tp") { div.innerHTML += EMD1: <input type="number" id="${key}_emd1" min="0" max="20"> TP1: <input type="number" id="${key}_tp1" min="0" max="20"><br> EMD2: <input type="number" id="${key}_emd2" min="0" max="20"> TP2: <input type="number" id="${key}_tp2" min="0" max="20">; } else if (mat.type === "emd") { div.innerHTML += EMD1: <input type="number" id="${key}_emd1" min="0" max="20"> EMD2: <input type="number" id="${key}_emd2" min="0" max="20">; } else if (mat.type === "emd_tp2") { div.innerHTML += EMD1: <input type="number" id="${key}_emd1" min="0" max="20"> EMD2: <input type="number" id="${key}_emd2" min="0" max="20"> TP2: <input type="number" id="${key}_tp2" min="0" max="20">; } else if (mat.type === "emd1") { div.innerHTML += EMD1: <input type="number" id="${key}_emd1" min="0" max="20">; } else if (mat.type === "emd2") { div.innerHTML += EMD2: <input type="number" id="${key}_emd2" min="0" max="20">; } else if (mat.type === "ssh") { div.innerHTML += EMD2: <input type="number" id="${key}_emd2" min="0" max="20"> TD: <input type="number" id="${key}_td" min="0" max="20">; } div.innerHTML += <div id="note_${key}" class="note"></div>; form.appendChild(div); } };

function calculerMoyenne() { let total = 0; let coeffTotal = 0; let sous10 = 0; let sous5 = false; let erreur = false; const matieresR = [];

for (const [key, mat] of Object.entries(matieres)) { let note = 0; let champs = [];

if (mat.type === "tp") {
  champs = [val(key + "_emd1"), val(key + "_tp1"), val(key + "_emd2"), val(key + "_tp2")];
  if (champs.some(v => v === null)) erreur = true;
  note = ((champs[0] * 0.8 + champs[1] * 0.2) + (champs[2] * 0.8 + champs[3] * 0.2)) / 2;
} else if (mat.type === "emd") {
  champs = [val(key + "_emd1"), val(key + "_emd2")];
  if (champs.some(v => v === null)) erreur = true;
  note = (champs[0] + champs[1]) / 2;
} else if (mat.type === "emd_tp2") {
  champs = [val(key + "_emd1"), val(key + "_emd2"), val(key + "_tp2")];
  if (champs.some(v => v === null)) erreur = true;
  const moyenne = (champs[0] + champs[1]) / 2;
  note = moyenne * 0.8 + champs[2] * 0.2;
} else if (mat.type === "emd1") {
  note = val(key + "_emd1");
  if (note === null) erreur = true;
} else if (mat.type === "emd2") {
  note = val(key + "_emd2");
  if (note === null) erreur = true;
} else if (mat.type === "ssh") {
  champs = [val(key + "_emd2"), val(key + "_td")];
  if (champs.some(v => v === null)) erreur = true;
  note = champs[0] * 0.6 + champs[1] * 0.4;
}

if (note < 10) sous10++;
if (note < 5) {
  sous5 = true;
  matieresR.push(mat.label);
}

total += note * mat.coeff;
coeffTotal += mat.coeff;

const noteDiv = document.getElementById("note_" + key);
noteDiv.textContent = `Note: ${note.toFixed(2)}`;
noteDiv.style.color = note < 5 ? "red" : note < 10 ? "orange" : "green";

}

if (erreur) { alert("Veuillez remplir tous les champs avant de calculer."); return; }

const moyenne = total / coeffTotal; const points = total; const manquePour160 = Math.max(0, 160 - points); const resultat = <p>Moyenne: <strong>${moyenne.toFixed(2)}</strong></p> <p>Crédits: ${points.toFixed(1)} / 320</p> <p>Manque: ${manquePour160.toFixed(1)} pts pour valider</p> ${sous5 ? '<p style="color:red;">⚠️ Matières sous 5 : ' + matieresR.join(", ") + '</p>' : ''} ${sous10 ?<p>${sous10} matière(s) sous 10</p>: '<p style="color:green;">✅ Félicitations ! Vous avez validé 🎉</p>'}; document.getElementById("resultat").innerHTML = resultat; }

function val(id) { const v = document.getElementById(id)?.value; if (v === "") return null; return parseFloat(v); }

