import React, { useState, useEffect } from 'react';
import { Key, AlertCircle, CheckCircle, ExternalLink } from 'lucide-react';
import { Button } from './Button';
import { Input } from './Input';

interface ApiKeySetupProps {
  onApiKeySet: () => void;
}

export const ApiKeySetup: React.FC<ApiKeySetupProps> = ({ onApiKeySet }) => {
  const [apiKey, setApiKey] = useState('');
  const [isValidating, setIsValidating] = useState(false);
  const [hasApiKey, setHasApiKey] = useState(false);

  useEffect(() => {
    // Verificar si ya existe una API key
    const existingKey = import.meta.env.VITE_OPENAI_API_KEY;
    if (existingKey && existingKey.trim() !== '' && existingKey !== 'tu_api_key_aqui') {
      setHasApiKey(true);
    }
  }, []);

  const handleSaveApiKey = async () => {
    if (!apiKey.trim()) {
      alert('Por favor, ingresa tu API key de OpenAI');
      return;
    }

    if (!apiKey.startsWith('sk-')) {
      alert('La API key debe comenzar con "sk-"');
      return;
    }

    setIsValidating(true);
    
    try {
      // Simular validación (en un entorno real, harías una llamada de prueba)
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // En un entorno real, aquí guardarías la API key de forma segura
      alert('API key configurada correctamente. Nota: En un entorno de producción, esto se manejaría de forma más segura.');
      onApiKeySet();
    } catch (error) {
      alert('Error al validar la API key. Verifica que sea correcta.');
    } finally {
      setIsValidating(false);
    }
  };

  if (hasApiKey) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
        <div className="flex items-center gap-2 text-green-800">
          <CheckCircle className="w-5 h-5" />
          <span className="font-medium">API key de OpenAI configurada</span>
        </div>
        <p className="text-green-700 text-sm mt-1">
          El generador está listo para usar la API de OpenAI
        </p>
      </div>
    );
  }

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
      <div className="flex items-center gap-2 text-blue-800 mb-4">
        <Key className="w-5 h-5" />
        <h3 className="font-semibold">Configuración de API Key de OpenAI</h3>
      </div>
      
      <div className="space-y-4">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
          <div className="flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-yellow-600 mt-0.5 shrink-0" />
            <div className="text-yellow-800 text-sm">
              <p className="font-medium mb-1">Modo de Demostración Activo</p>
              <p>Sin API key, se usará un generador local de demostración. Para usar OpenAI:</p>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              API Key de OpenAI
            </label>
            <Input
              id="api-key-input"
              placeholder="sk-..."
              value={apiKey}
              onChange={setApiKey}
              className="font-mono text-sm"
            />
          </div>
          
          <div className="flex gap-3">
            <Button
              onClick={handleSaveApiKey}
              loading={isValidating}
              disabled={!apiKey.trim()}
              className="flex-1"
            >
              {isValidating ? 'Validando...' : 'Configurar API Key'}
            </Button>
            
            <Button
              onClick={() => window.open('https://platform.openai.com/api-keys', '_blank')}
              variant="secondary"
              className="flex items-center gap-2"
            >
              <ExternalLink className="w-4 h-4" />
              Obtener API Key
            </Button>
          </div>
        </div>

        <div className="text-xs text-gray-600 space-y-1">
          <p>• Obtén tu API key desde <strong>platform.openai.com/api-keys</strong></p>
          <p>• La API key debe comenzar con "sk-"</p>
          <p>• En producción, usa variables de entorno para mayor seguridad</p>
        </div>
      </div>
    </div>
  );
};