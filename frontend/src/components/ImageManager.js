import React, { useState, useEffect } from 'react';

const ImageManager = ({ patientId }) => {
  const [images, setImages] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [editingImage, setEditingImage] = useState(null);
  const [editData, setEditData] = useState({ tipo: '', notas: '' });
  const [deletingImageId, setDeletingImageId] = useState(null);
  const [filterTipo, setFilterTipo] = useState('');
  const [searchNotas, setSearchNotas] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    if (!patientId) return;
    fetch(`const API_URL = process.env.REACT_APP_API_URL;/api/imagenes/paciente/${patientId}`)
      .then(res => res.json())
      .then(data => setImages(data))
      .catch(() => alert("Error al cargar imágenes clínicas"));
  }, [patientId]);

  const handleImageUpload = async (e) => {
    const files = e.target.files;
    if (!files.length || !patientId) return;

    setUploading(true);

    for (const file of files) {
      const formData = new FormData();
      formData.append('imagen', file);
      formData.append('patientId', patientId);
      formData.append('tipo', 'radiografía');
      formData.append('notas', '');

      try {
        const res = await fetch('const API_URL = process.env.REACT_APP_API_URL;/api/imagenes', {
          method: 'POST',
          body: formData
        });
        const data = await res.json();
        setImages(prev => [...prev, data]);
      } catch (error) {
        alert('❌ Error al subir una imagen');
      }
    }

    setUploading(false);
  };

  const confirmDelete = (id) => {
    setDeletingImageId(id);
  };

  const cancelDelete = () => {
    setDeletingImageId(null);
  };

  const handleDelete = async () => {
    try {
      await fetch(`const API_URL = process.env.REACT_APP_API_URL;/api/imagenes/${deletingImageId}`, { method: 'DELETE' });
      setImages(prev => prev.filter(img => img._id !== deletingImageId));
      setDeletingImageId(null);
    } catch (err) {
      alert('❌ Error al eliminar la imagen');
    }
  };

  const openEditModal = (image) => {
    setEditingImage(image);
    setEditData({ tipo: image.tipo, notas: image.notas });
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditData(prev => ({ ...prev, [name]: value }));
  };

  const handleUpdate = async () => {
    try {
      const res = await fetch(`const API_URL = process.env.REACT_APP_API_URL;/api/imagenes/${editingImage._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editData)
      });
      const updated = await res.json();
      setImages(prev => prev.map(img => img._id === updated._id ? updated : img));
      setEditingImage(null);
    } catch (err) {
      alert('❌ Error al actualizar la imagen');
    }
  };

  const filteredImages = images.filter(img => {
    const coincideTipo = filterTipo ? img.tipo === filterTipo : true;
    const coincideNotas = searchNotas ? img.notas.toLowerCase().includes(searchNotas.toLowerCase()) : true;
    return coincideTipo && coincideNotas;
  });

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Imágenes Clínicas</h2>
        <label className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer">
          {uploading ? 'Subiendo...' : 'Subir Imágenes'}
          <input 
            type="file" 
            accept="image/*" 
            onChange={handleImageUpload}
            className="hidden"
            multiple
            disabled={uploading}
          />
        </label>
      </div>

      {/* Filtros */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-2">
        <div className="flex items-center gap-2">
          <label className="text-sm">Tipo:</label>
          <select
            value={filterTipo}
            onChange={(e) => setFilterTipo(e.target.value)}
            className="border rounded px-2 py-1"
          >
            <option value="">Todos</option>
            <option value="radiografía">Radiografía</option>
            <option value="intraoral">Intraoral</option>
            <option value="extraoral">Extraoral</option>
          </select>
        </div>
        <div>
          <input
            type="text"
            placeholder="Buscar..."
            value={searchNotas}
            onChange={(e) => setSearchNotas(e.target.value)}
            className="border rounded px-3 py-1 w-full md:w-64"
          />
        </div>
      </div>

      {filteredImages.length === 0 ? (
        <p className="text-gray-500 text-center py-8">No hay imágenes registradas</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredImages.map(img => (
            <div key={img._id} className="border rounded-lg overflow-hidden shadow-sm">
              <img 
                src={`const API_URL = process.env.REACT_APP_API_URL;${img.url}`} 
                alt={`Imagen clínica ${img.tipo}`}
                className="w-full h-48 object-cover cursor-pointer"
                onClick={() => setSelectedImage(img)}
              />
              <div className="p-3 space-y-1">
                <p className="font-medium capitalize">{img.tipo}</p>
                <p className="text-sm text-gray-500">{new Date(img.fecha).toLocaleDateString()}</p>
                <div className="flex justify-between mt-2">
                  <button
                    onClick={() => openEditModal(img)}
                    className="text-blue-600 hover:underline text-sm"
                  >Editar</button>
                  <button
                    onClick={() => confirmDelete(img._id)}
                    className="text-red-600 hover:underline text-sm"
                  >Eliminar</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal de imagen ampliada */}
      {selectedImage && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-4 max-w-3xl w-full relative">
            <button onClick={() => setSelectedImage(null)} className="absolute top-2 right-2 text-white bg-red-600 px-3 py-1 rounded">X</button>
            <img src={`const API_URL = process.env.REACT_APP_API_URL;${selectedImage.url}`} alt="Vista ampliada" className="w-full object-contain rounded" />
            <div className="mt-4">
              <p className="text-lg font-semibold">{selectedImage.tipo}</p>
              <p className="text-sm text-gray-600">{new Date(selectedImage.fecha).toLocaleDateString()}</p>
              {selectedImage.notas && <p className="text-sm text-gray-800 mt-2">Notas: {selectedImage.notas}</p>}
            </div>
          </div>
        </div>
      )}

      {/* Modal de edición */}
      {editingImage && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow w-full max-w-md">
            <h4 className="font-semibold mb-2">Editar Imagen Clínica</h4>
            <label className="block text-sm mb-1">Tipo</label>
            <input
              name="tipo"
              value={editData.tipo}
              onChange={handleEditChange}
              className="w-full border mb-3 rounded px-2 py-1"
            />
            <label className="block text-sm mb-1">Notas</label>
            <textarea
              name="notas"
              value={editData.notas}
              onChange={handleEditChange}
              className="w-full border rounded px-2 py-1 h-24"
            />
            <div className="mt-4 flex justify-between">
              <button onClick={() => setEditingImage(null)} className="bg-gray-600 text-white px-4 py-1 rounded">Cancelar</button>
              <button onClick={handleUpdate} className="bg-green-600 text-white px-4 py-1 rounded">Guardar</button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de confirmación de eliminación */}
      {deletingImageId && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow w-full max-w-sm">
            <h4 className="text-lg font-semibold mb-4">¿Eliminar esta imagen?</h4>
            <p className="text-sm text-gray-600">Esta acción no se puede deshacer.</p>
            <div className="mt-6 flex justify-end space-x-3">
              <button onClick={cancelDelete} className="px-4 py-1 bg-gray-500 text-white rounded">Cancelar</button>
              <button onClick={handleDelete} className="px-4 py-1 bg-red-600 text-white rounded">Eliminar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageManager;
