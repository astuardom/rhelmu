import React, { useState } from 'react';

const CertificadoCompleto = ({ receta, paciente }) => {
  const [mostrarVista, setMostrarVista] = useState(false);
  const fecha = new Date(receta.fecha).toLocaleDateString('es-CL');

  const handlePrint = () => {
    const printWindow = window.open('', '', 'width=800,height=1000');
    const htmlContent = `
      <html>
  <head>
    <title>Certificado y Receta Médica</title>
    <style>
      @page {
        size: A4;
        margin: 2.5cm;
      }
      body {
        font-family: Arial, sans-serif;
        font-size: 14px;
        color: #000;
        position: relative;
      }
      .header {
        text-align: center;
        margin-bottom: 20px;
      }
      .header img {
        height: 70px;
        margin-bottom: 8px;
      }
      .header h2 {
        margin: 0;
        font-size: 20px;
        font-weight: bold;
      }
      .header p {
        margin: 2px 0;
      }
      .title {
        text-align: center;
        font-size: 16px;
        font-weight: bold;
        text-decoration: underline;
        margin-top: 20px;
        margin-bottom: 20px;
      }
      .section {
        margin-bottom: 20px;
      }
      .section p {
        margin: 4px 0;
      }
      .section strong {
        display: inline-block;
        width: 160px;
      }
      ul {
        padding-left: 20px;
      }
      .marca-agua-img {
        position: fixed;
        top: 30%;
        left: 50%;
        transform: translate(-50%, -50%);
        opacity: 0.05;
        z-index: -1;
        width: 400px;
      }
      .firma {
        text-align: center;
        margin-top: 60px;
      }
      .firma p {
        margin: 2px;
      }
      .firma .linea {
        border-top: 1px solid #000;
        width: 280px;
        margin: 0 auto;
        padding-top: 5px;
      }
      .footer {
        text-align: center;
        font-size: 12px;
        margin-top: 50px;
        line-height: 1.5;
        color: #333;
      }
    </style>
  </head>
  <body>
    <img src="${window.location.origin}/logo-rhelmu.png" class="marca-agua-img" alt="Marca de agua" />
    <div class="header">
      <img src="${window.location.origin}/logo-rhelmu.png" alt="Logo Rhelmu" />
      <h2>Dr. Mauricio Hurtado Cáceres</h2>
      <p style="color:#2563eb; font-weight:bold;">Ortodoncia y Ortopedia</p>
      <p style="color:#3b82f6;">Dentomaxilofacial</p>
      <p>Rut: 12.917.335-1</p>
    </div>
    <div class="title">CERTIFICADO Y RECETA MÉDICA</div>
    <div class="section">
      <p><strong>Nombre del Paciente:</strong> ${paciente.nombre}</p>
      <p><strong>RUT:</strong> ${paciente.rut}</p>
      <p><strong>Fecha:</strong> ${fecha}</p>
      <p><strong>Vigencia:</strong> ${receta.vigencia} días</p>
    </div>
    <div class="section">
      <p><strong>Medicamentos Recetados:</strong></p>
      <ul>
        ${receta.medicamentos?.length > 0
          ? receta.medicamentos.map((m) => `
              <li>
                <strong>${m.nombre}</strong>: ${m.dosis} unidades, cada ${m.frecuencia} horas, durante ${m.duracion}
              </li>
            `).join('')
          : '<li>No hay medicamentos registrados.</li>'}
      </ul>
    </div>
    ${receta.indicaciones ? `
      <div class="section">
        <strong>Indicaciones adicionales:</strong>
        <p>${receta.indicaciones}</p>
      </div>
    ` : ''}
    <div class="firma">
      <div class="linea">Dr. Mauricio Hurtado Cáceres</div>
      <p>12.917.335-1</p>
    </div>
    <div class="footer">
      Dirección: Lord Cochrane 635, Torre B, piso 10, Oficina 1002, Concepción.<br />
      Teléfono: +56 944435569
    </div>
  </body>
</html>
    `;
    printWindow.document.open();
    printWindow.document.write(htmlContent);
    printWindow.document.close();
    printWindow.focus();
    printWindow.onload = () => {
      printWindow.print();
      printWindow.onafterprint = () => printWindow.close();
    };
  };

  return (
    <div className="p-4 bg-white rounded shadow">
      <div className="flex justify-between items-center mb-4">
        <p className="text-sm text-gray-700">Receta creada el <strong>{fecha}</strong></p>
        <div className="space-x-2">
          <button
            onClick={() => setMostrarVista(!mostrarVista)}
            className="bg-gray-500 text-white px-3 py-1 rounded hover:bg-gray-600 text-sm"
          >
            {mostrarVista ? 'Ocultar Vista' : 'Ver Receta'}
          </button>
          <button
            onClick={handlePrint}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Imprimir Certificado + Receta
          </button>
        </div>
      </div>

      {mostrarVista && (
        <div className="bg-white p-8 border max-w-[800px] mx-auto text-black">
          <div className="text-center mb-6">
            <img src="/logo-rhelmu.png" alt="Logo" className="h-16 mx-auto" />
            <h2 className="text-xl font-semibold">Dr. Mauricio Hurtado Cáceres</h2>
            <p className="text-blue-600 font-semibold">Ortodoncia y Ortopedia</p>
            <p className="text-blue-500">Dentomaxilofacial</p>
            <p className="text-sm mt-1">Rut: 12.917.335-1</p>
          </div>
          <h3 className="text-center text-lg font-bold underline mb-6">CERTIFICADO Y RECETA MÉDICA</h3>
          <div className="mb-4 text-sm grid grid-cols-2 gap-x-4">
            <p><strong>Nombre del Paciente:</strong> {paciente?.nombre}</p>
            <p><strong>RUT:</strong> {paciente?.rut}</p>
            <p><strong>Fecha:</strong> {fecha}</p>
            <p><strong>Vigencia:</strong> {receta.vigencia} días</p>
          </div>
          <h4 className="font-semibold mb-2">Medicamentos Recetados:</h4>
          <ul className="list-disc ml-6 text-sm mb-4">
            {receta.medicamentos?.length > 0 ? (
              receta.medicamentos.map((med, idx) => (
                <li key={idx}>
                  <strong>{med.nombre}</strong>: {med.dosis} unidades, cada {med.frecuencia} horas, durante {med.duracion}
                </li>
              ))
            ) : (
              <li className="text-gray-500">No hay medicamentos registrados.</li>
            )}
          </ul>
          {receta.indicaciones && (
            <div className="mb-4 text-sm">
              <h4 className="font-semibold">Indicaciones adicionales:</h4>
              <p>{receta.indicaciones}</p>
            </div>
          )}
          <div className="text-center mt-12">
            <p className="border-t border-black inline-block px-4 pt-2 font-semibold">Dr. Mauricio Hurtado Cáceres</p>
            <p className="text-sm">12.917.335-1</p>
          </div>
          <div className="text-sm text-center mt-6">
            Dirección: Lord Cochrane 635, Torre B, piso 10, Oficina 1002, Concepción.<br />
            Teléfono: +56 944435569
          </div>
        </div>
      )}
    </div>
  );
};

export default CertificadoCompleto;
