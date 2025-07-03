import React, { useState, useEffect } from 'react';
import { X, Upload, Plus, Trash2, AlertCircle } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { createProduct, updateProduct, selectProductsLoading, selectProductsError } from '../../store/slices/productSlice';
import "../../assets/styles/Admin/ProductModal.css"

const ProductModal = ({ 
  isOpen, 
  onClose, 
  product = null, 
  categories = [] 
}) => {
  const dispatch = useAppDispatch();
  const isLoading = useAppSelector(selectProductsLoading);
  const apiError = useAppSelector(selectProductsError);

  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    precio: '',
    imagen: null,
    categoria: '',
    caracteristicas: [''],
    cantidad: ''
  });

  const [errors, setErrors] = useState({});
  const [imagePreview, setImagePreview] = useState(null);

  // Inicializar formulario cuando se abre el modal
  useEffect(() => {
    if (isOpen) {
      if (product) {
        // Modo edición - extraer el ID de la categoría correctamente
        const categoriaId = typeof product.categoria === 'object' && product.categoria._id 
          ? product.categoria._id 
          : product.categoria || '';

        setFormData({
          nombre: product.nombre || '',
          descripcion: product.descripcion || '',
          precio: product.precio?.toString() || '',
          imagen: null,
          categoria: categoriaId,
          caracteristicas: product.caracteristicas?.length > 0 ? product.caracteristicas : [''],
          cantidad: product.cantidad?.toString() || ''
        });
        setImagePreview(product.imagen || null);
      } else {
        // Modo crear
        setFormData({
          nombre: '',
          descripcion: '',
          precio: '',
          imagen: null,
          categoria: '',
          caracteristicas: [''],
          cantidad: ''
        });
        setImagePreview(null);
      }
      setErrors({});
    }
  }, [isOpen, product]);

  // Mostrar errores de la API
  useEffect(() => {
    if (apiError) {
      setErrors(prev => ({
        ...prev,
        submit: apiError
      }));
    }
  }, [apiError]);

  // Validaciones
  const validateForm = () => {
    const newErrors = {};

    // Nombre
    if (!formData.nombre.trim()) {
      newErrors.nombre = 'El nombre es requerido';
    } else if (formData.nombre.trim().length < 3) {
      newErrors.nombre = 'El nombre debe tener al menos 3 caracteres';
    }

    // Descripción
    if (!formData.descripcion.trim()) {
      newErrors.descripcion = 'La descripción es requerida';
    } else if (formData.descripcion.trim().length < 10) {
      newErrors.descripcion = 'La descripción debe tener al menos 10 caracteres';
    }

    // Precio
    if (!formData.precio) {
      newErrors.precio = 'El precio es requerido';
    } else {
      const precio = parseFloat(formData.precio);
      if (isNaN(precio) || precio <= 0) {
        newErrors.precio = 'El precio debe ser un número mayor a 0';
      }
    }

    // Categoría
    if (!formData.categoria) {
      newErrors.categoria = 'La categoría es requerida';
    }

    // Cantidad
    if (!formData.cantidad) {
      newErrors.cantidad = 'La cantidad es requerida';
    } else {
      const cantidad = parseInt(formData.cantidad);
      if (isNaN(cantidad) || cantidad < 0) {
        newErrors.cantidad = 'La cantidad debe ser un número mayor o igual a 0';
      }
    }

    // Características (al menos una no vacía)
    const caracteristicasValidas = formData.caracteristicas.filter(c => c.trim());
    if (caracteristicasValidas.length === 0) {
      newErrors.caracteristicas = 'Debe agregar al menos una característica';
    }

    // Imagen (solo requerida en modo crear)
    if (!product && !formData.imagen) {
      newErrors.imagen = 'La imagen es requerida';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Manejar cambios en inputs
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Limpiar error del campo al empezar a escribir
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  // Manejar subida de imagen
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validar tipo de archivo
      if (!file.type.startsWith('image/')) {
        setErrors(prev => ({
          ...prev,
          imagen: 'Debe seleccionar un archivo de imagen válido'
        }));
        return;
      }

      // Validar tamaño (máximo 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setErrors(prev => ({
          ...prev,
          imagen: 'La imagen no debe superar los 5MB'
        }));
        return;
      }

      setFormData(prev => ({
        ...prev,
        imagen: file
      }));

      // Crear preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);

      // Limpiar error
      if (errors.imagen) {
        setErrors(prev => ({
          ...prev,
          imagen: ''
        }));
      }
    }
  };

  // Manejar características
  const handleCaracteristicaChange = (index, value) => {
    const newCaracteristicas = [...formData.caracteristicas];
    newCaracteristicas[index] = value;
    setFormData(prev => ({
      ...prev,
      caracteristicas: newCaracteristicas
    }));

    // Limpiar error
    if (errors.caracteristicas) {
      setErrors(prev => ({
        ...prev,
        caracteristicas: ''
      }));
    }
  };

  const addCaracteristica = () => {
    setFormData(prev => ({
      ...prev,
      caracteristicas: [...prev.caracteristicas, '']
    }));
  };

  const removeCaracteristica = (index) => {
    if (formData.caracteristicas.length > 1) {
      const newCaracteristicas = formData.caracteristicas.filter((_, i) => i !== index);
      setFormData(prev => ({
        ...prev,
        caracteristicas: newCaracteristicas
      }));
    }
  };

  // Enviar formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      // Preparar datos para envío - SOLO enviar el ID de la categoría
      const dataToSubmit = {
        ...formData,
        categoria: formData.categoria, // Solo el ID de la categoría
        precio: parseFloat(formData.precio),
        cantidad: parseInt(formData.cantidad),
        caracteristicas: formData.caracteristicas.filter(c => c.trim())
      };

      if (product) {
        // Actualizar producto existente
        await dispatch(updateProduct({ 
          id: product._id, 
          productData: dataToSubmit 
        })).unwrap();
      } else {
        // Crear nuevo producto
        await dispatch(createProduct(dataToSubmit)).unwrap();
      }

      // Cerrar modal si la operación fue exitosa
      onClose();
    } catch (error) {
      // El error ya se maneja en el useEffect de apiError
      console.error('Error al guardar producto:', error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">
            {product ? 'Editar Producto' : 'Agregar Nuevo Producto'}
          </h2>
          <button className="close-btn" onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        <div className="modal-body">
          <form onSubmit={handleSubmit}>
            {errors.submit && (
              <div className="submit-error">
                <AlertCircle size={20} />
                {errors.submit}
              </div>
            )}

            {/* Nombre */}
            <div className="form-group">
              <label className="form-label">Nombre del Producto *</label>
              <input
                type="text"
                name="nombre"
                value={formData.nombre}
                onChange={handleInputChange}
                className={`form-input ${errors.nombre ? 'error' : ''}`}
                placeholder="Ingresa el nombre del producto"
                disabled={isLoading}
              />
              {errors.nombre && (
                <div className="error-message">
                  <AlertCircle size={16} />
                  {errors.nombre}
                </div>
              )}
            </div>

            {/* Descripción */}
            <div className="form-group">
              <label className="form-label">Descripción *</label>
              <textarea
                name="descripcion"
                value={formData.descripcion}
                onChange={handleInputChange}
                className={`form-textarea ${errors.descripcion ? 'error' : ''}`}
                placeholder="Describe las características principales del producto"
                disabled={isLoading}
              />
              {errors.descripcion && (
                <div className="error-message">
                  <AlertCircle size={16} />
                  {errors.descripcion}
                </div>
              )}
            </div>

            {/* Precio y Cantidad */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div className="form-group">
                <label className="form-label">Precio *</label>
                <input
                  type="number"
                  name="precio"
                  value={formData.precio}
                  onChange={handleInputChange}
                  className={`form-input ${errors.precio ? 'error' : ''}`}
                  placeholder="0.00"
                  step="0.01"
                  min="0"
                  disabled={isLoading}
                />
                {errors.precio && (
                  <div className="error-message">
                    <AlertCircle size={16} />
                    {errors.precio}
                  </div>
                )}
              </div>

              <div className="form-group">
                <label className="form-label">Cantidad *</label>
                <input
                  type="number"
                  name="cantidad"
                  value={formData.cantidad}
                  onChange={handleInputChange}
                  className={`form-input ${errors.cantidad ? 'error' : ''}`}
                  placeholder="0"
                  min="0"
                  disabled={isLoading}
                />
                {errors.cantidad && (
                  <div className="error-message">
                    <AlertCircle size={16} />
                    {errors.cantidad}
                  </div>
                )}
              </div>
            </div>

            {/* Categoría - Ahora usando las categorías del backend */}
            <div className="form-group">
              <label className="form-label">Categoría *</label>
              <select
                name="categoria"
                value={formData.categoria}
                onChange={handleInputChange}
                className={`form-select ${errors.categoria ? 'error' : ''}`}
                disabled={isLoading}
              >
                <option value="">Selecciona una categoría</option>
                {categories.map(categoria => (
                  <option key={categoria._id} value={categoria._id}>
                    {categoria.nombre}
                  </option>
                ))}
              </select>
              {errors.categoria && (
                <div className="error-message">
                  <AlertCircle size={16} />
                  {errors.categoria}
                </div>
              )}
              {categories.length === 0 && (
                <div className="info-message">
                  <AlertCircle size={16} />
                  No hay categorías disponibles. Crea una categoría primero.
                </div>
              )}
            </div>

            {/* Imagen */}
            <div className="form-group">
              <label className="form-label">
                Imagen {!product && '*'}
              </label>
              <div className={`image-upload-container ${imagePreview ? 'has-image' : ''}`}>
                {imagePreview ? (
                  <div style={{ position: 'relative' }}>
                    <img src={imagePreview} alt="Preview" className="image-preview" />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      disabled={isLoading}
                      style={{ 
                        position: 'absolute', 
                        top: 0, 
                        left: 0, 
                        width: '100%', 
                        height: '100%', 
                        opacity: 0, 
                        cursor: 'pointer' 
                      }}
                    />
                  </div>
                ) : (
                  <label style={{ cursor: 'pointer', display: 'block' }}>
                    <Upload size={32} color="#64748b" />
                    <div className="upload-text">
                      <strong>Click para subir</strong> o arrastra una imagen aquí
                      <br />
                      <small>PNG, JPG hasta 5MB</small>
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      disabled={isLoading}
                      style={{ display: 'none' }}
                    />
                  </label>
                )}
              </div>
              {errors.imagen && (
                <div className="error-message">
                  <AlertCircle size={16} />
                  {errors.imagen}
                </div>
              )}
            </div>

            {/* Características */}
            <div className="form-group">
              <label className="form-label">Características *</label>
              <div className="caracteristicas-container">
                {formData.caracteristicas.map((caracteristica, index) => (
                  <div key={index} className="caracteristica-row">
                    <input
                      type="text"
                      value={caracteristica}
                      onChange={(e) => handleCaracteristicaChange(index, e.target.value)}
                      className="form-input caracteristica-input"
                      placeholder={`Característica ${index + 1}`}
                      disabled={isLoading}
                    />
                    {formData.caracteristicas.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeCaracteristica(index)}
                        className="remove-caracteristica-btn"
                        disabled={isLoading}
                        title="Eliminar característica"
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>
                ))}
                
                <button
                  type="button"
                  onClick={addCaracteristica}
                  className="add-caracteristica-btn"
                  disabled={isLoading}
                >
                  <Plus size={16} />
                  Agregar característica
                </button>
              </div>
              {errors.caracteristicas && (
                <div className="error-message">
                  <AlertCircle size={16} />
                  {errors.caracteristicas}
                </div>
              )}
            </div>

            {/* Botones de acción */}
            <div className="modal-actions">
              <button
                type="button"
                onClick={onClose}
                className="cancel-btn"
                disabled={isLoading}
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="submit-btn"
                disabled={isLoading || categories.length === 0}
              >
                {isLoading ? (
                  <>
                    <div className="loading-spinner"></div>
                    {product ? 'Actualizando...' : 'Guardando...'}
                  </>
                ) : (
                  product ? 'Actualizar Producto' : 'Crear Producto'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProductModal;