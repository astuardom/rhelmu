import React, { useState } from 'react';

const WhatsAppIntegration = ({ patient }) => {
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);

  const nombrePaciente = patient?.nombre || 'el paciente';
  const telefonoOriginal = patient?.telefono || '';

  const sendMessage = () => {
    if (!message.trim()) {
      alert("⚠️ El mensaje no puede estar vacío");
      return;
    }

    if (!telefonoOriginal) {
      alert("⚠️ No se encontró número de teléfono del paciente");
      return;
    }

    let telefonoLimpio = telefonoOriginal.replace(/[^0-9]/g, '');
    if (telefonoLimpio.startsWith('0')) {
      telefonoLimpio = '56' + telefonoLimpio.substring(1);
    }

    const url = `https://wa.me/${telefonoLimpio}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <h2 className="text-xl font-semibold mb-6">Enviar Mensaje por WhatsApp</h2>

      {/* Selector de plantilla */}
      <div className="mb-3">
        <label className="block text-sm font-medium text-gray-700 mb-1">Plantillas rápidas</label>
        <select
          onChange={(e) => setMessage(`Hola ${nombrePaciente}, ${e.target.value}`)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg"
        >
          <option value="">-- Selecciona un mensaje --</option>
          <option value="📸 se ha subido una nueva imagen clínica. Por favor, revise el sistema.">
            Imagen clínica subida
          </option>
          <option value="📅 recordatorio: usted tiene un control pendiente.">
            Recordatorio de cita
          </option>
          <option value="📝 el informe clínico está disponible para su revisión.">
            Informe clínico listo
          </option>
        </select>
      </div>

      {/* Área de texto del mensaje */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Mensaje para {nombrePaciente}
        </label>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows="4"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
          placeholder="Escribe tu mensaje aquí..."
        ></textarea>
        <button
          onClick={() => navigator.clipboard.writeText(message)}
          className="mt-1 text-sm text-blue-600 hover:underline"
        >
          Copiar mensaje
        </button>
      </div>

      {/* Botón de envío */}
      <button
        onClick={sendMessage}
        disabled={isSending}
        className={`flex items-center px-4 py-2 rounded-lg ${isSending ? 'bg-gray-400' : 'bg-green-600 hover:bg-green-700'} text-white`}
      >
        {isSending ? (
          <>
            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Enviando...
          </>
        ) : (
          <>
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
            Enviar por WhatsApp
          </>
        )}
      </button>
    </div>
  );
};

export default WhatsAppIntegration;
