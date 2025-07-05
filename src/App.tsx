import React, { useState } from 'react';
import { PenTool, Copy, Check, FileText, Sparkles, Settings } from 'lucide-react';
import { FormField } from './components/FormField';
import { Input } from './components/Input';
import { Select } from './components/Select';
import { Button } from './components/Button';
import { TextArea } from './components/TextArea';
import { ApiKeySetup } from './components/ApiKeySetup';
import { useClipboard } from './hooks/useClipboard';
import { generateArticle, ArticleInput } from './utils/articleGenerator';

const TONO_OPTIONS = [
  { value: 'Conversacional', label: 'Conversacional' },
  { value: 'Profesional', label: 'Profesional' },
  { value: 'Entusiasta', label: 'Entusiasta' },
  { value: 'Informativo', label: 'Informativo' }
];

const LONGITUD_OPTIONS = [
  { value: '~400 palabras', label: '~400 palabras' },
  { value: '~700 palabras', label: '~700 palabras' },
  { value: '~1000 palabras', label: '~1000 palabras' }
];

function App() {
  const [formData, setFormData] = useState<ArticleInput>({
    titulo: '',
    keywords: '',
    publicoObjetivo: '',
    tono: '',
    longitud: ''
  });
  
  const [borrador, setBorrador] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [showApiSetup, setShowApiSetup] = useState(false);
  const { copied, copyToClipboard } = useClipboard();

  const handleInputChange = (field: keyof ArticleInput, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleGenerate = async () => {
    // Validación mejorada
    if (!formData.titulo.trim() || !formData.publicoObjetivo.trim()) {
      alert('Por favor, completa al menos el título y el público objetivo.');
      return;
    }

    // PASO 1: Iniciar Estado de Carga
    setIsGenerating(true);
    setBorrador(''); // Limpiar resultado anterior
    
    try {
      // PASO 2: Llamada a la API (ya implementada en generateArticle)
      const generatedArticle = await generateArticle(formData);
      
      // PASO 3: Actualizar la Interfaz con el Resultado
      setBorrador(generatedArticle);
    } catch (error) {
      console.error('Error generando artículo:', error);
      alert(`Error al generar el artículo: ${error instanceof Error ? error.message : 'Error desconocido'}. Por favor, inténtalo de nuevo.`);
    } finally {
      // PASO 4: Finalizar Estado de Carga
      setIsGenerating(false);
    }
  };

  // WORKFLOW 2: Copiar al Portapapeles (mejorado)
  const handleCopy = () => {
    if (borrador) {
      copyToClipboard(borrador);
    } else {
      alert('No hay contenido para copiar. Genera un borrador primero.');
    }
  };

  const isFormValid = formData.titulo.trim() && formData.publicoObjetivo.trim();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-600 rounded-lg">
              <PenTool className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Asistente de Redacción de Artículos
              </h1>
              <p className="text-gray-600">Nexus Media - Generador de Contenido Inteligente</p>
            </div>
            <Button
              onClick={() => setShowApiSetup(!showApiSetup)}
              variant="secondary"
              className="flex items-center gap-2 ml-auto"
            >
              <Settings className="w-4 h-4" />
              Configuración
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* API Key Setup */}
        {showApiSetup && (
          <ApiKeySetup onApiKeySet={() => setShowApiSetup(false)} />
        )}
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Columna Izquierda - Entradas */}
          <div className="bg-white rounded-xl shadow-lg p-6 h-fit">
            <div className="flex items-center gap-2 mb-6">
              <Sparkles className="w-5 h-5 text-blue-600" />
              <h2 className="text-xl font-semibold text-gray-900">Configuración del Artículo</h2>
            </div>
            
            <div className="space-y-6">
              <FormField label="Título o Tema Principal">
                <Input
                  id="input_tema"
                  placeholder="Ej: Estrategias de Marketing Digital para 2024"
                  value={formData.titulo}
                  onChange={(value) => handleInputChange('titulo', value)}
                />
              </FormField>

              <FormField label="Palabras Clave (separadas por comas)">
                <Input
                  id="input_keywords"
                  placeholder="Ej: marketing digital, SEO, redes sociales, contenido"
                  value={formData.keywords}
                  onChange={(value) => handleInputChange('keywords', value)}
                />
              </FormField>

              <FormField label="Público Objetivo">
                <Input
                  id="input_publico"
                  placeholder="Ej: Emprendedores y pequeñas empresas"
                  value={formData.publicoObjetivo}
                  onChange={(value) => handleInputChange('publicoObjetivo', value)}
                />
              </FormField>

              <FormField label="Tono de Voz">
                <Select
                  id="select_tono"
                  value={formData.tono}
                  onChange={(value) => handleInputChange('tono', value)}
                  options={TONO_OPTIONS}
                  placeholder="Seleccionar tono de voz"
                />
              </FormField>

              <FormField label="Longitud Aproximada">
                <Select
                  id="select_longitud"
                  value={formData.longitud}
                  onChange={(value) => handleInputChange('longitud', value)}
                  options={LONGITUD_OPTIONS}
                  placeholder="Seleccionar longitud"
                />
              </FormField>

              <Button
                id="btn_generar"
                onClick={handleGenerate}
                disabled={!isFormValid}
                loading={isGenerating}
                className="w-full"
              >
                {isGenerating ? 'Generando Borrador...' : 'Generar Borrador'}
              </Button>
            </div>
          </div>

          {/* Columna Derecha - Borrador Generado */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-green-600" />
                <h2 className="text-xl font-semibold text-gray-900">Borrador Generado</h2>
              </div>
              {borrador && (
                <Button
                  id="btn_copiar"
                  onClick={handleCopy}
                  variant="secondary"
                  className="flex items-center gap-2 shrink-0"
                >
                  {copied ? (
                    <>
                      <Check className="w-4 h-4" />
                      ¡Copiado!
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      Copiar Texto
                    </>
                  )}
                </Button>
              )}
            </div>

            <div className="space-y-4">
              <TextArea
                id="output_borrador"
                value={borrador}
                placeholder="El borrador generado aparecerá aquí. Completa el formulario de la izquierda y presiona 'Generar Borrador' para comenzar."
                readOnly
                rows={20}
              />
              
              {borrador && (
                <div className="flex justify-end">
                  <Button
                    id="btn_copiar_bottom"
                    onClick={handleCopy}
                    variant="secondary"
                    className="flex items-center gap-2"
                  >
                    {copied ? (
                      <>
                        <Check className="w-4 h-4 text-green-600" />
                        ¡Copiado!
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        Copiar Texto
                      </>
                    )}
                  </Button>
                </div>
              )}
              
              {!borrador && (
                <div className="text-center py-8 text-gray-500">
                  <FileText className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                  <p className="text-lg font-medium">¡Listo para generar tu artículo!</p>
                  <p className="text-sm">Completa la información del formulario y presiona "Generar Borrador"</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-50 border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center text-gray-600">
            <p>© 2024 Nexus Media - Asistente de Redacción de Artículos</p>
            <p className="text-sm mt-1">Potenciado por Inteligencia Artificial para generar contenido de calidad</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;