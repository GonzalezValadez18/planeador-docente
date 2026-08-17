========================================================================
   PLANEADOR DOCENTE JMERCURY - NUEVA ESCUELA MEXICANA (NEM) CON IA
========================================================================

Aplicación web para la creación, gestión, generación asistida por IA 
e impresión de planeaciones docentes y secuencias de aprendizaje para 
educación primaria en México (Plan de Estudios 2022).

------------------------------------------------------------------------
✨ CARACTERÍSTICAS PRINCIPALES
------------------------------------------------------------------------

1. SOPORTE DUAL: PROYECTOS Y SECUENCIAS DE APRENDIZAJE
   - Diseñado para trabajar tanto con Proyectos de la NEM (Proyectos 
     Comunitarios, Indagación STEAM, ABP, Aprendizaje Servicio) como 
     con Secuencias Didácticas / Secuencias de Aprendizaje por contenido.

2. ASISTENTE IA DOCENTE INTELIGENTE ("LEO")
   - Generación automática de planeaciones estructuradas en JSON.
   - Compatible con API Keys de ChatGPT (OpenAI sk-...) y Google Gemini.
   - Lectura y análisis de archivos adjuntos (PDF, Word, Excel, TXT e imágenes) 
     para extraer dosificaciones semanales, contenidos, PDA y ejes articuladores.

3. ESTRUCTURA COMPLETA DE PLANEACIÓN DIDÁCTICA
   - Paso 1: Datos Generales (Escuela, CCT, Zona, Sector, Docente, Ciclo, Grado, Grupo, Periodo).
   - Paso 2: Proyecto o Secuencia (Campo Formativo, Libro, Metodología, Justificación, Producto/Evidencia, PDA, Ejes, Vinculación).
   - Paso 3: Secuencia Diaria (Inicio → Desarrollo → Cierre, Fases/Momentos y Materiales).
   - Paso 4: Evaluación Formativa (Rúbrica con niveles: Esperado, En Desarrollo, Requiere Apoyo).
   - Paso 5: Reflexión y Adecuaciones (Logros, Dificultades, Adecuaciones y Notas).

4. VISTA PREVIA E IMPRESIÓN OFICIAL (PDF)
   - Vista previa escalada proporcionalmente para pantallas móviles y tabletas sin desbordamientos.
   - Formato oficial listo para imprimir en hoja carta horizontal (Letter Landscape 11" x 8.5").

5. SIN NECESIDAD DE SERVIDOR O INSTALACIÓN
   - Funciona directo en el navegador mediante HTML5, CSS3 y JavaScript puro.
   - Almacenamiento local automático (localStorage) para guardar y cargar tus avances.

------------------------------------------------------------------------
🚀 MODO DE USO
------------------------------------------------------------------------

1. Abre "index.html" en cualquier navegador moderno (Chrome, Edge, Firefox, Safari).
2. Llena los datos generales de la escuela y docente.
3. Define el Proyecto o Secuencia de Aprendizaje (o usa el Asistente IA / Cargar Ejemplo).
4. Agrega los días de trabajo con sus actividades (Inicio, Desarrollo, Cierre).
5. Configura los criterios de la rúbrica de evaluación.
6. Haz clic en "Guardar" para conservar la información en tu navegador.
7. Haz clic en "Generar vista previa" o "Imprimir / PDF" para obtener tu documento listo.

------------------------------------------------------------------------
🤖 USO DEL ASISTENTE IA ("LEO")
------------------------------------------------------------------------

1. Haz clic en el botón flotante "Asistente IA" en la esquina inferior derecha.
2. Ingresa tu API Key de ChatGPT (OpenAI) o Google Gemini.
3. Adjunta tus archivos de referencia (dosificación semanal, programa sintético, guía o planeación previa).
4. Pide la planeación deseada (ej. "Genera la planeación de la Semana 1 de acuerdo con la dosificación adjunta").
5. La IA completará automáticamente todos los campos del formulario.

------------------------------------------------------------------------
📁 ESTRUCTURA DEL PROYECTO
------------------------------------------------------------------------

- index.html        : Interfaz principal, formulario de planeación y modal de IA.
- styles.css        : Sistema de estilos, diseño adaptativo móvil y formato de impresión PDF.
- app.js            : Lógica del planeador, conexión con APIs de IA, almacenamiento local y renderizado.
- env.js            : Configuración de llaves de entorno opcionales.
- logo-sep.png      : Logotipo oficial para los encabezados impresos.
- logo-ciclo.png    : Logotipo institucional del ciclo escolar.

------------------------------------------------------------------------
Desarrollado con ❤️ para docentes de México.
========================================================================
