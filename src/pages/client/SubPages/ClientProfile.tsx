import type React from "react"
import { useState, useRef, type ChangeEvent, useEffect } from "react"
import { Save, Eye, EyeOff, Upload } from "lucide-react"
import { clientValidateProfileForm, validatePasswordForm, type ClientProfileErrors, type PasswordErrors } from "@/utils/validations/profile-update.validation"
import toast from "react-hot-toast"
import { clientService } from "@/services/clientServices"
import { uploadImageCloudinary } from "@/utils/cloudinary/cloudinary"
import type { LocationData } from "@/types/location.type"
import { LocationInput } from "@/components/ReusableComponents/LocationInput"
import { useDispatch } from "react-redux"
import { clientLogin } from "@/store/slices/client.slice";
import { getErrorMessage } from "@/utils/errors/errorHandler"

export interface UserProfile {
  username: string
  email: string
  phone: string
  avatar: string | null
  avatarFile?: File | null
   location: LocationData | null
}

const ClientProfile: React.FC = () => {
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState<UserProfile>({
   username: "",
   email: "",
   phone: "",
   avatar: "",
   avatarFile: null,
   location: null,
  })
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })
    const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  })
  const [errors, setErrors] = useState<{
  profile: ClientProfileErrors;
  password: PasswordErrors;
  }>({
  profile: {
    username: "",
    email: "",
    phone: "",
  },
  password: {},
  });


  const dispatch = useDispatch();

    useEffect(()=>{
    fetchProfileData();
  },[])

const fetchProfileData = async () => {
    try{
       const response = await clientService.getSingleUser();
       console.log("Profile data fetched:", response.data);
       setProfile({
        username: response.data.username,
        email: response.data.email,
        phone: response.data.phone,
        avatar: response.data.avatar || null,
        location: response.data.location || null,
       });
    }catch(error){
        console.error("Error fetching profile data:", error)
        toast.error("Failed to load profile data. Please try again later.")
    }
}

  const handleProfileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setProfile({
      ...profile,
      [name]: value,
    })

    // Clear error when user types
    setErrors({
      ...errors,
      profile: {
        ...errors.profile,
        [name]: "",
      },
    })
  }

  const handlePasswordInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setPasswordData({
      ...passwordData,
      [name]: value,
    })

    // Clear error when user types
    setErrors({
      ...errors,
      password: {
        ...errors.password,
        [name]: "",
        match: "",
      },
    })
  }

const handleLocationChange = (location: LocationData | null) => {
  setProfile({
    ...profile,
    location: location,
  })
}

  const togglePasswordVisibility = (field: "current" | "new" | "confirm") => {
    setShowPasswords({
      ...showPasswords,
      [field]: !showPasswords[field],
    })
  }


  const handleAvatarUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
         console.log("Image data URL:", event.target?.result);
         setProfile((prev) => ({
        ...prev,
        avatar: event.target?.result as string, 
        avatarFile: file, 
      }));
      }
      reader.readAsDataURL(file)
    }
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2)
  }


const handlePasswordValidation = () => {
  const validationErrors = validatePasswordForm(passwordData);
  setErrors((prev) => ({
    ...prev,
    password: validationErrors,
  }));
  return Object.keys(validationErrors).length === 0;
};


  const handleProfileSave = async () => {
    setLoading(true)
     const result = clientValidateProfileForm(profile);
     setErrors((prev) => ({ ...prev, profile: result.errors }));

  if (result.isValid) {
    try {
       let cloudinaryUrl = '';
      if(profile.avatarFile){
        cloudinaryUrl = await uploadImageCloudinary(profile.avatarFile)
      }

      const updatedProfile = {
        ...profile,
        avatar: cloudinaryUrl, 
        avatarFile: undefined, 
      };

        const response = await clientService.updateProfile(updatedProfile);
        console.log("Profile update response:", response.data);
        if(response.success){
            dispatch(clientLogin(response.data));
            toast.success("Profile updated successfully!");
        }else{
            toast.error("Failed to update profile. Please try again later.");
        }
    } catch (error) {
      console.error("Error saving profile:", error);
      toast.error("Failed to save profile. Please try again later.");
    }finally{
      setLoading(false)
    }
  }
  }


  const handlePasswordChange = async() => {
    if (handlePasswordValidation()) {
      try {
        const response = await clientService.updatePassword(
          passwordData.currentPassword, 
          passwordData.newPassword
        );
        console.log("Password change response:", response.data);
        if(response.success){
        toast.success("Password changed successfully!");
         setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
        })
        }else{
          toast.error(response.message);
        }
      } catch (error:unknown) {
        console.error("Error changing password:", error);
        toast.error(getErrorMessage(error));
      }
    }
  }

  return (
        <div className="max-w-6xl mx-auto p-4 md:p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6 text-center">Profile Settings</h1>

      {/* Banner Section - Full Width */}
      <div className="relative w-full h-48 md:h-64 rounded-lg overflow-hidden mb-20 bg-gradient-to-r from-green-500 to-teal-600">
        
        {/* Avatar Section - Centered in banner */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <div
          className={`relative w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-white overflow-hidden ${
            profile.avatar ? "" : "bg-blue-500"
          } flex items-center justify-center cursor-pointer shadow-xl hover:shadow-2xl transition-all duration-300 group`}
          onClick={() => avatarInputRef.current?.click()}
        >
          {profile.avatar ? (
            <img
              src={profile.avatar}
              alt="Profile Avatar"
              className="w-full h-full object-cover z-0"
              referrerPolicy="no-referrer"
              crossOrigin="anonymous"
            />
          ) : (
            <span className="text-white text-3xl md:text-4xl font-bold z-0">
              {getInitials(profile.username)}
            </span>
          )}

          {/* Overlay must be on top and transparent initially */}
          <div className="absolute inset-0 z-10  group-hover:bg-opacity-20 transition-all duration-200 flex items-center justify-center">
            <Upload size={38} className="text-white bg-gradient-to-r from-green-500 to-teal-600 rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 shadow" />
          </div>
        </div>

          <input
            type="file"
            ref={avatarInputRef}
            onChange={handleAvatarUpload}
            accept="image/*"
            className="hidden"
          />
        </div>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
        {/* Left Column - Profile Details Form */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold text-gray-700 mb-6 border-b border-gray-200 pb-2">Personal Information</h2>
          <div className="space-y-5">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
                Username
              </label>
              <input
                type="text"
                id="username"
                name="username"
                value={profile.username}
                onChange={handleProfileChange}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 ${
                  errors.profile.username ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.profile.username && <p className="mt-1 text-sm text-red-600">{errors.profile.username}</p>}
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={profile.email}
                onChange={handleProfileChange}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 ${
                  errors.profile.email ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.profile.email && <p className="mt-1 text-sm text-red-600">{errors.profile.email}</p>}
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                Phone
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={profile.phone}
                onChange={handleProfileChange}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 ${
                  errors.profile.phone ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.profile.phone && <p className="mt-1 text-sm text-red-600">{errors.profile.phone}</p>}
            </div>

            <div>
            <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
              Location
            </label>
            <LocationInput
              value={profile.location}
              onChange={handleLocationChange}
              placeholder="Search for your location..."
              className="w-full"
            />
          </div>

            <button
              onClick={handleProfileSave}
              disabled={loading}
            className={`flex items-center justify-center w-full px-6 py-3 
                bg-gradient-to-r 
                ${loading ? "from-gray-400 to-purple-500" : "from-blue-500 to-purple-600"} 
                text-white font-medium rounded-lg 
                ${
                  loading
                    ? "hover:from-gray-500 hover:to-purple-600"
                    : "hover:from-blue-600 hover:to-purple-700"
                }
                focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 
                transition-all duration-200 shadow-md hover:shadow-lg`}
            >
              <Save size={20} className="mr-2" />
               {loading ? "Updating..." : "Update Profile"}
            </button>
          </div>
        </div>

        {/* Right Column - Change Password Section */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold text-gray-700 mb-6 border-b border-gray-200 pb-2">Change Password</h2>
          <div className="space-y-5">
            <div>
              <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 mb-2">
                Current Password
              </label>
              <div className="relative">
                <input
                  type={showPasswords.current ? "text" : "password"}
                  id="currentPassword"
                  name="currentPassword"
                  value={passwordData.currentPassword}
                  onChange={handlePasswordInputChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 pr-12 ${
                    errors.password.currentPassword ? "border-red-500" : "border-gray-300"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility("current")}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  aria-label={showPasswords.current ? "Hide password" : "Show password"}
                >
                  {showPasswords.current ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {errors.password.currentPassword && (
                <p className="mt-1 text-sm text-red-600">{errors.password.currentPassword}</p>
              )}
            </div>

            <div>
              <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-2">
                New Password
              </label>
              <div className="relative">
                <input
                  type={showPasswords.new ? "text" : "password"}
                  id="newPassword"
                  name="newPassword"
                  value={passwordData.newPassword}
                  onChange={handlePasswordInputChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 pr-12 ${
                    errors.password.newPassword ? "border-red-500" : "border-gray-300"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility("new")}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  aria-label={showPasswords.new ? "Hide password" : "Show password"}
                >
                  {showPasswords.new ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {errors.password.newPassword && <p className="mt-1 text-sm text-red-600">{errors.password.newPassword}</p>}
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                Confirm New Password
              </label>
              <div className="relative">
                <input
                  type={showPasswords.confirm ? "text" : "password"}
                  id="confirmPassword"
                  name="confirmPassword"
                  value={passwordData.confirmPassword}
                  onChange={handlePasswordInputChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 pr-12 ${
                    errors.password.confirmPassword || errors.password.match ? "border-red-500" : "border-gray-300"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility("confirm")}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  aria-label={showPasswords.confirm ? "Hide password" : "Show password"}
                >
                  {showPasswords.confirm ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
             {errors.password.currentPassword && (
                <p className="mt-1 text-sm text-red-600">{errors.password.currentPassword}</p>
                )}
                {errors.password.newPassword && (
                <p className="mt-1 text-sm text-red-600">{errors.password.newPassword}</p>
                )}
                {errors.password.confirmPassword && (
                <p className="mt-1 text-sm text-red-600">{errors.password.confirmPassword}</p>
                )}
                {errors.password.match && (
                <p className="mt-1 text-sm text-red-600">{errors.password.match}</p>
                )}
            </div>

            <button
              onClick={handlePasswordChange}
              className="flex items-center justify-center w-full px-6 py-3  bg-gradient-to-r from-green-500 to-teal-600 text-white font-medium rounded-lg hover:from-green-600 hover:to-teal-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all duration-200 shadow-md hover:shadow-lg"
            >
              Change Password
            </button>
          </div>
        </div>
      </div>
    </div>

  );
}

export default ClientProfile