import React, { useState, useRef, useEffect } from 'react';
import PatientInfoCard from './PatientInfoCard';
import TreatmentItemForm from './TreatmentItemForm';
import TreatmentTable from './TreatmentTable';
import BudgetSummary from './BudgetSummary';

const API_URL = process.env.REACT_APP_API_URL;

const validarRut = (rut) => {
  if (!rut || rut.length < 8) return false;
  rut = rut.replace(/\./g, '').replace('-', '');
  const cuerpo = rut.slice(0, -1);
  const dv = rut.slice(-1).toUpperCase();

  let suma = 0;
  let multiplo = 2;
  for (let i = cuerpo.length - 1; i >= 0; i--) {
    suma += parseInt(cuerpo.charAt(i)) * multiplo;
    multiplo = multiplo < 7 ? multiplo + 1 : 2;
  }

  const dvEsperado = 11 - (suma % 11);
  const dvFinal = dvEsperado === 11 ? '0' : dvEsperado === 10 ? 'K' : dvEsperado.toString();

  return dv === dvFinal;
};

const BudgetEditor = ({ initialPatient = {}, budgetToEdit, onSaveBudget, onAddBudget, onUpdateBudget }) => {
  const guardarPresupuesto = onSaveBudget || onAddBudget;

  const [localPatient, setLocalPatient] = useState({
    nombre: initialPatient.nombre || '',
    rut: initialPatient.rut || '',
    email: initialPatient.email || '',
    telefono: initialPatient.telefono || '',
  });

  const [budget, setBudget] = useState(budgetToEdit || {
    fecha: new Date().toISOString().split('T')[0],
    items: [],
    descuento: 0,
    notas: '',
    estado: 'pendiente',
    confirmado: false
  });  

  useEffect(() => {
    if (budgetToEdit) {
      setBudget({
        _id: budgetToEdit._id,
        fecha: budgetToEdit.fecha || new Date().toISOString().split('T')[0],
        items: (budgetToEdit.items || []).map(item => ({
          ...item,
          subtotal: item.subtotal ?? item.cantidad * item.precio
        })),
        descuento: budgetToEdit.descuento || 0,
        notas: budgetToEdit.notas || '',
        estado: budgetToEdit.estado || 'pendiente',
        confirmado: budgetToEdit.confirmado || false
      });
  
      if (budgetToEdit.paciente) {
        setLocalPatient({
          nombre: budgetToEdit.paciente.nombre || '',
          rut: budgetToEdit.paciente.rut || '',
          email: budgetToEdit.paciente.email || '',
          telefono: budgetToEdit.paciente.telefono || ''
        });
      }
  
      setGuardado(true); // Marca como guardado si es edición
    }
  }, [budgetToEdit]);
  

  const [newItem, setNewItem] = useState({
    tratamiento: '',
    cantidad: 1,
    precio: 0,
    diente: ''
  });

  const [guardado, setGuardado] = useState(false);
  const budgetRef = useRef();
  const rutValido = validarRut(localPatient.rut);

  const handleBudgetChange = (e) => {
    const { name, value } = e.target;
    setBudget(prev => ({ ...prev, [name]: value }));
  };

  const handlePatientChange = (e) => {
    const { name, value } = e.target;
    setLocalPatient(prev => ({ ...prev, [name]: value }));
  };

  const handleItemChange = (e) => {
    const { name, value } = e.target;
    setNewItem(prev => ({
      ...prev,
      [name]: name === 'cantidad' || name === 'precio' ? Number(value) : value
    }));
  };

  const addItem = () => {
    if (!newItem.tratamiento) {
      alert("Debe especificar un tratamiento");
      return;
    }
    if (newItem.precio <= 0) {
      alert("El precio debe ser mayor a cero");
      return;
    }

    const itemWithSubtotal = {
      ...newItem,
      subtotal: newItem.cantidad * newItem.precio
    };

    setBudget(prev => ({
      ...prev,
      items: [...prev.items, itemWithSubtotal]
    }));

    setNewItem({
      tratamiento: '',
      cantidad: 1,
      precio: 0,
      diente: ''
    });
  };

  const removeItem = (index) => {
    setBudget(prev => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index)
    }));
  };

  const calculateTotal = () => {
    const subtotal = budget.items.reduce((sum, item) => sum + item.subtotal, 0);
    const descuento = subtotal * (budget.descuento / 100);
    return {
      subtotal,
      descuento,
      total: subtotal - descuento
    };
  };

  const handleGuardar = () => {
    if (!validarRut(localPatient.rut)) {
      alert("⚠️ El RUT ingresado no es válido.");
      return;
    }
    const fullBudget = {
      ...budget,
      paciente: localPatient
    };
  
    if (budgetToEdit && onUpdateBudget) {
      onUpdateBudget(fullBudget);
      setGuardado(true);
      return;
    }
  
    if (guardarPresupuesto) {
      guardarPresupuesto(fullBudget);
      setGuardado(true);
    }
  };
  

  const handleConfirmar = async () => {
    if (!validarRut(localPatient.rut)) {
      alert("⚠️ El RUT ingresado no es válido.");
      return;
    }
    
    if (!guardado) {
      alert("Debe guardar el presupuesto antes de confirmar");
      return;
    }

    try {
      const res = await fetch(`${API_URL}/api/pacientes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nombre: localPatient.nombre,
          rut: localPatient.rut,
          telefono: localPatient.telefono,
          email: localPatient.email,
          odontograma: budget.items.map(i => i.diente).filter(Boolean)
        })
      });

      if (res.ok) {
        setBudget(prev => ({ ...prev, confirmado: true }));
        alert("Presupuesto confirmado y paciente registrado.");
      } else {
        alert("Error al registrar paciente.");
      }
    } catch (error) {
      console.error("Error confirmando presupuesto:", error);
      alert("Ocurrió un error al confirmar el presupuesto");
    }
  };
//////////////////////////////////////////////////////////////////////////////

  const handlePrint = () => {
    if (!localPatient.nombre || budget.items.length === 0) {
      alert("Complete los datos del paciente y agregue tratamientos antes de imprimir");
      return;
    }

    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      alert("No se pudo abrir la ventana de impresión. Por favor, desbloquee los popups.");
      return;
    }

    const opcionesFecha = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const fechaFormateada = new Date(budget.fecha).toLocaleDateString('es-ES', opcionesFecha);

    printWindow.document.write(`
      <html>
        <head>
          <title>Presupuesto Dental - ${localPatient.nombre}</title>
          <style>
            body {
              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
              margin: 40px;
              color: #222;
            }
            .header {
              text-align: center;
              margin-bottom: 30px;
              border-bottom: 2px solid #1e40af;
              padding-bottom: 15px;
            }
            .logo {
              height: 60px;
              margin-bottom: 10px;
            }
            h1 {
              font-size: 22px;
              margin: 0;
            }
            .subtitle {
              font-weight: bold;
              color: #1e40af;
              font-size: 14px;
            }
            .subsubtitle {
              color: #2563eb;
              font-size: 13px;
              margin-bottom: 5px;
            }
            .patient-info, .footer {
              margin-top: 30px;
              font-size: 14px;
            }
            .section-title {
              font-weight: bold;
              font-size: 16px;
              margin-top: 30px;
              text-decoration: underline;
              color: #111827;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              margin-top: 15px;
              font-size: 13.5px;
            }
            th, td {
              border: 1px solid #ddd;
              padding: 8px;
              text-align: left;
            }
            th {
              background-color: #f0f4f8;
            }
            .totals {
              margin-top: 25px;
              text-align: right;
              font-size: 15px;
              line-height: 1.6;
            }
            .notes {
              margin-top: 20px;
              font-size: 14px;
              background-color: #f9fafb;
              padding: 10px;
              border-left: 4px solid #2563eb;
            }
            .signature {
              margin-top: 50px;
              text-align: right;
              font-size: 14px;
            }
            .footer {
              font-size: 12px;
              color: #666;
              text-align: center;
              margin-top: 60px;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <img src="/logo-rhelmu.png" alt="Logo Rhelmu" class="logo" />
            <h1>Dr. Mauricio Hurtado Cáceres</h1>
            <div class="subtitle">Ortodoncia y Ortopedia</div>
            <div class="subsubtitle">Dentomaxilofacial</div>
            <div>RUT: 12.917.335-1</div>
          </div>
    
          <h2 class="section-title">PRESUPUESTO DENTAL</h2>
          <div class="patient-info">
            <p><strong>Nombre del Paciente:</strong> ${localPatient.nombre}</p>
            <p><strong>RUT:</strong> ${localPatient.rut || 'No especificado'}</p>
            <p><strong>Correo:</strong> ${localPatient.email || 'No especificado'}</p>
            <p><strong>Teléfono:</strong> ${localPatient.telefono || 'No especificado'}</p>
            <p><strong>Fecha:</strong> ${fechaFormateada}</p>
          </div>
    
          <table>
            <thead>
              <tr>
                <th>Tratamiento</th>
                <th>Diente</th>
                <th>Cantidad</th>
                <th>Precio Unitario</th>
                <th>Subtotal</th>
              </tr>
            </thead>
            <tbody>
              ${budget.items.map(item => `
                <tr>
                  <td>${item.tratamiento}</td>
                  <td>${item.diente || '-'}</td>
                  <td>${item.cantidad}</td>
                  <td>$${item.precio.toLocaleString('es-CL')}</td>
                  <td>$${item.subtotal.toLocaleString('es-CL')}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
    
          <div class="totals">
            <p><strong>Subtotal:</strong> $${subtotal.toLocaleString('es-CL')}</p>
            ${budget.descuento > 0 ? `
              <p><strong>Descuento (${budget.descuento}%):</strong> -$${descuento.toLocaleString('es-CL')}</p>
            ` : ''}
            <p><strong>Total:</strong> $${total.toLocaleString('es-CL')}</p>
          </div>
    
          ${budget.notas ? `
            <div class="notes">
              <strong>Notas:</strong><br/>
              ${budget.notas}
            </div>
          ` : ''}
    
          <div class="signature">
            ___________________________<br/>
            Dr. Mauricio Hurtado Cáceres<br/>
            RUT: 12.917.335-1
          </div>
    
          <div class="footer">
            Dirección: Lord Cochrane 635, Torre B, piso 10, Oficina 1002, Concepción.<br/>
            Teléfono: +56 944435569
          </div>
    
          <script>
            window.onload = function() {
              setTimeout(() => {
                window.print();
                window.close();
              }, 200);
            };
          </script>
        </body>
      </html>
    `);
    
      
    printWindow.document.close();
  };

  const { subtotal, descuento, total } = calculateTotal();

  return (
    <div className="bg-white rounded-xl shadow-sm p-6" ref={budgetRef}>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Presupuesto Dental</h2>
        <div className="flex space-x-3">
          <button onClick={handlePrint} className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg">🖨️ Imprimir</button>
          <button onClick={handleGuardar} className={`px-4 py-2 ${guardado ? 'bg-green-600' : 'bg-blue-600'} text-white rounded-lg`}>
            {guardado ? '✓ Guardado' : 'Guardar Presupuesto'}
          </button>
          <button onClick={handleConfirmar} disabled={!guardado} className={`px-4 py-2 ${!guardado ? 'bg-gray-400' : 'bg-green-600'} text-white rounded-lg`}>
            Confirmar Presupuesto
          </button>
        </div>
      </div>
      {/* VALIDACIÓN VISUAL DEL RUT */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">RUT</label>
        <input
          type="text"
          name="rut"
          value={localPatient.rut}
          onChange={handlePatientChange}
          className={`w-full px-3 py-2 border rounded-lg ${rutValido ? 'border-gray-300' : 'border-red-500'}`}
          placeholder="Ej: 12345678-9"
        />
        {!rutValido && (
          <p className="text-red-500 text-sm mt-1">⚠️ El RUT ingresado no es válido.</p>
        )}
      </div>
      
      <PatientInfoCard patient={localPatient} onChange={handlePatientChange} />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Fecha</label>
          <input type="date" name="fecha" value={budget.fecha} onChange={handleBudgetChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
        </div>
      
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Descuento (%)</label>
          <input type="number" name="descuento" value={budget.descuento} onChange={handleBudgetChange} min="0" max="100" className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
        </div>
      </div>

      <TreatmentItemForm newItem={newItem} onChange={handleItemChange} onAdd={addItem} />

      {budget.items.length > 0 && (
        <TreatmentTable items={budget.items} onRemove={removeItem} />
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <label className="block text-sm font-medium mb-1">Notas</label>
          <textarea name="notas" value={budget.notas} onChange={handleBudgetChange} rows="4" className="w-full px-3 py-2 border rounded-lg" placeholder="Notas adicionales sobre el presupuesto..." />
        </div>
        <BudgetSummary subtotal={subtotal} descuento={descuento} total={total} />
      </div>
    </div>
  );
};

export default BudgetEditor;
