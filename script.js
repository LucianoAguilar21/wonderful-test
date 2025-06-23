const pedidos = [];
let variedadesTemp = [];
let muestrasTemp = [];

document.getElementById("pedido-form").addEventListener("submit", function (e) {
  e.preventDefault();

  const pedido = {
      id: Date.now(),
      cliente: document.getElementById("cliente").value,
      destino: document.getElementById("destino").value,
      exportadora: document.getElementById("exportadora").value,
      transporte: document.getElementById("transporte").value,
      fechaInicio: document.getElementById("fechaInicio").value,
      fechaCierre: document.getElementById("fechaCierre").value,
      observaciones: document.getElementById("observaciones").value,
      cantidadPallets: 0,
      estado: "abierto",
      potSize: document.getElementById("potSize").value,
      organic: document.getElementById("organic").checked,
      label: document.getElementById("label").checked,
      box: document.getElementById("box").value,
      treatment: document.getElementById("treatment").value,
      pallets: []
  };

  pedidos.push(pedido);
  mostrarPedidos();
  e.target.reset();
});

function mostrarPedidos() {
  const lista = document.getElementById("lista-pedidos");
  lista.innerHTML = "";

  pedidos.forEach(p => {
    const item = document.createElement("li");

    item.innerHTML = `
      <strong>Cliente:</strong> ${p.cliente} |
      <strong>Destino:</strong> ${p.destino} |
      <strong>Exp:</strong> ${p.exportadora} |
      <strong>Estado:</strong> ${p.estado} | 
      <p><strong>Pote:</strong> ${p.potSize} oz | 
      <strong>Orgánico:</strong> ${p.organic ? 'Sí' : 'No'} | 
      <strong>Etiqueta:</strong> ${p.label ? 'Sí' : 'No'} | 
      <strong>Caja:</strong> ${p.box} |
      <strong>Tratamiento:</strong> ${p.treatment}</p>

      <br>
      <button onclick="abrirModal(${p.id})">Agregar Pallet</button>
      <ul>
        ${p.pallets.map(pallet => {
          const totalCajas = pallet.variedades.reduce((sum, v) => sum + v.cantidadCajas, 0);
          return `
            <li>
              <!--Pallet ID: ${pallet.id} -->|
              P: ${pallet.numberPallet} |
              ${pallet.variedades.map(v => v.variedad).join(", ")} |
              Total Cajas: ${totalCajas} |
              QC: ${pallet.qc}% |
              Score: ${pallet.score}
              <button onclick="verPallet(${p.id}, ${pallet.id})">Ver detalles</button>
            </li>
          `;
        }).join("")}
      </ul>
    `;
    lista.appendChild(item);
  });
}



// Mostrar modal
function abrirModal(pedidoId) {
  document.getElementById("modal-pallet").classList.remove("hidden");
  document.getElementById("pedidoId").value = pedidoId;
  generarInputsMuestras();
}

// Cerrar modal
function cerrarModal() {
  document.getElementById("modal-pallet").classList.add("hidden");
  document.getElementById("pallet-form").reset();
}

// Generar inputs para 4 muestras
function generarInputsMuestras() {
  const contenedor = document.getElementById("muestras");
  contenedor.innerHTML = "";
  for (let i = 1; i <= 4; i++) {
    const div = document.createElement("div");
    div.innerHTML = `
      <h5>Muestra ${i}</h5>
      <label>Rojos: <input type="number" name="rojos${i}" required></label>
      <label>Deshidratadas: <input type="number" name="deshidratadas${i}" required></label>
      <label>Sensitivas: <input type="number" name="sensitivas${i}" required></label>
      <label>Blandas: <input type="number" name="blandas${i}" required></label>
      <label>Heridas Frescas: <input type="number" name="heridas${i}" required></label>
      <label>Incidencia: <input type="number" name="incidencia${i}" required></label>
      <label>Podridos: <input type="number" name="podridos${i}" required></label>
      <label>Hongos: <input type="number" name="hongos${i}" required></label>
    `;
    contenedor.appendChild(div);
  }
}

// Guardar pallet
document.getElementById("pallet-form").addEventListener("submit", function (e) {
  e.preventDefault();

  const pedidoId = Number(document.getElementById("pedidoId").value);
  const pedido = pedidos.find(p => p.id === pedidoId);

  if (variedadesTemp.length === 0) {
    alert("Debe agregar al menos una variedad.");
    return;
  }

  const pallet = {
    id: Date.now(),
    numberPallet: document.getElementById("palletNumber").value,
    variedades: [...variedadesTemp],
    muestras: [...muestrasTemp],
    qc: Number(document.getElementById("qc").value),
    score: document.getElementById("score").value,
    trazabilidad: document.getElementById("trazabilidad").value
  };

  pedido.pallets.push(pallet);
  cerrarModal();
  mostrarPedidos();
});




function agregarVariedad() {
  const contenedor = document.getElementById("lista-variedades");
  const index = contenedor.children.length;

  const div = document.createElement("div");
  div.classList.add("variedad-item");
  div.innerHTML = `
    <hr>
    <label>Variedad:
      <input type="text" name="variedad-${index}" required />
    </label>
    <label>Campo:
      <input type="text" name="campo-${index}" required />
    </label>
    <label>Lotes (coma separados):
      <input type="text" name="lotes-${index}" required />
    </label>
    <label>Cantidad de cajas:
      <input type="number" name="cajas-${index}" required />
    </label>
  `;
  contenedor.appendChild(div);
}

function agregarMuestra() {
  const contenedor = document.getElementById("lista-muestras");
  const index = contenedor.children.length;

  const div = document.createElement("div");
  div.classList.add("muestra-item");
  div.innerHTML = `
    <hr>
    <h5>Muestra ${index + 1}</h5>
    <label>Rojos: <input type="number" name="rojos-${index}" required></label>
    <label>Deshidratadas: <input type="number" name="deshidratadas-${index}" required></label>
    <label>Sensitivas: <input type="number" name="sensitivas-${index}" required></label>
    <label>Blandas: <input type="number" name="blandas-${index}" required></label>
    <label>Heridas Frescas: <input type="number" name="heridas-${index}" required></label>
    <label>Incidencia: <input type="number" name="incidencia-${index}" required></label>
    <label>Podridos: <input type="number" name="podridos-${index}" required></label>
    <label>Hongos: <input type="number" name="hongos-${index}" required></label>
  `;
  contenedor.appendChild(div);
}

function cerrarModal() {
  document.getElementById("modal-pallet").classList.add("hidden");
  document.getElementById("pallet-form").reset();

  variedadesTemp = [];
  muestrasTemp = [];

  document.getElementById("variedades-agregadas").innerHTML = "";
  document.getElementById("muestras-agregadas").innerHTML = "";
}



function guardarVariedad() {
  const nombre = document.getElementById("variedad-nombre").value;
  const campo = document.getElementById("variedad-campo").value;
  const lotes = document.getElementById("variedad-lotes").value;
  const cajas = document.getElementById("variedad-cajas").value;

  if (!nombre || !campo || !lotes || !cajas) {
    alert("Por favor completá todos los campos de variedad.");
    return;
  }

  variedadesTemp.push({
    variedad: nombre,
    nombreCampo: campo,
    lotes: lotes.split(",").map(Number),
    cantidadCajas: Number(cajas)
  });

  document.getElementById("variedad-nombre").value = "";
  document.getElementById("variedad-campo").value = "";
  document.getElementById("variedad-lotes").value = "";
  document.getElementById("variedad-cajas").value = "";

  actualizarListaVariedades();
}

function actualizarListaVariedades() {
  const ul = document.getElementById("variedades-agregadas");
  ul.innerHTML = "";
  variedadesTemp.forEach((v, i) => {
    const li = document.createElement("li");
    li.textContent = `${v.variedad} - Campo ${v.nombreCampo} - Lotes: ${v.lotes.join(", ")} - Cajas: ${v.cantidadCajas}`;
    ul.appendChild(li);
  });
}

function guardarMuestra() {
  const muestra = {
    rojos: Number(document.getElementById("muestra-rojos").value),
    deshidratadas: Number(document.getElementById("muestra-deshidratadas").value),
    sensitivas: Number(document.getElementById("muestra-sensitivas").value),
    blandas: Number(document.getElementById("muestra-blandas").value),
    heridasFrescas: Number(document.getElementById("muestra-heridas").value),
    incidencia: Number(document.getElementById("muestra-incidencia").value),
    podridos: Number(document.getElementById("muestra-podridos").value),
    hongos: Number(document.getElementById("muestra-hongos").value)
  };

  muestrasTemp.push(muestra);

  // Limpiar inputs
  [
    "muestra-rojos", "muestra-deshidratadas", "muestra-sensitivas",
    "muestra-blandas", "muestra-heridas", "muestra-incidencia",
    "muestra-podridos", "muestra-hongos"
  ].forEach(id => document.getElementById(id).value = "");

  actualizarListaMuestras();
}

function actualizarListaMuestras() {
  const ul = document.getElementById("muestras-agregadas");
  ul.innerHTML = "";
  muestrasTemp.forEach((m, i) => {
    const li = document.createElement("li");
    li.textContent = `Muestra ${i + 1} - Rojos: ${m.rojos}%, Podridos: ${m.podridos}%, Hongos: ${m.hongos}%`;
    ul.appendChild(li);
  });
}



function verPallet(pedidoId, palletId) {
  const pedido = pedidos.find(p => p.id === pedidoId);
  const pallet = pedido.pallets.find(p => p.id === palletId);

  let detalle = `📦 Pallet ID: ${pallet.id}\n`;
  detalle += `Número de Pallet: ${pallet.numberPallet}\n`;
  detalle += `📌 Variedades:\n`;
  pallet.variedades.forEach((v, i) => {
    detalle += `  ${i + 1}. ${v.variedad} - Campo ${v.nombreCampo} - Lotes: ${v.lotes.join(", ")} - Cajas: ${v.cantidadCajas}\n`;
  });

  detalle += `🧮 QC: ${pallet.qc}%\n`;
  detalle += `🅰️ Score: ${pallet.score}\n`;
  detalle += `🔖 Trazabilidad: ${pallet.trazabilidad}\n\n`;



  detalle += `\n🧪 Defectos:\n`;
  pallet.muestras.forEach((m, i) => {
    detalle += `  Muestra ${i + 1}: Rojos ${m.rojos}%, Deshidratadas ${m.deshidratadas}%, Sensitivas ${m.sensitivas}%, Blandas ${m.blandas}%, Heridas ${m.heridasFrescas}%, Incidencia ${m.incidencia}%, Podridos ${m.podridos}%, Hongos ${m.hongos}%\n`;
  });

  alert(detalle);
}
