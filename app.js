const $ = (s, r = document) => r.querySelector(s),
  $$ = (s, r = document) => [...r.querySelectorAll(s)];
const STORAGE_KEY = "planeadorDocenteV2";
const ids = ["escuela", "cct", "zona", "sector", "docente", "ciclo", "grado", "grupo", "mes", "periodoInicio", "periodoFin", "periodo", "nombreProyecto", "campo", "libro", "metodologia", "justificacion", "productoFinal", "pda", "ejes", "vinculacion", "logros", "dificultades", "adecuaciones", "notas"];
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
const DEFAULT_SCHOOL_DATA = {
  escuela: "Profr. Claudio Cortes Castro",
  cct: "09DPR1000V",
  zona: "Urbano",
  sector: "Matutino",
  docente: "Wendy Jocelyn Flores Rodríguez",
  ciclo: "2026-2027",
  grado: "1°",
  mes: "Septiembre"
};

function apply(d) {
  ids.forEach((id) => {
    if (d[id] != null && String(d[id]).trim() !== "") {
      $("#" + id).value = d[id];
    } else if (DEFAULT_SCHOOL_DATA[id]) {
      $("#" + id).value = DEFAULT_SCHOOL_DATA[id];
    }
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
  $("#escuela").value = "Profr. Claudio Cortes Castro";
  $("#cct").value = "09DPR1000V";
  $("#zona").value = "Urbano";
  $("#sector").value = "Matutino";
  $("#docente").value = "Wendy Jocelyn Flores Rodríguez";
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
  const teacherName = $("#docente") && $("#docente").value.trim() ? $("#docente").value.trim() : "Wendy Jocelyn Flores Rodríguez";
  return `<div class="doc-footer">Planeación Didáctica: ${esc(g || "Primer grado")} | Docente: ${esc(teacherName)}</div>`;
}
function fmtDate(v) {
  if (!v) return { day: "", date: "" };
  const d = new Date(v + "T12:00:00"),
    day = new Intl.DateTimeFormat("es-MX", { weekday: "long" }).format(d),
    date = new Intl.DateTimeFormat("es-MX", { day: "numeric", month: "long" }).format(d);
  return { day: day[0].toUpperCase() + day.slice(1), date };
}
function page1(d) {
  return `<section class="print-page">${head()}<div class="doc-title">Planeación Didáctica ${esc(d.grado)} Grado</div><table class="doc-table page1-meta"><tr><th class="cream">Nombre de la escuela:</th><td colspan="3">${esc(d.escuela)}</td><th class="cream">C.C.T. (Clave de centro de Trabajo):</th><td>${esc(d.cct)}</td></tr><tr><th class="cream">Zona Escolar:</th><td>${esc(d.zona)}</td><th class="cream">Sector:</th><td>${esc(d.sector)}</td><th class="cream">Ciclo Escolar:</th><td class="center">${esc(d.ciclo)}</td></tr><tr><th class="cream">Nombre del Docente:</th><td colspan="3">${esc(d.docente)}</td><th class="cream">Grado:</th><td class="center">${esc(d.grado)} &nbsp;&nbsp; <b>Grupo:</b> ${esc(d.grupo)}</td></tr><tr><th class="cream" colspan="2">Planeación Mensual:</th><td class="center">${esc(d.mes)}</td><th class="cream">Periodo de aplicación:</th><td colspan="2" class="center italic">${esc(d.periodo)}</td></tr></table><table class="doc-table page1-body"><colgroup><col style="width:49.2%"><col style="width:50.8%"></colgroup><tr><th class="section-h">Justificación</th><th class="section-h">Producto Final / Evidencia</th></tr><tr><td><div class="justify-copy">${nl(d.justificacion)}</div><div class="section-h" style="margin:8px -7px 0">Ejes Articuladores que se Favorecen:</div><div class="bullet-copy" style="padding-top:5px">${nl(d.ejes)}</div></td><td class="bullet-copy"><b>Proyecto / Secuencia: "${esc(d.nombreProyecto)}"</b><br>${nl(d.productoFinal)}</td></tr></table>${foot(d.grado)}</section>`;
}
function page2(d) {
  return `<section class="print-page">${head()}<div class="projects-title">Proyectos / Secuencias a desarrollar: ${esc((d.mes || "").toLowerCase())} ${esc((d.ciclo || "").split("-")[0] || "")} – ${esc(d.grado)} Grado</div><table class="doc-table projects-table"><colgroup><col style="width:12.5%"><col style="width:10%"><col style="width:18.5%"><col style="width:21.5%"><col style="width:13%"><col style="width:24.5%"></colgroup><thead><tr><th>Periodo</th><th>Campo formativo</th><th>Proyecto / Secuencia y Libro</th><th>Proceso de Desarrollo de Aprendizaje (PDA)</th><th>Ejes Articuladores</th><th>Vinculación Sugerida</th></tr></thead><tbody><tr><td>4 semanas</td><td><b>${esc(d.campo)}</b></td><td><b><i>Proyecto / Secuencia:</i> ${esc(d.nombreProyecto)}</b><br><i>Libro:</i> ${esc(d.libro)}<br><br><b>Metodología / Modalidad:</b><br>${esc(d.metodologia)}</td><td>${nl(d.pda)}</td><td>${nl(d.ejes)}</td><td>${nl(d.vinculacion)}</td></tr></tbody></table>${foot(d.grado)}</section>`;
}
function dayPages(d) {
  const activeDays = (d.dias || []).filter((x) => Object.values(x).some(Boolean));
  if (!activeDays.length) return "";

  // Agrupar los días de 2 en 2 por hoja para llenar el espacio sin dejar huecos vacíos y garantizar el encabezado con logo en cada página
  const DAYS_PER_PAGE = 3;
  const pagesHtml = [];

  for (let i = 0; i < activeDays.length; i += DAYS_PER_PAGE) {
    const dayChunk = activeDays.slice(i, i + DAYS_PER_PAGE);
    const weekNum = Math.floor(i / 5) + 1;
    const firstDayFase = dayChunk[0].fase || "Fase / Momento de trabajo";

    const daysHtml = dayChunk
      .map((x, chunkIdx) => {
        const dayGlobalIdx = i + chunkIdx;
        const f = fmtDate(x.fecha);
        return `<table class="doc-table day-table" style="margin-top:6px;">
          <tr>
            <td class="left">
              <b>${esc(d.mes)} ${esc((d.ciclo || "").split("-")[0] || "")}</b><br>
              <b>${esc(f.day || ("Día " + (dayGlobalIdx + 1)))}</b><br>${esc(f.date)}
            </td>
            <td class="content">
              <ul>
                ${x.fase ? `<li><b>Fase / Momento:</b> ${esc(x.fase)}</li>` : ""}
                <li><span class="day-section">Inicio:</span> ${nl(x.inicio)}</li>
                <li><span class="day-section">Desarrollo:</span> ${nl(x.desarrollo)}</li>
                <li><span class="day-section">Cierre:</span> ${nl(x.cierre)}</li>
                ${x.materiales ? `<li><b>Materiales / Tarea:</b> ${nl(x.materiales)}</li>` : ""}
              </ul>
            </td>
          </tr>
        </table>`;
      })
      .join("");

    pagesHtml.push(`<section class="print-page">
      ${head()}
      <table class="doc-table week-head">
        <tr>
          <td style="width:14%">Semana ${weekNum}</td>
          <td style="width:53%">${esc(firstDayFase)}</td>
          <td>Secuencia Diaria</td>
        </tr>
      </table>
      ${daysHtml}
      ${foot(d.grado)}
    </section>`);
  }

  return pagesHtml.join("");
}
function endPages(d) {
  let pagesHtml = "";

  const hasCrit = d.criterios && d.criterios.some((c) => Object.values(c).some(Boolean));
  if (hasCrit) {
    const rows = (d.criterios || [])
      .filter((c) => Object.values(c).some(Boolean))
      .map((c) => `<tr><td><b>${esc(c.nombre)}</b></td><td>${esc(c.esperado)}</td><td>${esc(c.desarrollo)}</td><td>${esc(c.apoyo)}</td></tr>`)
      .join("");

    pagesHtml += `<section class="print-page">
      ${head()}
      <div class="eval-title">Instrumento de Evaluación Formativa</div>
      <h2 class="center" style="font:700 14pt Arial,sans-serif; margin: 8px 0 12px;">Rúbrica para Evaluar Proyectos y Secuencias de Aprendizaje</h2>
      <table class="doc-table eval-table">
        <tr class="cream"><th>Criterio</th><th>Nivel Esperado</th><th>En Desarrollo</th><th>Requiere Apoyo</th></tr>
        ${rows}
      </table>
      ${foot(d.grado)}
    </section>`;
  }

  const hasReflect = d.logros || d.dificultades || d.adecuaciones || d.notas;
  if (hasReflect) {
    pagesHtml += `<section class="print-page">
      ${head()}
      <div class="reflect-title">Reflexión y Adecuaciones Curriculares de ${esc(d.mes)}</div>
      <table class="doc-table reflect-box" style="margin-top:10px;">
        <tr><th class="cream">Logros alcanzados con el grupo:</th></tr>
        <tr><td>${nl(d.logros)}</td></tr>
        <tr><th class="cream">Dificultades y retos presentados:</th></tr>
        <tr><td>${nl(d.dificultades)}</td></tr>
        <tr><th class="cream">Adecuaciones realizadas a la planeación:</th></tr>
        <tr><td>${nl(d.adecuaciones)}</td></tr>
        <tr><th class="cream">Notas y sugerencias para el siguiente mes:</th></tr>
        <tr><td>${nl(d.notas)}</td></tr>
      </table>
      ${foot(d.grado)}
    </section>`;
  }

  return pagesHtml;
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
  setTimeout(() => print(), 300);
};
$("#btnImprimir2").onclick = () => print();
$("#btnVistaPrevia").onclick = buildPreview;
$("#btnVolver").onclick = () => {
  $("#previewView").classList.add("hidden");
  $("#formView").classList.remove("hidden");
};
$("#btnLimpiar").onclick = clearAll;
$("#btnPlantillaEjemplo").onclick = example;
function updatePeriodText() {
  const startVal = $("#periodoInicio") ? $("#periodoInicio").value : "";
  const endVal = $("#periodoFin") ? $("#periodoFin").value : "";

  if (!startVal && !endVal) return;

  const MONTHS = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"];

  if (startVal && endVal) {
    const d1 = new Date(startVal + "T12:00:00");
    const d2 = new Date(endVal + "T12:00:00");

    const day1 = d1.getDate();
    const month1 = MONTHS[d1.getMonth()];
    const year1 = d1.getFullYear();

    const day2 = d2.getDate();
    const month2 = MONTHS[d2.getMonth()];
    const year2 = d2.getFullYear();

    if (year1 === year2 && month1 === month2) {
      $("#periodo").value = `Del ${day1} al ${day2} de ${month1} de ${year1}`;
    } else if (year1 === year2) {
      $("#periodo").value = `Del ${day1} de ${month1} al ${day2} de ${month2} de ${year1}`;
    } else {
      $("#periodo").value = `Del ${day1} de ${month1} de ${year1} al ${day2} de ${month2} de ${year2}`;
    }
  } else if (startVal) {
    const d1 = new Date(startVal + "T12:00:00");
    const day1 = d1.getDate();
    const month1 = MONTHS[d1.getMonth()];
    const year1 = d1.getFullYear();
    $("#periodo").value = `A partir del ${day1} de ${month1} de ${year1}`;
  }
  updateProgress();
}

if ($("#periodoInicio")) {
  $("#periodoInicio").addEventListener("change", updatePeriodText);
  $("#periodoFin").addEventListener("change", updatePeriodText);
}

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

if ($("#btnSaveKey")) {
  $("#btnSaveKey").onclick = function () {
    var val = ($("#aiKeyInput").value || "").trim();
    if (!val) {
      toast("Ingresa una API Key válida.");
      return;
    }
    if (val.startsWith("sk-")) {
      localStorage.setItem("planeador_openai_key", val);
      toast("API Key de ChatGPT guardada.");
    } else {
      localStorage.setItem("planeador_gemini_key", val);
      toast("API Key de Gemini guardada.");
    }
    $("#aiKeySetup").classList.add("hidden");
    $("#aiChat").classList.remove("hidden");
  };
}

if ($("#btnChangeKey")) {
  $("#btnChangeKey").onclick = function () {
    $("#aiChat").classList.add("hidden");
    $("#aiKeySetup").classList.remove("hidden");
    var keyObj = getApiKey();
    $("#aiKeyInput").value = keyObj.key || "";
    $("#aiKeyInput").focus();
  };
}


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
    "Eres un asistente experto en planeación docente para educación primaria en México bajo el Plan de Estudios 2022 (Nueva Escuela Mexicana).\n" +
    "TEN EN CUENTA QUE LA PLANEACIÓN PUEDE SER UN PROYECTO (usando metodologías NEM como Proyectos Comunitarios, STEAM, ABP, AS) O UNA SECUENCIA DE APRENDIZAJE / SECUENCIA DIDÁCTICA (por contenido, asignatura o tema específico sin proyecto formal del libro).\n" +
    "El usuario te proporcionará instrucciones detalladas y opcionalmente uno o varios archivos de referencia (ej. dosificación de contenidos por semana, programas sintéticos/analíticos, guías del docente, libros de texto o planes previos en Word, Excel, PDF, TXT o imágenes).\n\n" +
    "INSTRUCCIONES CLAVE DE PROCESAMIENTO:\n" +
    "1. Si se adjuntan archivos, examina atentamente todo su contenido (dosificación semanal, contenidos, PDA, proyectos o secuencias didácticas, ejes articuladores).\n" +
    "2. Si el usuario especifica una semana, fecha o periodo (ej. 'Semana 1', 'Semana 3', 'Semana del 15 al 19 de septiembre', 'Bloque 1'), localiza en la dosificación la sección exacta correspondiente a dicha semana.\n" +
    "3. Extrae los contenidos exactos, PDA y campos formativos indicados para esa semana en los archivos adjuntos y genera la planeación didáctica completa (proyecto o secuencia de aprendizaje) congruente con esa semana.\n" +
    "4. Si no se especifica semana, usa los materiales adjuntos como contexto general para construir el proyecto o secuencia didáctica solicitada.\n" +
    "5. En el campo 'metodologia', asigna la metodología de proyecto correspondiente (ej. 'Aprendizaje Basado en Proyectos Comunitarios', 'Indagación STEAM', etc.) o 'Secuencia Didáctica / Secuencia de Aprendizaje' si se trata de una secuencia didáctica por contenido.\n\n" +
    "REGLAS DE SALIDA:\n" +
    "Debes responder ÚNICAMENTE con un objeto JSON válido (sin formato markdown, sin bloques ```json, sin texto explicativo antes ni después, solo el objeto JSON puro).\n\n" +
    "El JSON debe tener esta estructura exacta:\n" +
    "{\n" +
    '  "nombreProyecto": "string (Nombre del proyecto o de la Secuencia Didáctica)",\n' +
    '  "campo": "Lenguajes | Saberes y Pensamiento Científico | Ética, Naturaleza y Sociedades | De lo Humano y lo Comunitario",\n' +
    '  "libro": "string (libro y páginas sugeridas o referencia bibliográfica)",\n' +
    '  "metodologia": "Aprendizaje Basado en Proyectos Comunitarios | Aprendizaje Basado en Proyectos | Aprendizaje Basado en Problemas | Indagación STEAM | Aprendizaje Servicio | Secuencia Didáctica / Secuencia de Aprendizaje | Secuencia Didáctica por Contenido",\n' +
    '  "justificacion": "string (3-5 oraciones redactadas pedagógicamente)",\n' +
    '  "productoFinal": "string (descripción del producto final, evidencia o evaluación integradora)",\n' +
    '  "pda": "string (Procesos de Desarrollo de Aprendizaje, uno por línea)",\n' +
    '  "ejes": "string (Ejes articuladores que se favorecen, uno por línea)",\n' +
    '  "vinculacion": "string (Vinculación con otros campos formativos)",\n' +
    '  "grado": "1° | 2° | 3° | 4° | 5° | 6°",\n' +
    '  "mes": "Enero | Febrero | Marzo | Abril | Mayo | Junio | Julio | Agosto | Septiembre | Octubre | Noviembre | Diciembre",\n' +
    '  "dias": [\n' +
    '    { "fase": "string (ej. Fase 1: Identificación o Sesión 1 / Momento 1)", "inicio": "string", "desarrollo": "string", "cierre": "string", "materiales": "string" }\n' +
    "  ],\n" +
    '  "criterios": [\n' +
    '    { "nombre": "string", "esperado": "string", "desarrollo": "string", "apoyo": "string" }\n' +
    "  ]\n" +
    "}\n\n" +
    'Para el campo "grado" usa exactamente uno de estos valores: "1°", "2°", "3°", "4°", "5°", "6°".\n' +
    "Genera contenido pedagógico real, completo y detallado. Genera al menos 4-5 días en la secuencia diaria y al menos 4 criterios de evaluación formativa."
  );
}

function getApiKey() {
  // 1. ChatGPT / OpenAI desde env.js
  if (window.ENV && window.ENV.OPENAI_API_KEY && window.ENV.OPENAI_API_KEY.trim() && window.ENV.OPENAI_API_KEY.indexOf("YOUR_") === -1 && window.ENV.OPENAI_API_KEY.trim().startsWith("sk-")) {
    return { provider: "openai", key: window.ENV.OPENAI_API_KEY.trim() };
  }
  // 2. ChatGPT / OpenAI desde localStorage
  var storedOpenAI = localStorage.getItem("planeador_openai_key");
  if (storedOpenAI && storedOpenAI.trim()) {
    return { provider: "openai", key: storedOpenAI.trim() };
  }
  // 3. Gemini desde env.js
  if (window.ENV && window.ENV.GEMINI_API_KEY && window.ENV.GEMINI_API_KEY.trim()) {
    return { provider: "gemini", key: window.ENV.GEMINI_API_KEY.trim() };
  }
  // 4. Gemini desde localStorage
  var storedGemini = localStorage.getItem("planeador_gemini_key");
  if (storedGemini && storedGemini.trim()) {
    return { provider: "gemini", key: storedGemini.trim() };
  }

  return { provider: "none", key: "" };
}

async function callOpenAIAI(userMessage, fileParts, apiKey) {
  var textContents = [];
  var imageContents = [];

  (fileParts || []).forEach(function (part) {
    if (Array.isArray(part)) {
      part.forEach(function (sub) {
        if (sub.text) textContents.push(sub.text);
        if (sub.inlineData) {
          imageContents.push({
            type: "image_url",
            image_url: { url: "data:" + (sub.inlineData.mimeType || "image/png") + ";base64," + sub.inlineData.data }
          });
        }
      });
    } else {
      if (part.text) textContents.push(part.text);
      if (part.inlineData) {
        imageContents.push({
          type: "image_url",
          image_url: { url: "data:" + (part.inlineData.mimeType || "image/png") + ";base64," + part.inlineData.data }
        });
      }
    }
  });

  var promptText = "Solicitud del docente: " + userMessage;
  if (textContents.length) {
    promptText += "\n\n[ARCHIVOS Y DOCUMENTOS DE CONTEXTO ADJUNTOS]:\n" + textContents.join("\n\n");
  }

  var userContent = [{ type: "text", text: promptText }];
  if (imageContents.length) {
    userContent = userContent.concat(imageContents);
  }

  var body = {
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: buildSystemPrompt() },
      { role: "user", content: userContent }
    ],
    temperature: 0.7,
    max_tokens: 4096,
    response_format: { type: "json_object" }
  };

  var res;
  try {
    res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + apiKey
      },
      body: JSON.stringify(body)
    });
  } catch (netErr) {
    throw new Error("Error de red al conectar con ChatGPT (OpenAI). Revisa tu conexión a internet.");
  }

  var resText = await res.text();
  var data;
  try {
    data = JSON.parse(resText);
  } catch (e) {
    throw new Error("Respuesta no válida recibida de ChatGPT.");
  }

  if (!res.ok) {
    var msg = data?.error?.message || "Error " + res.status + " en ChatGPT API";
    if (msg.indexOf("exceeded your current quota") !== -1 || msg.indexOf("insufficient_quota") !== -1) {
      var errQuota = new Error("OPENAI_QUOTA_EXCEEDED");
      errQuota.originalMessage = msg;
      throw errQuota;
    }
    if (msg.indexOf("Incorrect API key") !== -1 || msg.indexOf("invalid_api_key") !== -1) {
      msg = "La API Key de ChatGPT no es válida. Coloca una API Key correcta que empiece por 'sk-...'.";
    }
    throw new Error(msg);
  }

  return data?.choices?.[0]?.message?.content || "";
}

async function callGeminiDirect(body, apiKey) {
  var url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent?key=" + encodeURIComponent(apiKey);
  var resDirect;
  try {
    resDirect = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
  } catch (e) {
    throw new Error("Error de red al conectar con la API de Gemini.");
  }

  var textDirect = await resDirect.text();
  var dataDirect;
  try {
    dataDirect = JSON.parse(textDirect);
  } catch (e) {
    throw new Error("Respuesta no válida recibida de Gemini.");
  }

  if (!resDirect.ok) {
    var msg = dataDirect?.error?.message || "Error " + resDirect.status + " en Gemini API";
    throw new Error(msg);
  }

  var text = dataDirect && dataDirect.candidates && dataDirect.candidates[0] && dataDirect.candidates[0].content && dataDirect.candidates[0].content.parts && dataDirect.candidates[0].content.parts[0] && dataDirect.candidates[0].content.parts[0].text ? dataDirect.candidates[0].content.parts[0].text : "";
  return text;
}

async function callGeminiAI(userMessage, fileParts) {
  var keyObj = getApiKey();

  // 1. Si la clave es de ChatGPT (OpenAI)
  if (keyObj.provider === "openai") {
    try {
      return await callOpenAIAI(userMessage, fileParts, keyObj.key);
    } catch (openAiErr) {
      if (openAiErr.message === "OPENAI_QUOTA_EXCEEDED") {
        // Intentar fallback a Gemini si hay clave disponible
        var geminiKey = (window.ENV && window.ENV.GEMINI_API_KEY && window.ENV.GEMINI_API_KEY.trim()) || localStorage.getItem("planeador_gemini_key");
        if (geminiKey && geminiKey.trim()) {
          console.warn("Cuota de OpenAI agotada. Usando Google Gemini (Gratis)...");
          var parts = [{ text: buildSystemPrompt() + "\n\nSolicitud del docente: " + userMessage }];
          if (fileParts && fileParts.length) parts = parts.concat(fileParts);
          var body = { contents: [{ role: "user", parts: parts }], generationConfig: { temperature: 0.7, maxOutputTokens: 8192 } };
          return await callGeminiDirect(body, geminiKey.trim());
        }
        throw new Error("ChatGPT (OpenAI) requiere saldo pagado en su plataforma de desarrolladores (platform.openai.com). Te recomendamos usar Google Gemini, la cual es 100% GRATUITA.");
      }
      throw openAiErr;
    }
  }

  // 2. Si la clave es de Gemini o fallback por defecto
  var geminiApiKey = (keyObj.provider === "gemini" && keyObj.key) ? keyObj.key : ((window.ENV && window.ENV.GEMINI_API_KEY && window.ENV.GEMINI_API_KEY.trim()) || localStorage.getItem("planeador_gemini_key"));
  if (geminiApiKey && geminiApiKey.trim()) {
    var parts = [{ text: buildSystemPrompt() + "\n\nSolicitud del docente: " + userMessage }];
    if (fileParts && fileParts.length) parts = parts.concat(fileParts);
    var body = { contents: [{ role: "user", parts: parts }], generationConfig: { temperature: 0.7, maxOutputTokens: 8192 } };
    return await callGeminiDirect(body, geminiApiKey.trim());
  }

  throw new Error("No se ha configurado ninguna API Key válida. Agrega tu clave de ChatGPT o de Gemini.");
}

function parseAIJson(text) {
  var clean = text
    .replace(/```json\n?/gi, "")
    .replace(/```\n?/g, "")
    .trim();
  var match = clean.match(/\{[\s\S]*\}/);
  if (!match) throw new Error("No se encontró un objeto JSON válido en la respuesta de la IA.");
  return JSON.parse(match[0]);
}

// ---- Manejo de archivos adjuntos múltiples (PDF, Word, Excel, TXT, imágenes) ----
var pendingFiles = [];

function readFileAsPart(file) {
  return new Promise(function (resolve, reject) {
    var ext = file.name.split(".").pop().toLowerCase();

    // 1. Archivos Word (.docx, .doc)
    if (ext === "docx" || ext === "doc") {
      var reader = new FileReader();
      reader.onload = function (e) {
        var arrayBuffer = e.target.result;
        if (window.mammoth && ext === "docx") {
          window.mammoth.extractRawText({ arrayBuffer: arrayBuffer })
            .then(function (result) {
              resolve({ text: '\n\n[DOCUMENTO WORD: "' + file.name + '"]:\n' + (result.value || "Sin texto extraíble") });
            })
            .catch(function () {
              resolve({ text: '\n\n[DOCUMENTO WORD: "' + file.name + '"]' });
            });
        } else {
          var text = new TextDecoder("utf-8", { fatal: false }).decode(arrayBuffer);
          var cleanText = text.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F]/g, " ");
          resolve({ text: '\n\n[DOCUMENTO WORD: "' + file.name + '"]:\n' + cleanText.slice(0, 20000) });
        }
      };
      reader.onerror = reject;
      reader.readAsArrayBuffer(file);
      return;
    }

    // 2. Archivos Excel (.xlsx, .xls, .csv)
    if (ext === "xlsx" || ext === "xls" || ext === "csv") {
      var reader = new FileReader();
      if (ext === "csv") {
        reader.onload = function (e) {
          resolve({ text: '\n\n[TABLA CSV/EXCEL: "' + file.name + '"]:\n' + e.target.result });
        };
        reader.onerror = reject;
        reader.readAsText(file, "utf-8");
      } else {
        reader.onload = function (e) {
          try {
            if (window.XLSX) {
              var workbook = window.XLSX.read(e.target.result, { type: "array" });
              var fullText = "";
              workbook.SheetNames.forEach(function (sheetName) {
                var csv = window.XLSX.utils.sheet_to_csv(workbook.Sheets[sheetName]);
                if (csv.trim()) {
                  fullText += "\n--- Hoja: " + sheetName + " ---\n" + csv;
                }
              });
              resolve({ text: '\n\n[DOCUMENTO EXCEL: "' + file.name + '"]:\n' + (fullText || "Hoja vacía") });
            } else {
              resolve({ text: '\n\n[DOCUMENTO EXCEL: "' + file.name + '"]' });
            }
          } catch (err) {
            reject(err);
          }
        };
        reader.onerror = reject;
        reader.readAsArrayBuffer(file);
      }
      return;
    }

    // 3. Archivos de texto plano (.txt)
    var isText = file.type === "text/plain" || ext === "txt";
    if (isText) {
      var reader = new FileReader();
      reader.onload = function (e) {
        resolve({ text: '\n\n[DOCUMENTO TEXTO: "' + file.name + '"]:\n' + e.target.result });
      };
      reader.onerror = reject;
      reader.readAsText(file, "utf-8");
      return;
    }

    // 4. PDF, Imágenes y otros binarios
    var reader = new FileReader();
    reader.onload = function (e) {
      var base64 = e.target.result.split(",")[1];
      resolve([
        { text: '\n[DOCUMENTO ADJUNTO (PDF/IMAGEN): "' + file.name + '"]' },
        { inlineData: { mimeType: file.type || "application/pdf", data: base64 } }
      ]);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function renderAttachmentsList() {
  var container = $("#aiAttachList");
  if (!container) return;
  container.innerHTML = "";
  pendingFiles.forEach(function (item, index) {
    var chip = document.createElement("div");
    chip.className = "ai-attach-chip";
    chip.innerHTML = "📎 " + esc(item.name) + ' <button type="button" class="remove-chip" title="Eliminar archivo">×</button>';
    chip.querySelector(".remove-chip").onclick = function () {
      pendingFiles.splice(index, 1);
      renderAttachmentsList();
    };
    container.appendChild(chip);
  });
}

function clearAttachments() {
  pendingFiles = [];
  renderAttachmentsList();
  if ($("#aiFileInput")) $("#aiFileInput").value = "";
}

$("#aiAttachBtn").onclick = function () {
  $("#aiFileInput").click();
};

$("#aiFileInput").addEventListener("change", async function () {
  var selectedFiles = Array.from(this.files || []);
  if (!selectedFiles.length) return;

  var allowedMimes = [
    "application/pdf", "text/plain", "image/png", "image/jpeg", "image/webp", "image/gif",
    "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/vnd.ms-excel", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "text/csv"
  ];
  var allowedExts = ["pdf", "txt", "doc", "docx", "xls", "xlsx", "csv", "png", "jpg", "jpeg", "webp", "gif"];

  for (var i = 0; i < selectedFiles.length; i++) {
    var file = selectedFiles[i];
    var ext = file.name.split(".").pop().toLowerCase();
    if (!allowedMimes.includes(file.type) && !allowedExts.includes(ext)) {
      toast("El archivo '" + file.name + "' no es permitido (solo PDF, Word, Excel, TXT e imágenes).");
      continue;
    }
    if (file.size > 20 * 1024 * 1024) {
      toast("El archivo '" + file.name + "' supera los 20 MB.");
      continue;
    }
    try {
      var parts = await readFileAsPart(file);
      pendingFiles.push({
        name: file.name,
        parts: Array.isArray(parts) ? parts : [parts]
      });
    } catch (e) {
      toast("Error al leer el archivo '" + file.name + "'.");
    }
  }

  renderAttachmentsList();
});

// Event listener para sugerencias rápidas (chips)
$$(".ai-chip-btn").forEach(function (btn) {
  btn.onclick = function () {
    var promptText = btn.getAttribute("data-prompt");
    if (promptText) {
      $("#aiPromptInput").value = promptText;
      $("#aiPromptInput").focus();
    }
  };
});

var lastAIRequest = null;

async function executeAIRequest(msg, filePartsToSend) {
  lastAIRequest = { msg: msg, fileParts: filePartsToSend };

  var thinking = addAIMessage("✨ Analizando archivos y generando planeación, espera un momento...", "thinking");
  $("#btnSendAI").disabled = true;

  try {
    var raw = await callGeminiAI(msg, filePartsToSend);
    thinking.remove();

    var aiData = parseAIJson(raw);
    apply(aiData);

    var filled = Object.keys(aiData).filter(function (k) {
      return k !== "dias" && k !== "criterios" && aiData[k];
    }).length;
    var dias = (aiData.dias || []).length;
    var crit = (aiData.criterios || []).length;
    addAIMessage("✅ ¡Listo! Llené <strong>" + filled + " campos</strong> de texto, <strong>" + dias + " días</strong> en la secuencia diaria y <strong>" + crit + " criterios</strong> de evaluación basándome en tus archivos e instrucciones.<br><br>Revisa y ajusta los campos antes de generar la vista previa.", "bot");
    toast("Planeación generada por IA ✨");
  } catch (err) {
    thinking.remove();
    var errMsg = err.message || "Error desconocido";
    var errorDiv = addAIMessage("❌ <strong>Error:</strong> " + errMsg + '<br><br><button type="button" class="ai-retry-btn">🔄 Reintentar petición</button>', "bot");

    var retryBtn = errorDiv.querySelector(".ai-retry-btn");
    if (retryBtn) {
      retryBtn.onclick = function () {
        errorDiv.remove();
        executeAIRequest(lastAIRequest.msg, lastAIRequest.fileParts);
      };
    }
  } finally {
    $("#btnSendAI").disabled = false;
    $("#aiPromptInput").focus();
  }
}

async function sendAIMessage() {
  var input = $("#aiPromptInput");
  var msg = input.value.trim();
  if (!msg && !pendingFiles.length) return;
  if (!msg) msg = "Analiza los archivos adjuntos (dosificación, contenidos) y genera la planeación didáctica correspondiente.";

  input.value = "";
  var userLabel = msg + (pendingFiles.length ? " 📎 (" + pendingFiles.length + " archivo" + (pendingFiles.length > 1 ? "s" : "") + ")" : "");
  addAIMessage(userLabel, "user");

  // Aplanar todas las partes de los archivos adjuntos
  var filePartsToSend = [];
  pendingFiles.forEach(function (item) {
    filePartsToSend = filePartsToSend.concat(item.parts);
  });

  clearAttachments();
  executeAIRequest(msg, filePartsToSend);
}

$("#btnSendAI").onclick = sendAIMessage;
$("#aiPromptInput").addEventListener("keydown", function (e) {
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault();
    sendAIMessage();
  }
});
