# 📚 Planeador Docente JMercury - Nueva Escuela Mexicana (NEM) con IA

Aplicación web para la creación, gestión, generación asistida por IA e impresión de planeaciones docentes y secuencias de aprendizaje para educación primaria en México (Plan de Estudios 2022).

---

## ✨ Características Principales

### 1. Soporte Dual: Proyectos y Secuencias de Aprendizaje
- Diseñado para trabajar tanto con **Proyectos de la NEM** (*Proyectos Comunitarios, Indagación STEAM, ABP, Aprendizaje Servicio*) como con **Secuencias Didácticas / Secuencias de Aprendizaje** por contenido.

### 2. Asistente IA Docente Inteligente ("Leo")
- Generación automática de planeaciones didácticas completas.
- Compatible con **ChatGPT (OpenAI API)** y **Google Gemini API**.
- Lector multiformato de archivos adjuntos (**PDF, Word, Excel, TXT e imágenes**) para extraer dosificaciones semanales, contenidos, PDA y ejes articuladores.

### 3. Estructura Completa de Planeación Didáctica
- **Paso 1: Datos Generales**: Escuela, CCT, Zona, Sector, Docente, Ciclo, Grado, Grupo y Periodo de aplicación en calendario.
- **Paso 2: Proyecto o Secuencia**: Campo Formativo, Libro, Metodología/Modalidad, Justificación, Producto Final/Evidencia, PDA, Ejes Articuladores y Vinculación Sugerida.
- **Paso 3: Secuencia Diaria**: Inicio → Desarrollo → Cierre con fases/momentos y materiales.
- **Paso 4: Evaluación Formativa**: Rúbrica con niveles (*Esperado, En Desarrollo, Requiere Apoyo*).
- **Paso 5: Reflexión y Adecuaciones**: Logros, Dificultades, Adecuaciones Curriculares y Notas.

### 4. Vista Previa e Impresión Oficial PDF
- Vista previa escalada proporcionalmente para pantallas móviles y tabletas sin desbordamientos.
- Formato imprimible oficial listo para entregar en hoja carta horizontal (*Letter Landscape 11" x 8.5"*).

### 5. Sin Servidor ni Instalación
- Funciona 100% en el navegador utilizando HTML5, CSS3 puro y JavaScript ES6+.
- Almacenamiento local automático (`localStorage`) para guardar y cargar tus avances sin perder información.

---

## 🚀 Modo de Uso

1. Abre `index.html` en tu navegador preferido (Chrome, Edge, Firefox, Safari).
2. Completa los datos generales y del proyecto o secuencia.
3. Agrega los días de trabajo con sus actividades de Inicio, Desarrollo y Cierre.
4. Define los criterios de la rúbrica de evaluación.
5. Haz clic en **Guardar** para conservar tus datos en el navegador.
6. Haz clic en **Generar vista previa** o **Imprimir / PDF** para obtener tu documento oficial.

---

## 🤖 Uso del Asistente IA ("Leo")

1. Haz clic en el botón flotante **Asistente IA** en la esquina inferior derecha.
2. Ingresa tu API Key de ChatGPT (`sk-...`) o de Google Gemini.
3. Adjunta tus documentos de referencia (dosificación semanal, programa sintético, guías o planes anteriores).
4. Escribe lo que necesitas (ej. *"Genera la planeación de la Semana 1 según la dosificación adjunta"*).
5. La IA completará todos los campos automáticamente.

---

## 📁 Archivos del Proyecto

- `index.html` : Interfaz principal, formulario de planeación y modal de IA.
- `styles.css` : Estilos visuales, maquetación responsiva móvil y vista de impresión PDF.
- `app.js` : Lógica del planeador, asistente IA, persistencia de datos y renderizado.
- `env.js` : Archivo de configuración opcional para API Keys.
- `README.txt` / `README.md` : Documentación completa del proyecto.
- `logo-sep.png` / `logo-ciclo.png` : Recursos gráficos para el documento oficial.

---

*Desarrollado con ❤️ para la Docente Wendy.*
