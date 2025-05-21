import React, { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { 
  UserCircleIcon, 
  PencilIcon, 
  KeyIcon, 
  ShieldCheckIcon,
  BellIcon,
  CameraIcon
} from '@heroicons/react/24/outline';
import ChangePasswordModal from './ChangePasswordModal';
import NotificationsModal from './NotificationsModal';
import UserOne from '../../images/user/user-01.png';

const Profile = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const [isEditing, setIsEditing] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showNotificationsModal, setShowNotificationsModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    role: ''
  });
  const [profileImage, setProfileImage] = useState(UserOne);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        role: user.role || ''
      });
      if (user.profileImage) {
        setProfileImage(user.profileImage);
      }
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageClick = () => {
    fileInputRef.current.click();
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        setIsUploading(true);
        
        // Validar el tipo y tamaño del archivo
        if (!file.type.startsWith('image/')) {
          alert('Por favor selecciona una imagen válida');
          return;
        }
        
        if (file.size > 5 * 1024 * 1024) { // 5MB
          alert('La imagen no debe superar los 5MB');
          return;
        }

        // Crear FormData para enviar la imagen
        const formData = new FormData();
        formData.append('image', file);
        formData.append('userId', user.id);

        // Subir la imagen al servidor
        const response = await fetch('/api/users/upload-profile-image', {
          method: 'POST',
          body: formData
        });

        if (!response.ok) {
          throw new Error('Error al subir la imagen');
        }

        const data = await response.json();
        
        // Actualizar el estado local y global
        setProfileImage(data.imageUrl);
        dispatch(updateUser({ ...user, profileImage: data.imageUrl }));
        
        alert('Foto de perfil actualizada correctamente');
      } catch (error) {
        console.error('Error al actualizar la imagen:', error);
        alert('Error al actualizar la foto de perfil');
      } finally {
        setIsUploading(false);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Aquí iría la lógica para actualizar el perfil
      setIsEditing(false);
      alert('Perfil actualizado correctamente');
    } catch (error) {
      console.error('Error al actualizar el perfil:', error);
      alert('Error al actualizar el perfil');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Header */}
          <div className="bg-blue-600 px-6 py-8">
            <div className="flex items-center space-x-4">
              <div className="flex-shrink-0 relative">
                <div className="relative">
                  <img 
                    src={profileImage} 
                    alt="Profile" 
                    className={`h-24 w-24 rounded-full object-cover ${isUploading ? 'opacity-50' : 'cursor-pointer'}`}
                    onClick={!isUploading ? handleImageClick : undefined}
                  />
                  {isUploading && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                    </div>
                  )}
                </div>
                <div 
                  className={`absolute bottom-0 right-0 bg-blue-500 rounded-full p-2 ${isUploading ? 'opacity-50' : 'cursor-pointer hover:bg-blue-600'}`}
                  onClick={!isUploading ? handleImageClick : undefined}
                >
                  <CameraIcon className="h-4 w-4 text-white" />
                </div>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageChange}
                  accept="image/*"
                  className="hidden"
                  disabled={isUploading}
                />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">{user?.name}</h1>
                <p className="text-blue-100">{user?.role}</p>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="px-6 py-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Información Personal */}
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-semibold text-gray-900">Información Personal</h2>
                  <button
                    onClick={() => setIsEditing(!isEditing)}
                    className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    <PencilIcon className="h-4 w-4 mr-2" />
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
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
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
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
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
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    />
                  </div>

                  {isEditing && (
                    <div className="flex justify-end">
                      <button
                        type="submit"
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        Guardar cambios
                      </button>
                    </div>
                  )}
                </form>
              </div>

              {/* Acciones Rápidas */}
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-900">Acciones Rápidas</h2>
                <div className="grid grid-cols-1 gap-4">
                  <button 
                    onClick={() => setShowPasswordModal(true)}
                    className="flex items-center p-4 bg-white border rounded-lg shadow-sm hover:bg-gray-50"
                  >
                    <KeyIcon className="h-6 w-6 text-blue-600 mr-3" />
                    <div className="text-left">
                      <h3 className="text-sm font-medium text-gray-900">Cambiar Contraseña</h3>
                      <p className="text-sm text-gray-500">Actualiza tu contraseña de acceso</p>
                    </div>
                  </button>

                  <button className="flex items-center p-4 bg-white border rounded-lg shadow-sm hover:bg-gray-50">
                    <ShieldCheckIcon className="h-6 w-6 text-blue-600 mr-3" />
                    <div className="text-left">
                      <h3 className="text-sm font-medium text-gray-900">Seguridad</h3>
                      <p className="text-sm text-gray-500">Configura tus opciones de seguridad</p>
                    </div>
                  </button>

                  <button 
                    onClick={() => setShowNotificationsModal(true)}
                    className="flex items-center p-4 bg-white border rounded-lg shadow-sm hover:bg-gray-50"
                  >
                    <BellIcon className="h-6 w-6 text-blue-600 mr-3" />
                    <div className="text-left">
                      <h3 className="text-sm font-medium text-gray-900">Notificaciones</h3>
                      <p className="text-sm text-gray-500">Gestiona tus preferencias de notificaciones</p>
                    </div>
                  </button>
                </div>
              </div>
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