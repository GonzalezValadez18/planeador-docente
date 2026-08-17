export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Método no permitido",
    });
  }

  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return res.status(500).json({
      error: "GEMINI_API_KEY no está configurada en el servidor.",
    });
  }

  try {
    const { contents, generationConfig } = req.body;

    if (!contents) {
      return res.status(400).json({
        error: "Falta el contenido de la solicitud.",
      });
    }

    const response = await fetch("https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": apiKey,
      },
      body: JSON.stringify({
        contents,
        generationConfig: generationConfig || {
          temperature: 0.7,
          maxOutputTokens: 8192,
        },
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("Error Gemini:", data);

      return res.status(response.status).json({
        error: data?.error?.message || "Error al comunicarse con Gemini.",
      });
    }

    return res.status(200).json(data);
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      error: "Error interno del servidor.",
    });
  }
}
