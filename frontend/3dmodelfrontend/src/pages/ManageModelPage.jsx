import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import "../pages design/ManageModelPage.css";
import { apiGetModelById, apiCreateModel, apiUpdateModel } from '../api';
import { useAuth } from '../context/AuthContext';

function ManageModelPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const isEditing = Boolean(id);

  const [form, setForm] = useState({
    name: '', description: '', price: '', format: '', category: ''
  });
  const [modelFile, setModelFile] = useState(null);
  const [existingModelFileName, setExistingModelFileName] = useState('');
  const [thumbnail, setThumbnail] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState(null);
  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (isEditing) {
      apiGetModelById(id).then(data => {
        if (data && !data.message) {
          setForm({
            name: data.name || '',
            description: data.description || '',
            price: data.price?.toString() || '',
            format: data.format || '',
            category: data.category || '',
          });
          if (data.thumbnailUrl) setThumbnailPreview(data.thumbnailUrl);
          if (data.imageUrls?.length) setExistingImages(data.imageUrls);
          if (data.fileKey) {
            const parts = data.fileKey.split('/');
            setExistingModelFileName(parts[parts.length - 1]?.replace(/^\d+-/, '') || 'Model file uploaded');
          }
        }
      });
    }
    return () => {
      imagePreviews.forEach(url => URL.revokeObjectURL(url));
      if (thumbnailPreview && thumbnailPreview.startsWith('blob:')) URL.revokeObjectURL(thumbnailPreview);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEditing, id, user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleImageAdd = (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;
    const totalExisting = existingImages.length;
    const totalNew = images.length;
    const remaining = 10 - totalExisting - totalNew;
    const capped = files.slice(0, Math.max(0, remaining));
    if (!capped.length) return;
    setImages(prev => [...prev, ...capped]);
    setImagePreviews(prev => [...prev, ...capped.map(f => URL.createObjectURL(f))]);
    e.target.value = '';
  };

  const removeImage = (index) => {
    URL.revokeObjectURL(imagePreviews[index]);
    setImages(prev => prev.filter((_, i) => i !== index));
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  const removeExistingImage = (index) => {
    setExistingImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); setSuccess('');
    setLoading(true);

    const formData = new FormData();
    formData.append('name', form.name);
    formData.append('description', form.description);
    formData.append('price', form.price);
    formData.append('format', form.format);
    formData.append('category', form.category);
    if (modelFile) formData.append('modelFile', modelFile);
    if (thumbnail) formData.append('thumbnail', thumbnail);
    images.forEach(img => formData.append('images', img));
    // Tell backend which existing images to keep
    if (isEditing && existingImages.length > 0) {
      formData.append('keepExistingImages', JSON.stringify(existingImages));
    }

    let result;
    if (isEditing) {
      result = await apiUpdateModel(id, formData);
    } else {
      result = await apiCreateModel(formData);
    }

    setLoading(false);
    if (result.ok) {
      setSuccess(isEditing ? 'Model updated!' : 'Model created!');
      setTimeout(() => navigate('/mymodels'), 1000);
    } else {
      setError(result.data?.message || 'Operation failed');
    }
  };

  const allPreviews = [...existingImages, ...imagePreviews];

  return (
    <div className="model-page-container">
      <div className="top-section">
        <div className="left-box">
          <div className="manage-upload-area">
            {/* Thumbnail */}
            <div className="manage-upload-section">
              <label className="manage-upload-label">Thumbnail Image</label>
              <div className="manage-thumbnail-drop" onClick={() => document.getElementById('thumb-input').click()}>
                {thumbnailPreview ? (
                  <img src={thumbnailPreview} alt="Thumbnail" className="manage-thumb-preview" />
                ) : (
                  <div className="manage-upload-placeholder">
                    <span className="manage-upload-icon">📷</span>
                    <span>Click to upload thumbnail</span>
                  </div>
                )}
                <input id="thumb-input" type="file" accept="image/*" hidden onChange={(e) => {
                  const file = e.target.files[0];
                  if (!file) return;
                  setThumbnail(file);
                  if (thumbnailPreview && thumbnailPreview.startsWith('blob:')) URL.revokeObjectURL(thumbnailPreview);
                  setThumbnailPreview(URL.createObjectURL(file));
                }} />
              </div>
            </div>

            {/* Gallery Images */}
            <div className="manage-upload-section">
              <label className="manage-upload-label">Gallery Images (up to 10)</label>
              <div className="manage-gallery-grid">
                {allPreviews.map((url, i) => (
                  <div key={i} className="manage-gallery-item">
                    <img src={url} alt={`Gallery ${i + 1}`} />
                    <button
                      type="button"
                      className="manage-gallery-remove"
                      onClick={() => i < existingImages.length ? removeExistingImage(i) : removeImage(i - existingImages.length)}
                    >×</button>
                  </div>
                ))}
                {allPreviews.length < 10 && (
                  <div className="manage-gallery-add" onClick={() => document.getElementById('images-input').click()}>
                    <span>+</span>
                    <input id="images-input" type="file" accept="image/*" multiple hidden onChange={handleImageAdd} />
                  </div>
                )}
              </div>
            </div>

            {/* Model File */}
            <div className="manage-upload-section">
              <label className="manage-upload-label">3D Model File</label>
              <div className="manage-file-drop" onClick={() => document.getElementById('model-input').click()}>
                <span className="manage-upload-icon">{modelFile || existingModelFileName ? '✅' : '📦'}</span>
                <span>{modelFile ? modelFile.name : existingModelFileName || 'Click to upload .obj, .fbx, .gltf, .glb, .stl, .usdz'}</span>
                {existingModelFileName && !modelFile && (
                  <span style={{ fontSize: '0.78rem', color: '#64748b', marginTop: '4px' }}>Click to replace</span>
                )}
                <input id="model-input" type="file" accept=".obj,.fbx,.gltf,.glb,.stl,.usdz" hidden onChange={(e) => setModelFile(e.target.files[0])} />
              </div>
            </div>
          </div>
        </div>

        <div className="right-box">
          <h2>{isEditing ? 'Edit 3D Model' : 'Upload New 3D Model'}</h2>

          {error && <div style={{ color: '#ff6b6b', marginBottom: '10px' }}>{error}</div>}
          {success && <div style={{ color: '#4CAF50', marginBottom: '10px' }}>{success}</div>}

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">Model Name</label>
              <input type="text" name="name" className="form-control" value={form.name} onChange={handleChange} required />
            </div>

            <div className="mb-3">
              <label className="form-label">Description</label>
              <textarea name="description" className="form-control" rows="4" value={form.description} onChange={handleChange} required />
            </div>

            <div className="mb-3">
              <label className="form-label">Price ($)</label>
              <input type="number" step="0.01" min="0" name="price" className="form-control" value={form.price} onChange={handleChange} required />
            </div>

            <div className="mb-3">
              <label className="form-label">File Format</label>
              <select name="format" className="form-select" value={form.format} onChange={handleChange} required>
                <option value="" disabled>Select a file format</option>
                <option value="OBJ">OBJ</option>
                <option value="FBX">FBX</option>
                <option value="STL">STL</option>
                <option value="GLTF">GLTF</option>
                <option value="GLB">GLB</option>
                <option value="USDZ">USDZ</option>
              </select>
            </div>

            <div className="mb-3">
              <label className="form-label">Category</label>
              <select name="category" className="form-select" value={form.category} onChange={handleChange} required>
                <option value="">Select a category</option>
                <option value="Sci-Fi">Sci-Fi</option>
                <option value="Fantasy">Fantasy</option>
                <option value="Architecture">Architecture</option>
                <option value="Weapons">Weapons</option>
                <option value="Vehicles">Vehicles</option>
              </select>
            </div>

            <button type="submit" className="btn mt-2" disabled={loading} style={{
              background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
              border: 'none', color: '#fff', fontWeight: 600, padding: '12px 32px',
              borderRadius: '8px', fontSize: '1rem', width: '100%'
            }}>
              {loading ? 'Saving...' : isEditing ? 'Save Changes' : 'Upload Model'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ManageModelPage;
