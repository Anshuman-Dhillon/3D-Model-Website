// src/pages/ManageModelPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import "../pages design/ModelPage.css"; // use the existing layout CSS

function ManageModelPage() {
  const { id } = useParams();
  const isEditing = Boolean(id);

  const [form, setForm] = useState({
    name: '',
    description: '',
    price: '',
    formats: '',
    category: ''
  });

  useEffect(() => {
    if (isEditing) {
      // TODO: replace this stub with an API fetch by ID
      const fetched = {
        name: 'Sci-Fi Spaceship',
        description: 'High-res 3D spaceship model.',
        price: '19.99',
        formats: '.obj, .fbx',
        category: 'Sci-Fi'
      };
      setForm(fetched);
    }
  }, [isEditing, id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isEditing) {
      console.log('Saving changes for ID', id, form);
      // TODO: call your update API
    } else {
      console.log('Creating new model', form);
      // TODO: call your create API
    }
  };

  return (
    <div className="model-page-container">
      <div className="top-section">
        <div className="left-box">
          <div className="model-preview"></div>
          <div className="thumbnail-scroll">
            <div className="thumbnail"></div>
            <div className="thumbnail"></div>
            <div className="thumbnail"></div>
          </div>
        </div>

        <div className="right-box">
          <h2>{isEditing ? 'Edit 3D Model' : 'Add New 3D Model'}</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">Model Name</label>
              <input
                type="text"
                name="name"
                className="form-control"
                value={form.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Description</label>
              <textarea
                name="description"
                className="form-control"
                rows="4"
                value={form.description}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Price ($)</label>
              <input
                type="number"
                step="0.01"
                name="price"
                className="form-control"
                value={form.price}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">File Formats</label>
              <input
                type="text"
                name="formats"
                className="form-control"
                value={form.formats}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Category</label>
              <select
                name="category"
                className="form-select"
                value={form.category}
                onChange={handleChange}
                required
              >
                <option value="">Select a category</option>
                <option value="Sci‑Fi">Sci‑Fi</option>
                <option value="Fantasy">Fantasy</option>
                <option value="Architecture">Architecture</option>
                <option value="Weapons">Weapons</option>
                <option value="Vehicles">Vehicles</option>
              </select>
            </div>

            <button type="submit" className="btn btn-primary mt-2">
              {isEditing ? 'Save Changes' : 'Add Model'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ManageModelPage;
