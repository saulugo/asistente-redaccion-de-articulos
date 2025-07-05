export interface OpenAIRequest {
  titulo: string;
  keywords: string;
  publicoObjetivo: string;
  tono: string;
  longitud: string;
}

export interface OpenAIResponse {
  choices: Array<{
    message: {
      content: string;
    };
  }>;
}

const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';

export const generateArticleWithOpenAI = async (input: OpenAIRequest): Promise<string> => {
  // Construir el prompt completo siguiendo las especificaciones
  const promptCompleto = buildPrompt(input);

  const requestBody = {
    //model: "gpt-4o",
    model: "gpt-4.1-nano",
    messages: [
      {
        role: "user",
        content: promptCompleto
      }
    ],
    temperature: 0.7
  };

  try {
    const response = await fetch(OPENAI_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`
      },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      throw new Error(`Error de API: ${response.status} - ${response.statusText}`);
    }

    const data: OpenAIResponse = await response.json();
    
    if (!data.choices || data.choices.length === 0) {
      throw new Error('No se recibió respuesta válida de la API');
    }

    return data.choices[0].message.content;
  } catch (error) {
    console.error('Error en la llamada a OpenAI:', error);
    throw new Error('Error al generar el artículo. Verifica tu conexión y API key.');
  }
};

const buildPrompt = (input: OpenAIRequest): string => {
  // PASO 1: CAPTURAR LOS VALORES DE LA INTERFAZ
  const var_tema = input.titulo;
  const var_keywords = input.keywords;
  const var_publico = input.publicoObjetivo;
  const var_tono = input.tono;
  const var_longitud = input.longitud;

  // PASO 2: CONSTRUIR EL PROMPT FINAL MEDIANTE CONCATENACIÓN
  let promptCompleto = '';

  // Añadir el Bloque de Rol (Texto Fijo)
  promptCompleto += 'Eres un redactor de contenidos senior y experto en SEO para la agencia de marketing digital "Nexus Media". Tu especialidad es crear borradores de artículos de blog que sean informativos, atractivos y que sirvan como un excelente punto de partida para que un editor humano los refine. Tu tarea es escribir un borrador de un artículo de blog en español.\n\n';

  // Añadir los Parámetros Dinámicos (Texto Fijo + Variables)
  promptCompleto += `- TEMA PRINCIPAL: ${var_tema}\n`;
  promptCompleto += `- PÚBLICO OBJETIVO: ${var_publico}\n`;
  
  if (var_tono) {
    promptCompleto += `- TONO DE VOZ: ${var_tono}\n`;
  }
  
  if (var_keywords) {
    promptCompleto += `- PALABRAS CLAVE A INCLUIR: ${var_keywords}\n`;
  }
  
  if (var_longitud) {
    promptCompleto += `- LONGITUD APROXIMADA: ${var_longitud}\n`;
  }

  // Añadir el Bloque de Reglas (Texto Fijo)
  promptCompleto += '\nREQUISITOS DE ESTRUCTURA Y FORMATO: El artículo debe tener un Título (H1), una Introducción, al menos 3 secciones con subtítulos (H2) y una Conclusión. REGLAS DE CALIDAD: Integra las keywords de forma natural, aporta valor real, usa un lenguaje claro y evita clichés. La conclusión no debe empezar con "En conclusión...". Ahora, por favor, genera el borrador del artículo.';

  return promptCompleto;
};