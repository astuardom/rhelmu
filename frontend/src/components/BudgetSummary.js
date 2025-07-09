import React from 'react';

const BudgetSummary = ({ subtotal, descuento, total }) => {
  return (
    <div className="bg-gray-50 p-4 rounded-lg">
      <h4 className="text-lg font-medium mb-3">Resumen</h4>
      <div className="space-y-2">
        <div className="flex justify-between">
          <span>Subtotal:</span>
          <span>${subtotal.toLocaleString('es-CL')}</span>
        </div>
        {descuento > 0 && (
          <div className="flex justify-between">
            <span>Descuento:</span>
            <span>-${descuento.toLocaleString('es-CL')}</span>
          </div>
        )}
        <div className="flex justify-between font-semibold pt-2 border-t">
          <span>Total:</span>
          <span>${total.toLocaleString('es-CL')}</span>
        </div>
      </div>
    </div>
  );
};

export default BudgetSummary;
