import React, { useState } from 'react';
import { Pencil, Camera, Save, X, Phone, MapPin, User } from 'lucide-react';
import { useSelector } from 'react-redux';

const ProfileSection = () => {
  const profileData = useSelector((action)=>action.auth)
  const [isEditing, setIsEditing] = useState(false);

  
  const [tempData, setTempData] = useState(profileData);

  const handleSave = () => {
    setProfileData(tempData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setTempData(profileData);
    setIsEditing(false);
  };

  return (
    <div className=" p-6 bg-gray-900 h-full shadow-xl text-gray-100">
      <div className="relative mb-6">
        {/* Profile Image Section */}
        <div className="relative w-32 h-32 mx-auto mb-4">
          <img
            src="/api/placeholder/128/128"
            alt="Profile"
            className="rounded-full w-full h-full object-cover border-4 border-gray-700"
          />
          <button className="absolute bottom-0 right-0 p-2 bg-gray-700 rounded-full text-gray-200 hover:bg-gray-600 transition-colors">
            <Camera size={16} />
          </button>
        </div>

        {/* Edit Toggle Button */}
        <button
          onClick={() => setIsEditing(!isEditing)}
          className="absolute top-0 right-0 p-2 text-gray-400 hover:text-gray-200"
        >
          <Pencil size={20} />
        </button>
      </div>

      {/* Profile Information */}
      <div className="space-y-4">
        {isEditing ? (
          // Edit Mode
          <div className="space-y-4">
            {/* Name Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  First Name
                </label>
                <input
                  type="text"
                  value={tempData.first_name}
                  onChange={(e) => setTempData({ ...tempData, firstName: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-600 text-gray-100"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Last Name
                </label>
                <input
                  type="text"
                  value={tempData.last_name}
                  onChange={(e) => setTempData({ ...tempData, lastName: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-600 text-gray-100"
                />
              </div>
            </div>

            {/* Contact Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={tempData.email}
                  onChange={(e) => setTempData({ ...tempData, email: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-600 text-gray-100"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Phone
                </label>
                <input
                  type="tel"
                  value={tempData.phone}
                  onChange={(e) => setTempData({ ...tempData, phone: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-600 text-gray-100"
                />
              </div>
            </div>

            {/* Bio Section */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Bio
              </label>
              <textarea
                value={tempData.bio}
                onChange={(e) => setTempData({ ...tempData, bio: e.target.value })}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-600 text-gray-100"
                rows={3}
              />
            </div>

            {/* Address Section */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Address
                </label>
                <input
                  type="text"
                  value={tempData.address}
                  onChange={(e) => setTempData({ ...tempData, address: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-600 text-gray-100"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    District
                  </label>
                  <input
                    type="text"
                    value={tempData.district}
                    onChange={(e) => setTempData({ ...tempData, district: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-600 text-gray-100"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    State
                  </label>
                  <input
                    type="text"
                    value={tempData.state}
                    onChange={(e) => setTempData({ ...tempData, state: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-600 text-gray-100"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Location
                  </label>
                  <input
                    type="text"
                    value={tempData.location}
                    onChange={(e) => setTempData({ ...tempData, location: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-600 text-gray-100"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-4">
              <button
                onClick={handleCancel}
                className="px-4 py-2 border border-gray-700 rounded-md text-gray-300 hover:bg-gray-800 flex items-center gap-2"
              >
                <X size={16} />
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-gray-700 text-gray-100 rounded-md hover:bg-gray-600 flex items-center gap-2"
              >
                <Save size={16} />
                Save
              </button>
            </div>
          </div>
        ) : (
          // View Mode
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-100">
                {profileData.firstName} {profileData.lastName}
              </h2>
              <div className="mt-2 space-y-2">
                <p className="text-gray-400 flex items-center gap-2">
                  <User size={16} />
                  {profileData.name}
                </p>
                <p className="text-gray-400 flex items-center gap-2">
                  <Phone size={16} />
                  {profileData.phone}
                </p>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-200 mb-2">About</h3>
              <p className="text-gray-400">{profileData.bio}</p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-200 mb-2">Location</h3>
              <div className="space-y-2">
                <p className="text-gray-400 flex items-center gap-2">
                  <MapPin size={16} />
                  {profileData.address}
                </p>
                <p className="text-gray-400 pl-6">
                  {profileData.district}, {profileData.state}
                </p>
                <p className="text-gray-400 pl-6">{profileData.location}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileSection;