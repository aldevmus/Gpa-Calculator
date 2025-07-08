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

window.onload = () => {
  const form = document.getElementById("gpa-form");
  for (const [key, mat] of Object.entries(matieres)) {
    const div = document.createElement("div");
    div.innerHTML = `<h3>${mat.label}</h3>`;
    if (mat.type === "tp") {
      div.innerHTML += `
        EMD1: <input type="number" id="${key}_emd1" min="0" max="20">
        TP1: <input type="number" id="${key}_tp1" min="0" max="20"><br>
        EMD2: <input type="number" id="${key}_emd2" min="0" max="20">
        TP2: <input type="number" id="${key}_tp2" min="0" max="20">
      `;
    } else if (mat.type === "emd") {
      div.innerHTML += `
        EMD1: <input type="number" id="${key}_emd1" min="0" max="20">
        EMD2: <input type="number" id="${key}_emd2" min="0" max="20">
      `;
    } else if (mat.type === "emd_tp2") {
      div.innerHTML += `
        EMD1: <input type="number" id="${key}_emd1" min="0" max="20">
        EMD2: <input type="number" id="${key}_emd2" min="0" max="20">
        TP2: <input type="number" id="${key}_tp2" min="0" max="20">
      `;
    } else if (mat.type === "emd1") {
      div.innerHTML += `
        EMD1: <input type="number" id="${key}_emd1" min="0" max="20">
      `;
    } else if (mat.type === "emd2") {
      div.innerHTML += `
        EMD2: <input type="number" id="${key}_emd2" min="0" max="20">
      `;
    } else if (mat.type === "ssh") {
      div.innerHTML += `
        EMD2: <input type="number" id="${key}_emd2" min="0" max="20">
        TD: <input type="number" id="${key}_td" min="0" max="20">
      `;
    }
    form.appendChild(div);
  }
};

function calculerMoyenne() {
  let total = 0;
  let coeffTotal = 0;
  let credit = 0;
  let sous10 = 0;
  let sous5 = false;

  for (const [key, mat] of Object.entries(matieres)) {
    let note = 0;
    if (mat.type === "tp") {
      let emd1 = val(key + "_emd1");
      let tp1 = val(key + "_tp1");
      let emd2 = val(key + "_emd2");
      let tp2 = val(key + "_tp2");
      note = ((emd1 * 0.8 + tp1 * 0.2) + (emd2 * 0.8 + tp2 * 0.2)) / 2;
    } else if (mat.type === "emd") {
      note = (val(key + "_emd1") + val(key + "_emd2")) / 2;
    } else if (mat.type === "emd_tp2") {
      let emd = (val(key + "_emd1") + val(key + "_emd2")) / 2;
      note = emd * 0.8 + val(key + "_tp2") * 0.2;
    } else if (mat.type === "emd1") {
      note = val(key + "_emd1");
    } else if (mat.type === "emd2") {
      note = val(key + "_emd2");
    } else if (mat.type === "ssh") {
      note = val(key + "_emd2") * 0.6 + val(key + "_td") * 0.4;
    }

    if (note < 10) sous10++;
    if (note < 5) sous5 = true;
    total += note * mat.coeff;
    coeffTotal += mat.coeff;
  }

  const moyenne = total / coeffTotal;
  const points = total;
  const manquePour160 = Math.max(0, 160 - points);
  const resultat = `
    <p>Moyenne: <strong>${moyenne.toFixed(2)}</strong></p>
    <p>Crédits: ${points.toFixed(1)} / 320</p>
    <p>Manque: ${manquePour160.toFixed(1)} pts pour valider</p>
    ${sous5 ? '<p style="color:red;">⚠️ Matière < 5 : Rattrapage obligatoire</p>' : ''}
    ${sous10 ? `<p>${sous10} matière(s) sous 10</p>` : '<p>✅ Pas de rattrapage</p>'}
  `;
  document.getElementById("resultat").innerHTML = resultat;
}

function val(id) {
  return parseFloat(document.getElementById(id)?.value || 0);
}
