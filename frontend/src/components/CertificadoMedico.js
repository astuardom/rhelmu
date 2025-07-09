import React, { useRef } from 'react';
import { useReactToPrint } from 'react-to-print';

const CertificadoMedico = ({ paciente }) => {
  const componentRef = useRef();

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: `certificado-${paciente.nombre.replace(/\s/g, '_')}`
  });

  const fechaHoy = new Date().toLocaleDateString();

  return (
    <div className="p-4">
      <button
        onClick={handlePrint}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 mb-4"
      >
        Imprimir Certificado
      </button>

      <div ref={componentRef} className="p-10 bg-white text-black max-w-[800px] mx-auto border shadow-md">
        <div className="text-center mb-8">
          <img src="/logo-rhelmu.png" alt="Logo" className="h-16 mx-auto" />
          <h2 className="text-xl font-semibold">Dr. Mauricio Hurtado Cáceres</h2>
          <p className="text-blue-600 font-semibold">Ortodoncia y Ortopedia</p>
          <p className="text-blue-500">Dentomaxilofacial</p>
          <p className="text-sm mt-1">Rut: 12.917.335-1</p>
        </div>

        <h3 className="text-center text-lg font-bold underline mb-6">CERTIFICADO</h3>

        <div className="mb-6 space-y-2">
          <p><strong>NOMBRE:</strong> {paciente.nombre}</p>
          <p><strong>RUT:</strong> {paciente.rut}</p>
          <p><strong>FECHA:</strong> {fechaHoy}</p>
        </div>

        <div className="text-center opacity-10 text-6xl font-bold absolute inset-0 flex items-center justify-center pointer-events-none">
          ORTODONCIA RHELMÜ
        </div>

        <div className="text-center mt-12">
          <p className="border-t border-black inline-block px-4 pt-2 font-semibold">Dr. Mauricio Hurtado Cáceres</p>
          <p className="text-sm">12.917.335-1</p>
        </div>

        <div className="text-sm text-center mt-6">
          Dirección: Lord Cochrane 635, Torre B, piso 10, Oficina 1002, Concepción.<br />
          Teléfono: +56 944435569
        </div>
      </div>
    </div>
  );
};

export default CertificadoMedico;
