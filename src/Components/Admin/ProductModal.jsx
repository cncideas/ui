import React, { useState, useEffect } from 'react';
import { X, Upload, Trash2, Plus, ChevronLeft, ChevronRight, Image as ImageIcon } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import {
  createProduct,
  updateProduct,
  addProductImages,
  removeProductImage,
  selectProductsLoading,
  selectProductsError,
} from '../../store/slices/productSlice';

const ProductModal = ({ isOpen, onClose, product = null, categories = [] }) => {
  const dispatch = useAppDispatch();
  const loading = useAppSelector(selectProductsLoading);
  const error = useAppSelector(selectProductsError);
  
  const isEditing = !!product;
  
  // Estado del formulario
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    precio: '',
    cantidad: '',
    categoria: '',
    caracteristicas: []
  });

  // Estado para las imágenes
  const [existingImages, setExistingImages] = useState([]);
  const [newImages, setNewImages] = useState([]);
  const [imagesToRemove, setImagesToRemove] = useState([]);
  const [previewImages, setPreviewImages] = useState([]);
  
  // Estado para características
  const [currentCharacteristic, setCurrentCharacteristic] = useState('');
  
  // Estado para la galería
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [showImageGallery, setShowImageGallery] = useState(false);

  // Inicializar datos del formulario
  useEffect(() => {
    if (isOpen) {
      if (isEditing && product) {
        setFormData({
          nombre: product.nombre || '',
          descripcion: product.descripcion || '',
          precio: product.precio || '',
          cantidad: product.cantidad || '',
          categoria: product.categoria?._id || product.categoria || '',
          caracteristicas: parseCharacteristics(product.caracteristicas) || []
        });
        
        // Configurar imágenes existentes
        const images = getAllImages(product);
        setExistingImages(images);
        setSelectedImageIndex(0);
      } else {
        // Reset para nuevo producto
        setFormData({
          nombre: '',
          descripcion: '',
          precio: '',
          cantidad: '',
          categoria: '',
          caracteristicas: []
        });
        setExistingImages([]);
      }
      
      // Reset estados de imágenes
      setNewImages([]);
      setImagesToRemove([]);
      setPreviewImages([]);
      setCurrentCharacteristic('');
      setShowImageGallery(false);
    }
  }, [isOpen, isEditing, product]);

  // Función para obtener todas las imágenes del producto
  const getAllImages = (product) => {
    if (!product) return [];
    
    const images = [];
    
    if (product.imagenes && Array.isArray(product.imagenes)) {
      images.push(...product.imagenes);
    }
    
    if (product.imagen && !images.includes(product.imagen)) {
      images.push(product.imagen);
    }
    
    return images.length > 0 ? images : [];
  };

  // Función para parsear características
  const parseCharacteristics = (caracteristicas) => {
    if (!caracteristicas || !Array.isArray(caracteristicas)) return [];
    
    try {
      return caracteristicas.map(item => {
        if (typeof item === 'string') {
          try {
            const parsed = JSON.parse(item);
            if (Array.isArray(parsed)) {
              return parsed.map(subItem => {
                if (typeof subItem === 'string') {
                  try {
                    const subParsed = JSON.parse(subItem);
                    return Array.isArray(subParsed) ? subParsed : [subParsed];
                  } catch {
                    return subItem;
                  }
                }
                return subItem;
              }).flat();
            }
            return parsed;
          } catch {
            return item;
          }
        }
        return item;
      }).flat();
    } catch (error) {
      console.warn('Error parsing characteristics:', error);
      return [];
    }
  };

  // Manejar cambios en inputs
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Manejar selección de nuevas imágenes
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    // Crear previews
    const newPreviews = [];
    const newFileArray = [];

    files.forEach(file => {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          newPreviews.push({
            file: file,
            preview: e.target.result,
            name: file.name
          });
          
          if (newPreviews.length === files.length) {
            setPreviewImages(prev => [...prev, ...newPreviews]);
            setNewImages(prev => [...prev, ...files]);
          }
        };
        reader.readAsDataURL(file);
        newFileArray.push(file);
      }
    });

    // Reset input
    e.target.value = '';
  };

  // Remover imagen nueva (preview)
  const removeNewImage = (index) => {
    setPreviewImages(prev => prev.filter((_, i) => i !== index));
    setNewImages(prev => prev.filter((_, i) => i !== index));
  };

  // Marcar imagen existente para eliminación
  const markImageForRemoval = (imageIndex) => {
    setImagesToRemove(prev => [...prev, imageIndex]);
  };

  // Restaurar imagen marcada para eliminación
  const restoreImage = (imageIndex) => {
    setImagesToRemove(prev => prev.filter(idx => idx !== imageIndex));
  };

  // Manejar características
  const addCharacteristic = () => {
    if (currentCharacteristic.trim()) {
      setFormData(prev => ({
        ...prev,
        caracteristicas: [...prev.caracteristicas, currentCharacteristic.trim()]
      }));
      setCurrentCharacteristic('');
    }
  };

  const removeCharacteristic = (index) => {
    setFormData(prev => ({
      ...prev,
      caracteristicas: prev.caracteristicas.filter((_, i) => i !== index)
    }));
  };

  // Obtener todas las imágenes para la galería
  const getAllImagesForGallery = () => {
    const images = [];
    
    // Imágenes existentes no marcadas para eliminación
    existingImages.forEach((image, index) => {
      if (!imagesToRemove.includes(index)) {
        images.push({ type: 'existing', src: image, index });
      }
    });
    
    // Nuevas imágenes
    previewImages.forEach((preview, index) => {
      images.push({ type: 'new', src: preview.preview, index, name: preview.name });
    });
    
    return images;
  };

  // Manejar envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const productData = {
        ...formData,
        precio: parseFloat(formData.precio),
        cantidad: parseInt(formData.cantidad),
        caracteristicas: formData.caracteristicas
      };

      if (isEditing) {
        // Primero actualizar los datos del producto
        if (newImages.length > 0) {
          productData.imagenes = newImages;
        }
        
        const result = await dispatch(updateProduct({ 
          id: product._id, 
          productData 
        })).unwrap();

        // Si hay imágenes marcadas para eliminación, eliminarlas una por una
        for (const imageIndex of imagesToRemove) {
          await dispatch(removeProductImage({
            id: product._id,
            imageIndex
          })).unwrap();
        }

      } else {
        // Crear nuevo producto
        if (newImages.length > 0) {
          productData.imagenes = newImages;
        }
        
        await dispatch(createProduct(productData)).unwrap();
      }
      
      onClose();
    } catch (error) {
      console.error('Error al guardar producto:', error);
    }
  };

  // Navegación de galería
  const nextImage = () => {
    const allImages = getAllImagesForGallery();
    setSelectedImageIndex((prev) => prev === allImages.length - 1 ? 0 : prev + 1);
  };

  const prevImage = () => {
    const allImages = getAllImagesForGallery();
    setSelectedImageIndex((prev) => prev === 0 ? allImages.length - 1 : prev - 1);
  };

  if (!isOpen) return null;

  const allImages = getAllImagesForGallery();
  const totalImages = allImages.length;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content product-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">
            {isEditing ? 'Editar Producto' : 'Agregar Nuevo Producto'}
          </h2>
          <button className="close-btn" onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-body">
          {/* Información básica */}
          <div className="form-section">
            <h3>Información Básica</h3>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="nombre">Nombre del Producto *</label>
                <input
                  type="text"
                  id="nombre"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleInputChange}
                  required
                  placeholder="Ingrese el nombre del producto"
                />
              </div>
              <div className="form-group">
                <label htmlFor="categoria">Categoría *</label>
                <select
                  id="categoria"
                  name="categoria"
                  value={formData.categoria}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Seleccione una categoría</option>
                  {categories.map(category => (
                    <option key={category._id} value={category._id}>
                      {category.nombre}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="descripcion">Descripción *</label>
              <textarea
                id="descripcion"
                name="descripcion"
                value={formData.descripcion}
                onChange={handleInputChange}
                required
                rows="3"
                placeholder="Describe el producto..."
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="precio">Precio *</label>
                <input
                  type="number"
                  id="precio"
                  name="precio"
                  value={formData.precio}
                  onChange={handleInputChange}
                  required
                  min="0"
                  step="0.01"
                  placeholder="0.00"
                />
              </div>
              <div className="form-group">
                <label htmlFor="cantidad">Stock *</label>
                <input
                  type="number"
                  id="cantidad"
                  name="cantidad"
                  value={formData.cantidad}
                  onChange={handleInputChange}
                  required
                  min="0"
                  placeholder="0"
                />
              </div>
            </div>
          </div>

          {/* Imágenes */}
          <div className="form-section">
            <h3>Imágenes del Producto</h3>
            
            {/* Upload de nuevas imágenes */}
            <div className="image-upload-section">
              <label className="image-upload-label">
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="image-upload-input"
                />
                <div className="image-upload-area">
                  <Upload size={24} />
                  <span>Seleccionar Imágenes</span>
                  <small>Soporta múltiples imágenes (JPG, PNG, etc.)</small>
                </div>
              </label>
            </div>

            {/* Galería de imágenes */}
            {totalImages > 0 && (
              <div className="images-gallery-section">
                <h4>Imágenes ({totalImages})</h4>
                
                {/* Vista principal */}
                <div className="main-image-preview">
                  {totalImages > 0 && allImages[selectedImageIndex] && (
                    <div className="main-image-container">
                      <img
                        src={allImages[selectedImageIndex].src}
                        alt={`Imagen ${selectedImageIndex + 1}`}
                        className="main-preview-image"
                        onClick={() => setShowImageGallery(true)}
                      />
                      
                      {totalImages > 1 && (
                        <>
                          <button
                            type="button"
                            className="gallery-nav-btn prev"
                            onClick={prevImage}
                          >
                            <ChevronLeft size={20} />
                          </button>
                          <button
                            type="button"
                            className="gallery-nav-btn next"
                            onClick={nextImage}
                          >
                            <ChevronRight size={20} />
                          </button>
                          <div className="image-counter-large">
                            {selectedImageIndex + 1} de {totalImages}
                          </div>
                        </>
                      )}
                    </div>
                  )}
                </div>

                {/* Miniaturas */}
                <div className="thumbnails-grid">
                  {/* Imágenes existentes */}
                  {existingImages.map((image, index) => (
                    <div
                      key={`existing-${index}`}
                      className={`thumbnail-item ${imagesToRemove.includes(index) ? 'marked-for-removal' : ''} ${
                        selectedImageIndex === allImages.findIndex(img => img.type === 'existing' && img.index === index) ? 'active' : ''
                      }`}
                    >
                      <img
                        src={image}
                        alt={`Imagen existente ${index + 1}`}
                        onClick={() => {
                          const imgIndex = allImages.findIndex(img => img.type === 'existing' && img.index === index);
                          if (imgIndex !== -1) setSelectedImageIndex(imgIndex);
                        }}
                      />
                      <div className="thumbnail-actions">
                        {imagesToRemove.includes(index) ? (
                          <button
                            type="button"
                            className="restore-btn"
                            onClick={() => restoreImage(index)}
                            title="Restaurar imagen"
                          >
                            Restaurar
                          </button>
                        ) : (
                          <button
                            type="button"
                            className="remove-btn"
                            onClick={() => markImageForRemoval(index)}
                            title="Marcar para eliminación"
                          >
                            <Trash2 size={14} />
                          </button>
                        )}
                      </div>
                      {imagesToRemove.includes(index) && (
                        <div className="removal-overlay">
                          <span>Se eliminará</span>
                        </div>
                      )}
                    </div>
                  ))}

                  {/* Nuevas imágenes */}
                  {previewImages.map((preview, index) => (
                    <div
                      key={`new-${index}`}
                      className={`thumbnail-item new-image ${
                        selectedImageIndex === allImages.findIndex(img => img.type === 'new' && img.index === index) ? 'active' : ''
                      }`}
                    >
                      <img
                        src={preview.preview}
                        alt={`Nueva imagen ${index + 1}`}
                        onClick={() => {
                          const imgIndex = allImages.findIndex(img => img.type === 'new' && img.index === index);
                          if (imgIndex !== -1) setSelectedImageIndex(imgIndex);
                        }}
                      />
                      <div className="thumbnail-actions">
                        <button
                          type="button"
                          className="remove-btn"
                          onClick={() => removeNewImage(index)}
                          title="Eliminar imagen nueva"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                      <div className="new-image-badge">Nueva</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Características */}
          <div className="form-section">
            <h3>Características</h3>
            <div className="characteristics-input">
              <div className="form-row">
                <div className="form-group flex-1">
                  <input
                    type="text"
                    value={currentCharacteristic}
                    onChange={(e) => setCurrentCharacteristic(e.target.value)}
                    placeholder="Agregar característica..."
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addCharacteristic())}
                  />
                </div>
                <button
                  type="button"
                  className="add-characteristic-btn"
                  onClick={addCharacteristic}
                  disabled={!currentCharacteristic.trim()}
                >
                  <Plus size={16} />
                  Agregar
                </button>
              </div>
            </div>

            {formData.caracteristicas.length > 0 && (
              <div className="characteristics-list">
                {formData.caracteristicas.map((characteristic, index) => (
                  <div key={index} className="characteristic-item">
                    <span>{characteristic}</span>
                    <button
                      type="button"
                      className="remove-characteristic-btn"
                      onClick={() => removeCharacteristic(index)}
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Error message */}
          {error && (
            <div className="error-message">
              {error}
            </div>
          )}
        </form>

        <div className="modal-actions">
          <button
            type="button"
            className="cancel-btn"
            onClick={onClose}
            disabled={loading}
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="submit-btn"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? 'Guardando...' : (isEditing ? 'Actualizar Producto' : 'Crear Producto')}
          </button>
        </div>

        {/* Modal de galería expandida */}
        {showImageGallery && totalImages > 0 && (
          <div className="image-gallery-modal" onClick={() => setShowImageGallery(false)}>
            <div className="gallery-content" onClick={(e) => e.stopPropagation()}>
              <div className="gallery-header">
                <h3>Galería de Imágenes</h3>
                <button
                  className="close-gallery-btn"
                  onClick={() => setShowImageGallery(false)}
                >
                  <X size={24} />
                </button>
              </div>
              
              <div className="gallery-main-image">
                <img
                  src={allImages[selectedImageIndex]?.src}
                  alt={`Imagen ${selectedImageIndex + 1}`}
                />
                
                {totalImages > 1 && (
                  <>
                    <button
                      className="gallery-nav-btn prev"
                      onClick={prevImage}
                    >
                      <ChevronLeft size={24} />
                    </button>
                    <button
                      className="gallery-nav-btn next"
                      onClick={nextImage}
                    >
                      <ChevronRight size={24} />
                    </button>
                    <div className="gallery-counter">
                      {selectedImageIndex + 1} de {totalImages}
                    </div>
                  </>
                )}
              </div>
              
              <div className="gallery-thumbnails">
                {allImages.map((image, index) => (
                  <img
                    key={index}
                    src={image.src}
                    alt={`Miniatura ${index + 1}`}
                    className={`gallery-thumbnail ${index === selectedImageIndex ? 'active' : ''}`}
                    onClick={() => setSelectedImageIndex(index)}
                  />
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductModal;