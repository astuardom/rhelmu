import React, { useState } from 'react';

const InventoryManager = () => {
  const [inventory, setInventory] = useState([]);
  const [newItem, setNewItem] = useState({
    nombre: '',
    categoria: 'material',
    stock: 0,
    stockMinimo: 5,
    precio: 0
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewItem(prev => ({
      ...prev,
      [name]: name === 'stock' || name === 'stockMinimo' || name === 'precio' 
        ? Number(value) 
        : value
    }));
  };

  const addItem = () => {
    if (!newItem.nombre) return;
    setInventory([...inventory, { ...newItem, id: Date.now() }]);
    setNewItem({
      nombre: '',
      categoria: 'material',
      stock: 0,
      stockMinimo: 5,
      precio: 0
    });
  };

  const updateStock = (id, newStock) => {
    setInventory(inventory.map(item => 
      item.id === id ? { ...item, stock: newStock } : item
    ));
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <h2 className="text-xl font-semibold mb-6">Gestión de Inventario</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-6">
        <div>
          <input
            type="text"
            name="nombre"
            value={newItem.nombre}
            onChange={handleInputChange}
            placeholder="Nombre"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
          />
        </div>
        <div>
          <select
            name="categoria"
            value={newItem.categoria}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
          >
            <option value="material">Material</option>
            <option value="medicamento">Medicamento</option>
            <option value="equipo">Equipo</option>
          </select>
        </div>
        <div>
          <input
            type="number"
            name="stock"
            value={newItem.stock}
            onChange={handleInputChange}
            placeholder="Stock"
            min="0"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
          />
        </div>
        <div>
          <button
            onClick={addItem}
            className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            disabled={!newItem.nombre}
          >
            Agregar
          </button>
        </div>
      </div>

      {inventory.length > 0 && (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Item</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Categoría</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mínimo</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Precio</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {inventory.map(item => (
                <tr key={item.id} className={item.stock < item.stockMinimo ? 'bg-red-50' : ''}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.nombre}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">{item.categoria}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <input
                      type="number"
                      value={item.stock}
                      onChange={(e) => updateStock(item.id, Number(e.target.value))}
                      min="0"
                      className="w-20 px-2 py-1 border border-gray-300 rounded"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.stockMinimo}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${item.precio.toLocaleString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <button className="text-red-600 hover:text-red-900">
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default InventoryManager;