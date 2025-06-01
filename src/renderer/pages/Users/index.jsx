import React, { useState, useEffect, useRef } from 'react';
import { 
  CameraIcon, 
  KeyIcon, 
  BellIcon, 
  ShieldCheckIcon, 
  PencilIcon 
} from '@heroicons/react/24/outline';
import ChangePasswordModal from './ChangePasswordModal';
import NotificationsModal from './NotificationsModal';
import UserOne from '../../images/user/user-01.png';

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showNotificationsModal, setShowNotificationsModal] = useState(false);
  const [formData, setFormData] = useState({
    name: 'Juan Pérez',
    email: 'juanperez@example.com',
    phone: '+54 9 11 1234 5678',
    role: 'Administrador'
  });
  const [profileImage, setProfileImage] = useState(UserOne);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);

  const handleImageClick = () => {
    fileInputRef.current.click();
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Simular subida
      setIsUploading(true);
      setTimeout(() => {
        setProfileImage(URL.createObjectURL(file));
        setIsUploading(false);
      }, 1500);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsEditing(false);
    alert('Perfil actualizado');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="p-6 bg-gray-100 text-center">
          <div className="relative inline-block">
            <img
              src={profileImage}
              alt="Foto de perfil"
              className="w-28 h-28 rounded-full object-cover border-4 border-white shadow-md mx-auto"
              onClick={handleImageClick}
              style={{ cursor: isUploading ? 'default' : 'pointer' }}
            />
            <div 
              className="absolute bottom-0 right-0 bg-blue-600 p-2 rounded-full shadow cursor-pointer hover:bg-blue-700"
              onClick={handleImageClick}
            >
              <CameraIcon className="h-4 w-4 text-white" />
            </div>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageChange}
              className="hidden"
              accept="image/*"
              disabled={isUploading}
            />
          </div>
          <h1 className="mt-4 text-2xl font-bold text-gray-800">{formData.name}</h1>
          <p className="text-gray-500">{formData.role}</p>
          <p className="text-sm text-gray-400 mt-1">{formData.email}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
          {/* Información personal */}
          <div className="bg-white border rounded-xl shadow-sm p-5">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-800">Información Personal</h2>
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="text-blue-600 hover:underline flex items-center"
              >
                <PencilIcon className="w-4 h-4 mr-1" />
                {isEditing ? 'Cancelar' : 'Editar'}
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Nombre</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="mt-1 w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="mt-1 w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Teléfono</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="mt-1 w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              {isEditing && (
                <div className="text-right">
                  <button
                    type="submit"
                    className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700"
                  >
                    Guardar cambios
                  </button>
                </div>
              )}
            </form>
          </div>

          {/* Acciones rápidas */}
          <div className="bg-white border rounded-xl shadow-sm p-5">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Acciones Rápidas</h2>
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => setShowPasswordModal(true)}
                className="flex flex-col items-center justify-center p-4 border rounded-lg hover:bg-gray-50"
              >
                <KeyIcon className="h-6 w-6 text-blue-600 mb-2" />
                <span className="text-sm font-medium text-gray-700 text-center">Cambiar Contraseña</span>
              </button>

              <button
                className="flex flex-col items-center justify-center p-4 border rounded-lg hover:bg-gray-50"
              >
                <ShieldCheckIcon className="h-6 w-6 text-blue-600 mb-2" />
                <span className="text-sm font-medium text-gray-700 text-center">Seguridad</span>
              </button>

              <button
                onClick={() => setShowNotificationsModal(true)}
                className="flex flex-col items-center justify-center p-4 border rounded-lg hover:bg-gray-50"
              >
                <BellIcon className="h-6 w-6 text-blue-600 mb-2" />
                <span className="text-sm font-medium text-gray-700 text-center">Notificaciones</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modales */}
      <ChangePasswordModal
        isOpen={showPasswordModal}
        onClose={() => setShowPasswordModal(false)}
      />
      <NotificationsModal
        isOpen={showNotificationsModal}
        onClose={() => setShowNotificationsModal(false)}
      />
    </div>
  );
};

export default Profile;
