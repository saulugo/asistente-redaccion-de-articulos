import { generateArticleWithOpenAI, OpenAIRequest } from './openaiService';

export interface ArticleInput {
  titulo: string;
  keywords: string;
  publicoObjetivo: string;
  tono: string;
  longitud: string;
}

export const generateArticle = async (input: ArticleInput): Promise<string> => {
  // Verificar si tenemos API key de OpenAI
  const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
  
  if (apiKey && apiKey.trim() !== '') {
    // Usar OpenAI API
    try {
      const openaiRequest: OpenAIRequest = {
        titulo: input.titulo,
        keywords: input.keywords,
        publicoObjetivo: input.publicoObjetivo,
        tono: input.tono,
        longitud: input.longitud
      };
      
      return await generateArticleWithOpenAI(openaiRequest);
    } catch (error) {
      console.error('Error con OpenAI, usando generador local:', error);
      // Fallback al generador local si falla OpenAI
      return generateLocalArticle(input);
    }
  } else {
    // Usar generador local si no hay API key
    console.log('No se encontró API key de OpenAI, usando generador local');
    return generateLocalArticle(input);
  }
};

const generateLocalArticle = async (input: ArticleInput): Promise<string> => {
  // Simular tiempo de generación
  await new Promise(resolve => setTimeout(resolve, 2000));

  const { titulo, keywords, publicoObjetivo, tono, longitud } = input;
  
  const keywordArray = keywords.split(',').map(k => k.trim()).filter(k => k);
  const wordCount = longitud.includes('400') ? '400' : longitud.includes('700') ? '700' : '1000';
  
  const toneMap: Record<string, string> = {
    'Conversacional': 'conversacional y cercano',
    'Profesional': 'profesional y autorizado',
    'Entusiasta': 'entusiasta y motivador',
    'Informativo': 'informativo y educativo'
  };

  const selectedTone = toneMap[tono] || 'informativo';

  return `# ${titulo}

## Introducción

En el mundo actual, ${titulo.toLowerCase()} se ha convertido en un tema fundamental para ${publicoObjetivo.toLowerCase()}. Este artículo aborda de manera ${selectedTone} los aspectos más importantes que debes conocer.

## Puntos Clave

### 1. Conceptos Fundamentales

${keywordArray.length > 0 ? `Los conceptos clave que exploraremos incluyen: ${keywordArray.join(', ')}. Cada uno de estos elementos juega un papel crucial en el desarrollo del tema.` : 'Los conceptos fundamentales son esenciales para comprender el tema en profundidad.'}

### 2. Aplicación Práctica

Para ${publicoObjetivo.toLowerCase()}, la aplicación práctica de estos conceptos puede marcar la diferencia entre el éxito y el fracaso en sus objetivos.

### 3. Beneficios y Ventajas

- Mejora en la comprensión del tema
- Aplicación directa en situaciones reales
- Desarrollo de habilidades específicas
- Incremento en la eficiencia y resultados

## Estrategias Recomendadas

1. **Análisis inicial**: Evalúa tu situación actual
2. **Planificación**: Define objetivos claros y medibles
3. **Implementación**: Aplica las técnicas paso a paso
4. **Seguimiento**: Monitorea los resultados y ajusta según sea necesario

## Conclusión

${titulo} representa una oportunidad única para ${publicoObjetivo.toLowerCase()}. La implementación de las estrategias mencionadas, combinada con un enfoque ${selectedTone}, puede generar resultados excepcionales.

${keywordArray.length > 0 ? `Recuerda que los elementos clave (${keywordArray.join(', ')}) deben ser considerados en cada paso del proceso.` : ''}

---

*Este artículo contiene aproximadamente ${wordCount} palabras y está diseñado específicamente para ${publicoObjetivo.toLowerCase()} con un tono ${selectedTone}.*`;
};