const $ = (s, r = document) => r.querySelector(s),
  $$ = (s, r = document) => [...r.querySelectorAll(s)];
const STORAGE_KEY = "planeadorDocenteV2";
const ids = ["escuela", "cct", "zona", "sector", "docente", "ciclo", "grado", "grupo", "mes", "periodo", "nombreProyecto", "campo", "libro", "metodologia", "justificacion", "productoFinal", "pda", "ejes", "vinculacion", "logros", "dificultades", "adecuaciones", "notas"];
function addDay(data = {}) {
  const frag = $("#diaTemplate").content.cloneNode(true),
    card = $(".day-card", frag);
  $(".dia-fecha", card).value = data.fecha || "";
  $(".dia-fase", card).value = data.fase || "";
  $(".dia-inicio", card).value = data.inicio || "";
  $(".dia-desarrollo", card).value = data.desarrollo || "";
  $(".dia-cierre", card).value = data.cierre || "";
  $(".dia-materiales", card).value = data.materiales || "";
  $(".eliminar-dia", card).onclick = () => {
    card.remove();
    updateProgress();
  };
  card.addEventListener("input", updateProgress);
  $("#diasContainer").append(card);
}
function addCriterion(data = {}) {
  const frag = $("#criterioTemplate").content.cloneNode(true),
    row = $(".criterion-row", frag);
  $(".crit-nombre", row).value = data.nombre || "";
  $(".crit-esperado", row).value = data.esperado || "";
  $(".crit-desarrollo", row).value = data.desarrollo || "";
  $(".crit-apoyo", row).value = data.apoyo || "";
  $(".eliminar-criterio", row).onclick = () => row.remove();
  $("#criteriosContainer").append(row);
}
function collect() {
  const d = {};
  ids.forEach((id) => (d[id] = $("#" + id).value.trim()));
  d.dias = $$(".day-card").map((c) => ({ fecha: $(".dia-fecha", c).value, fase: $(".dia-fase", c).value.trim(), inicio: $(".dia-inicio", c).value.trim(), desarrollo: $(".dia-desarrollo", c).value.trim(), cierre: $(".dia-cierre", c).value.trim(), materiales: $(".dia-materiales", c).value.trim() }));
  d.criterios = $$(".criterion-row").map((r) => ({ nombre: $(".crit-nombre", r).value.trim(), esperado: $(".crit-esperado", r).value.trim(), desarrollo: $(".crit-desarrollo", r).value.trim(), apoyo: $(".crit-apoyo", r).value.trim() }));
  return d;
}
function apply(d) {
  ids.forEach((id) => {
    if (d[id] != null) $("#" + id).value = d[id];
  });
  $("#diasContainer").innerHTML = "";
  (d.dias || []).forEach(addDay);
  if (!(d.dias || []).length) addDay();
  $("#criteriosContainer").innerHTML = "";
  (d.criterios || []).forEach(addCriterion);
  if (!(d.criterios || []).length) defaultCriteria();
  updateProgress();
}
function save() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(collect()));
  toast("Planeación guardada.");
}
function load() {
  const r = localStorage.getItem(STORAGE_KEY);
  r ? apply(JSON.parse(r)) : toast("No hay planeación guardada.");
}
function clearAll() {
  if (!confirm("¿Borrar todos los campos?")) return;
  ids.forEach((id) => ($("#" + id).value = ""));
  $("#ciclo").value = "2026-2027";
  $("#grado").value = "1°";
  $("#mes").value = "Septiembre";
  $("#diasContainer").innerHTML = "";
  addDay();
  $("#criteriosContainer").innerHTML = "";
  defaultCriteria();
  updateProgress();
}
function defaultCriteria() {
  [
    ["Colaboración", "Participa activamente, escucha y respeta las ideas de sus compañeros.", "Participa, pero requiere apoyo para integrar las ideas de otros.", "Muestra dificultad para trabajar en equipo."],
    ["Creatividad", "Propone ideas originales y utiliza los materiales de forma innovadora.", "Sigue las instrucciones y aporta ideas sencillas.", "Realiza la actividad con ayuda directa."],
    ["Comprensión", "Explica con sus propias palabras el propósito del proyecto y lo que aprendió.", "Describe la actividad, pero le cuesta explicar lo que aprendió.", "Requiere ayuda para explicar el tema."],
    ["Presentación", "Comunica sus ideas de forma clara y organizada frente al grupo.", "Muestra nerviosismo, pero logra comunicar la idea principal.", "Se le dificulta expresarse frente al grupo."],
  ].forEach((x) => addCriterion({ nombre: x[0], esperado: x[1], desarrollo: x[2], apoyo: x[3] }));
}
function example() {
  Object.assign($("#nombreProyecto"), { value: "Nombrario del grupo" });
  $("#campo").value = "Lenguajes";
  $("#libro").value = "Proyectos de Aula, págs. 20-27";
  $("#metodologia").value = "Aprendizaje Basado en Proyectos Comunitarios";
  $("#justificacion").value =
    "El inicio de la educación primaria es un momento crucial. Este proyecto busca que las niñas y los niños se reconozcan a sí mismos y a sus pares, construyan un sentido de pertenencia al grupo y a la comunidad escolar, y se familiaricen con los espacios, personas y normas de su nueva escuela.";
  $("#productoFinal").value = 'Producto del Proyecto 1: "Nombrario del grupo". El producto final es un libro encuadernado y decorado por el grupo, integrado por los trabajos individuales de cada alumno.';
  $("#pda").value = "Escribe su nombre y el de sus compañeros, y lo compara con los nombres de otros.\nIdentifica letras que se repiten en diferentes nombres y palabras.\nUsa dibujos y otros recursos de los lenguajes artísticos para expresar el significado de su nombre.";
  $("#ejes").value = "Apropiación de las culturas a través de la lectura y la escritura.\nInclusión.\nPensamiento crítico.";
  $("#vinculacion").value = "Saberes y Pensamiento Científico: Conteo de letras, clasificación de nombres.\nÉtica, Naturaleza y Sociedades: Derecho a la identidad y a un nombre.";
  updateProgress();
  toast("Ejemplo cargado.");
}
const esc = (s = "") => s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" })[c]);
const nl = (s) => esc(s || "").replace(/\n/g, "<br>");
function head() {
  return `<div class="doc-head"><div class="doc-head-left"><img class="sep" src="logo-sep.png"></div></div>`;
}
function foot(g) {
  return `<div class="doc-footer">Planeación Didáctica: ${esc(g || "Primer grado")} Jose Valadez</div>`;
}
function fmtDate(v) {
  if (!v) return { day: "", date: "" };
  const d = new Date(v + "T12:00:00"),
    day = new Intl.DateTimeFormat("es-MX", { weekday: "long" }).format(d),
    date = new Intl.DateTimeFormat("es-MX", { day: "numeric", month: "long" }).format(d);
  return { day: day[0].toUpperCase() + day.slice(1), date };
}
function page1(d) {
  return `<section class="print-page">${head()}<div class="doc-title">Planeación Didáctica ${esc(d.grado)} Grado</div><table class="doc-table page1-meta"><tr><th class="cream">Nombre de la escuela:</th><td colspan="3">${esc(d.escuela)}</td><th class="cream">C.C.T. (Clave de centro de Trabajo):</th><td>${esc(d.cct)}</td></tr><tr><th class="cream">Zona Escolar:</th><td>${esc(d.zona)}</td><th class="cream">Sector:</th><td>${esc(d.sector)}</td><th class="cream">Ciclo Escolar:</th><td class="center">${esc(d.ciclo)}</td></tr><tr><th class="cream">Nombre del Docente:</th><td colspan="3">${esc(d.docente)}</td><th class="cream">Grado:</th><td class="center">${esc(d.grado)} &nbsp;&nbsp; <b>Grupo:</b> ${esc(d.grupo)}</td></tr><tr><th class="cream" colspan="2">Planeación Mensual:</th><td class="center">${esc(d.mes)}</td><th class="cream">Periodo de aplicación:</th><td colspan="2" class="center italic">${esc(d.periodo)}</td></tr></table><table class="doc-table page1-body"><colgroup><col style="width:49.2%"><col style="width:50.8%"></colgroup><tr><th class="section-h">Justificación</th><th class="section-h">Producto Final del Proyecto</th></tr><tr><td><div class="justify-copy">${nl(d.justificacion)}</div><div class="section-h" style="margin:8px -7px 0">Ejes Articuladores que se Favorecen:</div><div class="bullet-copy" style="padding-top:5px">${nl(d.ejes)}</div></td><td class="bullet-copy"><b>Producto del Proyecto: "${esc(d.nombreProyecto)}"</b><br>${nl(d.productoFinal)}</td></tr></table>${foot(d.grado)}</section>`;
}
function page2(d) {
  return `<section class="print-page">${head()}<div class="projects-title">Proyectos a desarrollar: ${esc((d.mes || "").toLowerCase())} ${esc((d.ciclo || "").split("-")[0] || "")} – ${esc(d.grado)} Grado</div><table class="doc-table projects-table"><colgroup><col style="width:12.5%"><col style="width:10%"><col style="width:18.5%"><col style="width:21.5%"><col style="width:13%"><col style="width:24.5%"></colgroup><thead><tr><th>Periodo</th><th>Campo formativo</th><th>Proyectos Eje y Libro (Páginas)</th><th>Proceso de Desarrollo de Aprendizaje (PDA)</th><th>Ejes Articuladores</th><th>Vinculación Sugerida</th></tr></thead><tbody><tr><td>4 semanas</td><td><b>${esc(d.campo)}</b></td><td><b><i>Proyecto:</i> ${esc(d.nombreProyecto)}</b><br><i>Libro:</i> ${esc(d.libro)}<br><br><b>Metodología:</b><br>${esc(d.metodologia)}</td><td>${nl(d.pda)}</td><td>${nl(d.ejes)}</td><td>${nl(d.vinculacion)}</td></tr></tbody></table>${foot(d.grado)}</section>`;
}
function dayPages(d) {
  return d.dias
    .filter((x) => Object.values(x).some(Boolean))
    .map((x, i) => {
      const f = fmtDate(x.fecha),
        week = Math.floor(i / 5) + 1;
      return `<section class="print-page">${head()}<table class="doc-table week-head"><tr><td style="width:14%">Semana ${week}</td><td style="width:53%">${esc(x.fase || "Fase de trabajo")}</td><td>${f.date ? esc(f.date) : "Periodo de trabajo"}</td></tr></table><table class="doc-table day-table"><tr><td class="left"><b>${esc(d.mes)} ${esc((d.ciclo || "").split("-")[0] || "")}</b></td><td class="content"><ul><li><b>Inicio de clases / jornada:</b> ${esc(f.date || "")}</li><li><b>Planeación mensual:</b> ${esc(d.mes)}</li></ul></td></tr><tr><td class="left"><b>${esc(f.day)}</b><br>${esc(f.date)}</td><td class="content"><ul><li><span class="day-section">Inicio:</span><br>${nl(x.inicio)}</li><li><span class="day-section">Desarrollo:</span><br>${nl(x.desarrollo)}</li><li><span class="day-section">Cierre:</span><br>${nl(x.cierre)}</li>${x.materiales ? `<li><b>Materiales:</b> ${nl(x.materiales)}</li>` : ""}</ul></td></tr></table>${foot(d.grado)}</section>`;
    })
    .join("");
}
function endPages(d) {
  const rows = d.criterios
    .filter((c) => Object.values(c).some(Boolean))
    .map((c) => `<tr><td><b>${esc(c.nombre)}</b></td><td>${esc(c.esperado)}</td><td>${esc(c.desarrollo)}</td><td>${esc(c.apoyo)}</td></tr>`)
    .join("");
  return `<section class="print-page">${head()}<div class="eval-title">Instrumento de Evaluación Formativa</div><h2 class="center" style="font:700 15pt Arial,sans-serif">Rúbrica para Evaluar Proyectos</h2><table class="doc-table eval-table"><tr class="cream"><th>Criterio</th><th>Nivel Esperado</th><th>En Desarrollo</th><th>Requiere Apoyo</th></tr>${rows}</table>${foot(d.grado)}</section><section class="print-page">${head()}<div class="reflect-title">Reflexión y Adecuaciones Curriculares de ${esc(d.mes)}</div><table class="doc-table reflect-box"><tr><th class="cream">Logros alcanzados con el grupo:</th></tr><tr><td>${nl(d.logros)}</td></tr><tr><th class="cream">Dificultades y retos presentados:</th></tr><tr><td>${nl(d.dificultades)}</td></tr><tr><th class="cream">Adecuaciones realizadas a la planeación:</th></tr><tr><td>${nl(d.adecuaciones)}</td></tr><tr><th class="cream">Notas y sugerencias para el siguiente mes:</th></tr><tr><td>${nl(d.notas)}</td></tr></table>${foot(d.grado)}</section>`;
}
function buildPreview() {
  const d = collect();
  $("#documento").innerHTML = page1(d) + page2(d) + dayPages(d) + endPages(d);
  $("#formView").classList.add("hidden");
  $("#previewView").classList.remove("hidden");
  scrollTo(0, 0);
}
function updateProgress() {
  const vals = ids.map((id) => $("#" + id).value.trim()),
    pct = Math.round((vals.filter(Boolean).length / vals.length) * 100);
  $("#progressText").textContent = pct + "%";
  $("#progressBar").style.width = pct + "%";
}
function toast(m) {
  const e = document.createElement("div");
  e.textContent = m;
  Object.assign(e.style, { position: "fixed", right: "18px", bottom: "18px", background: "#111827", color: "#fff", padding: "11px 15px", borderRadius: "10px", zIndex: 9999 });
  document.body.append(e);
  setTimeout(() => e.remove(), 1800);
}
$("#btnAgregarDia").onclick = () => addDay();
$("#btnAgregarCriterio").onclick = () => addCriterion();
$("#btnGuardar").onclick = save;
$("#btnCargar").onclick = load;
$("#btnImprimir").onclick = () => {
  buildPreview();
  setTimeout(() => print(), 150);
};
$("#btnImprimir2").onclick = () => print();
$("#btnVistaPrevia").onclick = buildPreview;
$("#btnVolver").onclick = () => {
  $("#previewView").classList.add("hidden");
  $("#formView").classList.remove("hidden");
};
$("#btnLimpiar").onclick = clearAll;
$("#btnPlantillaEjemplo").onclick = example;
$$(".nav-item").forEach((b) => (b.onclick = () => document.getElementById(b.dataset.target).scrollIntoView({ behavior: "smooth" })));
ids.forEach((id) => $("#" + id).addEventListener("input", updateProgress));
addDay();
defaultCriteria();
updateProgress();

/* ========= ASISTENTE IA ========= */

function openAIPanel() {
  $("#aiKeySetup").classList.add("hidden");
  $("#aiChat").classList.remove("hidden");

  $("#aiPanel").classList.add("open");
  $("#aiOverlay").classList.remove("hidden");
  $("#aiPanel").setAttribute("aria-hidden", "false");
}

function closeAIPanel() {
  $("#aiPanel").classList.remove("open");
  $("#aiOverlay").classList.add("hidden");
  $("#aiPanel").setAttribute("aria-hidden", "true");
}

$("#btnAI").onclick = openAIPanel;
$("#btnCloseAI").onclick = closeAIPanel;
$("#aiOverlay").onclick = closeAIPanel;


function addAIMessage(text, role) {
  role = role || "bot";
  var msgs = $("#aiMessages");
  var div = document.createElement("div");
  div.className = "ai-msg ai-msg--" + role;
  var span = document.createElement("span");
  span.innerHTML = text;
  div.appendChild(span);
  msgs.appendChild(div);
  msgs.scrollTop = msgs.scrollHeight;
  return div;
}

function buildSystemPrompt() {
  return (
    "Eres un asistente experto en planeacion docente para educacion primaria en Mexico bajo el Plan de Estudios 2022 (Nueva Escuela Mexicana).\n" +
    "El usuario te pedira crear o completar una planeacion mensual. Debes responder UNICAMENTE con un objeto JSON valido (sin markdown, sin texto extra, solo el JSON).\n\n" +
    "El JSON debe tener esta estructura exacta (incluye solo los campos que puedas llenar):\n" +
    "{\n" +
    '  "nombreProyecto": "string",\n' +
    '  "campo": "Lenguajes | Saberes y Pensamiento Cientifico | Etica, Naturaleza y Sociedades | De lo Humano y lo Comunitario",\n' +
    '  "libro": "string (libro y paginas)",\n' +
    '  "metodologia": "Aprendizaje Basado en Proyectos Comunitarios | Aprendizaje Basado en Proyectos | Aprendizaje Basado en Problemas | Indagacion STEAM | Aprendizaje Servicio",\n' +
    '  "justificacion": "string (3-5 oraciones)",\n' +
    '  "productoFinal": "string (descripcion del producto)",\n' +
    '  "pda": "string (Procesos de Desarrollo de Aprendizaje, uno por linea separados por newline)",\n' +
    '  "ejes": "string (ejes articuladores separados por newline)",\n' +
    '  "vinculacion": "string (vinculacion con otros campos, separada por newline)",\n' +
    '  "grado": "1 grado | 2 grado | 3 grado | 4 grado | 5 grado | 6 grado",\n' +
    '  "mes": "Enero | Febrero | Marzo | Abril | Mayo | Junio | Julio | Agosto | Septiembre | Octubre | Noviembre | Diciembre",\n' +
    '  "dias": [\n' +
    '    { "fase": "string", "inicio": "string", "desarrollo": "string", "cierre": "string", "materiales": "string" }\n' +
    "  ],\n" +
    '  "criterios": [\n' +
    '    { "nombre": "string", "esperado": "string", "desarrollo": "string", "apoyo": "string" }\n' +
    "  ]\n" +
    "}\n\n" +
    'Para el campo "grado" usa exactamente uno de estos valores: "1°", "2°", "3°", "4°", "5°", "6°".\n' +
    "Genera contenido pedagogico real, completo y apropiado para el nivel. Genera al menos 4 dias y 4 criterios de evaluacion."
  );
}

async function callGeminiAI(userMessage, fileParts) {
  var parts = [
    {
      text: buildSystemPrompt() + "\n\nSolicitud del docente: " + userMessage,
    },
  ];

  if (fileParts && fileParts.length) {
    parts = parts.concat(fileParts);
  }

  var body = {
    contents: [
      {
        role: "user",
        parts: parts,
      },
    ],
    generationConfig: {
      temperature: 0.7,
      maxOutputTokens: 8192,
    },
  };

  var res = await fetch("/api/gemini", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  var data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || "Error " + res.status);
  }

  var text = data && data.candidates && data.candidates[0] && data.candidates[0].content && data.candidates[0].content.parts && data.candidates[0].content.parts[0] && data.candidates[0].content.parts[0].text ? data.candidates[0].content.parts[0].text : "";

  return text;
}

function parseAIJson(text) {
  var clean = text
    .replace(/```json\n?/gi, "")
    .replace(/```\n?/g, "")
    .trim();
  var match = clean.match(/\{[\s\S]*\}/);
  if (!match) throw new Error("No se encontro JSON en la respuesta.");
  return JSON.parse(match[0]);
}

// ---- Manejo de archivos adjuntos ----
var pendingFileParts = [];

function readFileAsPart(file) {
  return new Promise(function (resolve, reject) {
    var reader = new FileReader();
    var isText = file.type === "text/plain" || file.name.endsWith(".txt");
    if (isText) {
      reader.onload = function (e) {
        resolve({ text: '\n\n[Contenido del archivo "' + file.name + '"]:\n' + e.target.result });
      };
      reader.onerror = reject;
      reader.readAsText(file, "utf-8");
    } else {
      // PDF, imágenes y otros: enviar como inlineData base64
      reader.onload = function (e) {
        var base64 = e.target.result.split(",")[1];
        resolve({ inlineData: { mimeType: file.type, data: base64 } });
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    }
  });
}

function showAttachmentBadge(name) {
  var badge = $("#aiAttachBadge");
  badge.textContent = "📎 " + name + "  ✕";
  badge.classList.remove("hidden");
  badge.onclick = clearAttachment;
}

function clearAttachment() {
  pendingFileParts = [];
  var badge = $("#aiAttachBadge");
  badge.classList.add("hidden");
  badge.textContent = "";
  $("#aiFileInput").value = "";
}

$("#aiAttachBtn").onclick = function () {
  $("#aiFileInput").click();
};

$("#aiFileInput").addEventListener("change", async function () {
  var file = this.files[0];
  if (!file) return;
  var allowed = ["application/pdf", "text/plain", "image/png", "image/jpeg", "image/webp", "image/gif"];
  var ext = file.name.split(".").pop().toLowerCase();
  var allowedExt = ["pdf", "txt", "png", "jpg", "jpeg", "webp", "gif"];
  if (!allowed.includes(file.type) && !allowedExt.includes(ext)) {
    toast("Solo se aceptan PDF, TXT e imágenes.");
    return;
  }
  if (file.size > 20 * 1024 * 1024) {
    toast("El archivo no debe superar 20 MB.");
    return;
  }
  try {
    var part = await readFileAsPart(file);
    pendingFileParts = [part];
    showAttachmentBadge(file.name);
  } catch (e) {
    toast("Error leyendo el archivo.");
  }
});

async function sendAIMessage() {
  var input = $("#aiPromptInput");
  var msg = input.value.trim();
  if (!msg && !pendingFileParts.length) return;
  if (!msg) msg = "Analiza el archivo adjunto y genera la planeación.";

  input.value = "";
  var userLabel = msg + (pendingFileParts.length ? " 📎" : "");
  addAIMessage(userLabel, "user");
  var thinking = addAIMessage("✨ Generando planeación, espera un momento...", "thinking");
  $("#btnSendAI").disabled = true;

  var filesToSend = pendingFileParts.slice();
  clearAttachment();

  try {
    var raw = await callGeminiAI(msg, filesToSend);
    thinking.remove();

    var aiData = parseAIJson(raw);
    apply(aiData);

    var filled = Object.keys(aiData).filter(function (k) {
      return k !== "dias" && k !== "criterios" && aiData[k];
    }).length;
    var dias = (aiData.dias || []).length;
    var crit = (aiData.criterios || []).length;
    addAIMessage("✅ ¡Listo! Llené <strong>" + filled + " campos</strong> de texto, <strong>" + dias + " días</strong> en la secuencia diaria y <strong>" + crit + " criterios</strong> de evaluación.<br><br>Revisa y ajusta los campos antes de generar la vista previa.", "bot");
    toast("Planeación generada por IA ✨");
  } catch (err) {
    thinking.remove();
    var errMsg = err.message || "Error desconocido";
    if (errMsg.indexOf("API_KEY_INVALID") !== -1 || errMsg.indexOf("API key") !== -1) {
      errMsg = "API Key inválida. Verifica tu clave de Gemini.";
      localStorage.removeItem(AI_KEY_STORAGE);
    }
    addAIMessage("❌ <strong>Error:</strong> " + errMsg, "bot");
  } finally {
    $("#btnSendAI").disabled = false;
    input.focus();
  }
}

$("#btnSendAI").onclick = sendAIMessage;
$("#aiPromptInput").addEventListener("keydown", function (e) {
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault();
    sendAIMessage();
  }
});
