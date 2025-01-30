import React, { useState,useEffect } from 'react';
import { Pencil, Camera, Save, X, Phone, MapPin, User } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { userProfile } from '../../actions/user';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { logout } from '../../redux/authSlice';
import toast, { Toaster } from "react-hot-toast";
const ProfileSection = () => {
  const userData = useSelector((action)=>action.auth)
  const [isEditing, setIsEditing] = useState(false);
  const [tempData, setTempData] = useState({});
  const [profileData, setProfileData] = useState({});
  const [image, setImage] = useState(true);
  const [state,setState] = useState(false)
  const navigate = useNavigate()
  const dispatch = useDispatch()
  
  

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
  
      if (file) {
        const formData = new FormData();

     
      
      formData.append("image", file);
        
      try {
        const response = await axios.patch("https://api.rootstocks.site/account/profile/", formData, {
          headers: {
            Authorization: `Bearer ${userData.token}`,
            "Content-Type": "multipart/form-data",
          },
        });
        setImage(!image);
        
        toast.success("Image uploaded successfully");
      } catch (error) {
        console.error("Error uploading image:", error);
      }
      }
  };
  
  useEffect(() => {
    async function fetchData() {
      console.log(userData.email);
      
      const response = await userProfile(userData.token);
      if (response.status ==200){
     
        setProfileData(response.data.user);
        
        setTempData(prevData => ({
          ...prevData,
          first_name: response.data.user.first_name,
          about: response.data.user.about,
          email: response.data.user.email,
          address: response.data.user.address,
          last_name: response.data.user.last_name,
          phone: response.data.user.phone,
          state: response.data.user.state,
          district: response.data.user.district,
        }));
      }
      else if(response.status==401){
        dispatch(logout())
      }
      
    }
    if (userData.token) { 
      fetchData();
    }
    else{
      navigate('/login')
    }
    
  },[userData,navigate,image,state]);
  
  const handleSave =async () => {
    setIsEditing(false);
    try {
      const response = await axios.patch("https://api.rootstocks.site/account/profile/", tempData, {
        headers: {
          Authorization: `Bearer ${userData.token}`,
          "Content-Type": "multipart/form-data",
        },}
      )
      setState(!state)
    } catch (error) {
      toast.error(error.response.data.errors);  
    }
    
    
  };
  
  const handleCancel = () => {
    setTempData(profileData)
    setIsEditing(false);
  }; 
  
  return (
    <div className="p-6 bg-gray-900 h-full shadow-xl text-gray-100">
  <div className="relative mb-6">
    <div className="relative w-32 h-32 mx-auto mb-4">
      <img
        src={`https://api.rootstocks.site${profileData.image}`}
        alt="Profile"
        className="rounded-full w-full h-full object-cover border-4 border-gray-700"
      />

      <label 
        htmlFor="profileUpload" 
        className="absolute bottom-0 right-0 p-2 bg-gray-700 rounded-full text-gray-200 hover:bg-gray-600 transition-colors cursor-pointer"
        aria-label="Change Profile Picture"
      >
        <Camera size={16} />
      </label>
      <input 
        id="profileUpload" 
        type="file" 
        accept="image/*" 
        className="hidden" 
        onChange={handleImageChange} 
      />
    </div>

    <button
      onClick={() => setIsEditing(!isEditing)}
      className="absolute top-0 right-0 p-2 text-gray-400 hover:text-gray-200"
    >
      <Pencil size={20} />
    </button>
  </div>

  <div className="space-y-4">
    {isEditing ? (
      <div className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              First Name
            </label>
            <input
              type="text"
              value={tempData.first_name}
              onChange={(e) => setTempData({ ...tempData, first_name: e.target.value })}
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
              onChange={(e) => setTempData({ ...tempData, last_name: e.target.value })}
              className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-600 text-gray-100"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Bio
          </label>
          <textarea
            value={tempData.about}
            onChange={(e) => setTempData({ ...tempData, about: e.target.value })}
            className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-600 text-gray-100"
            rows={3}
          />
        </div>

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
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
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
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-100">
            {profileData.first_name} {profileData.last_name}
          </h2>
          <div className="mt-2 space-y-2">
            <p className="text-gray-400 flex items-center gap-2">
              <User size={16} />
              {profileData.email}
            </p>
            <p className="text-gray-400 flex items-center gap-2">
              <Phone size={16} />
              {profileData.phone}
            </p>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-gray-200 mb-2">About</h3>
          <p className="text-gray-400">{profileData.about}</p>
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
  <Toaster position="top-center" reverseOrder={false} />
</div>

  );
};

export default ProfileSection;