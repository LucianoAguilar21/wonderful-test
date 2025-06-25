const pedidos = [];
let variedadesTemp = [];


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
  cerrarModal();
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
      <strong>Tratamiento:</strong> ${p.treatment} <br>

     <strong>${p.pallets.length}P |
      ${p.potSize} oz | 
      ${p.organic ? 'Sí' : 'No'} | 
      ${p.label ? 'Sí' : 'No'} | 
      ${p.box} |
      ${p.treatment} |
      ${p.exportadora} |
      ${p.destino} |
      ${p.transporte}</strong> <br>

      
      <button class="btn btn-secondary" data-bs-toggle="modal" data-bs-target="#modal-pallet"  onclick="abrirModal(${p.id})">Agregar Pallet</button>  
      <br>
      <ul>
        ${p.pallets.map(pallet => {
          const totalCajas = pallet.variedades.reduce((sum, v) => sum + v.cantidadCajas, 0);
          return `
            <li>
              <!--Pallet ID: ${pallet.id} -->
              P:${pallet.numberPallet} |
              ${pallet.variedades.map(v => v.variedad).join(", ")} |
              Total Cajas: ${totalCajas} |
              QC: ${pallet.qc}% |
              Score: ${pallet.score}
              <button class="btn btn-outline-info" onclick="verPallet(${p.id}, ${pallet.id})">Ver detalles</button>
            </li>
          `;
        }).join("")}
      </ul> <br><hr>
    `;
    lista.appendChild(item);
  });
}



// Mostrar modal
 function abrirModal(pedidoId) {
//   document.getElementById("modal-pallet").classList.remove("hiddenM");
   document.getElementById("pedidoId").value = pedidoId;
  
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

    const detallesAnalisis = {
    rojos: Number(document.getElementById("analisis-rojos").value),
    deshidratadas: Number(document.getElementById("analisis-deshidratadas").value),
    sensitivas: Number(document.getElementById("analisis-sensitivas").value),
    blandas: Number(document.getElementById("analisis-blandas").value),
    heridasFrescas: Number(document.getElementById("analisis-heridas").value),
    cicatrices: Number(document.getElementById("analisis-cicatrices").value),
    podridos: Number(document.getElementById("analisis-podridos").value),
    hongos: Number(document.getElementById("analisis-hongos").value)
  };

  const pallet = {
    id: Date.now(),
    numberPallet: document.getElementById("palletNumber").value,
    variedades: [...variedadesTemp],
    detallesAnalisis: detallesAnalisis,
    qc: Number(document.getElementById("qc").value),
    score: document.getElementById("score").value,
    trazabilidad: document.getElementById("trazabilidad").value,
    observaciones: document.getElementById("pallet-observaciones").value
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



 function cerrarModal() {
   //document.getElementById("modal-pallet").classList.add("hiddenM");
    document.getElementById("pallet-form").reset();

    variedadesTemp = [];

    document.getElementById("variedades-agregadas").innerHTML = "";
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
  const detallesAnalisis = {
    rojos: Number(document.getElementById("analisis-rojos").value),
    deshidratadas: Number(document.getElementById("analisis-deshidratadas").value),
    sensitivas: Number(document.getElementById("analisis-sensitivas").value),
    blandas: Number(document.getElementById("analisis-blandas").value),
    heridasFrescas: Number(document.getElementById("analisis-heridas").value),
    cicatrices: Number(document.getElementById("analisis-cicatrices").value),
    podridos: Number(document.getElementById("analisis-podridos").value),
    hongos: Number(document.getElementById("analisis-hongos").value)
  };

  muestrasTemp.push(detallesAnalisis);

  // Limpiar inputs
  [
    "analisis-rojos", "analisis-deshidratadas", "analisis-sensitivas",
    "analisis-blandas", "analisis-heridas", "analisis-cicatrices",
    "analisis-podridos", "analisis-hongos"
  ].forEach(id => document.getElementById(id).value = "");

  actualizarListaMuestras();
}


function verPallet(pedidoId, palletId) {
  const pedido = pedidos.find(p => p.id === pedidoId);
  const pallet = pedido.pallets.find(p => p.id === palletId);

  // let detalle = `📦 Pallet ID: ${pallet.id}\n`;
  let detalle = `Cliente: ${pedido.cliente}\n`;
  detalle += `Número de Pallet: ${pallet.numberPallet}\n`;
  pallet.variedades.forEach((v, i) => {
    detalle += `  ${i + 1}. Campo ${v.nombreCampo} - Lotes: ${v.lotes.join(", ")} - ${v.variedad} - Cajas: ${v.cantidadCajas}\n`;
  });

  detalle += `QC: ${pallet.qc}%\n`;
  detalle += `Score: ${pallet.score}\n`;
  detalle += `Trazabilidad: ${pallet.trazabilidad}\n\n`;



  detalle += `\nDetalles de análisis:\n`;
  const a = pallet.detallesAnalisis;
  detalle += `  Rojos: ${a.rojos}% | Deshidratadas: ${a.deshidratadas}% | Sensitivas: ${a.sensitivas}%\n`;
  detalle += `  Blandas: ${a.blandas}% | Heridas: ${a.heridasFrescas}% | Cicatrices: ${a.cicatrices}%\n`;
  detalle += `  Podridos: ${a.podridos}% | Hongos: ${a.hongos}%\n`;

  detalle += `\n Observaciones: ${pallet.observaciones || 'Sin observaciones'}\n`;

  alert(detalle);
}

