import type React from "react"
import { useEffect, useState } from "react"
import VendorLayout from "../VendorLayout"
import toast from "react-hot-toast"
import { uploadImageCloudinary } from "@/utils/cloudinary/cloudinary"
import { vendorService } from "@/services/vendorServices"
import { validateVendorProfileForm, validatePasswordForm, type PasswordErrors, type VendorProfileErrors } from "@/utils/validations/profile-update.validation"

interface ProfileData {
  username: string
  email: string
  phone: string
  companyName: string
  companyAddress: string
  description: string
  status?: string
  avatar?: string
  banner?: string
  idProof?: string
  createdAt?: Date
}

interface PasswordData {
  currentPassword: string
  newPassword: string
  confirmPassword: string
}

const VendorProfile: React.FC = () => {
  const [profileData, setProfileData] = useState<ProfileData>({
    username: "",
    email: "",
    phone: "",
    companyName: "",
    companyAddress: "",
    description:"",
  })

  const [passwordData, setPasswordData] = useState<PasswordData>({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })

    const [errors, setErrors] = useState<{
    profile: VendorProfileErrors;
    password: PasswordErrors;
    }>({
    profile: {
    username: "",
    email: "",
    phone: "",
    idProof:"",
    },
    password: {},
    });

  const [showPasswords, setShowPasswords] = useState({
  current: false,
  new: false,
  confirm: false
})  
  const [avatarUrl, setAvatarUrl] = useState<string>()
  const [bannerUrl, setBannerUrl] = useState<string>()
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [bannerFile, setBannerFile] = useState<File | null>(null);
  const [idProofFile, setIdProofFile] = useState<File | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(false)

  useEffect(()=>{
    fetchProfileData();
  },[])

const fetchProfileData = async () => {
    try{
       const response = await vendorService.getSingleUser();
       const data = response.data;
       console.log("Profile data fetched:", response.data);
       setProfileData({
        username: data.username || "",
        email: data.email || "",
        phone: data.phone || "",
        companyName: data.companyName || "", 
        companyAddress: data.companyAddress || "",
        description: data.description || "",
        status: data.status,
        avatar: data.avatar,
        banner: data.banner,
        idProof: data.idProof,
        createdAt: data.createdAt,
       });

       setAvatarUrl(data.avatar || "");
       setBannerUrl(data.banner || "");

        if (data.idProof) {
      setIdProofFile(null);
      }

    }catch(error){
        console.error("Error fetching profile data:", error)
        toast.error("Failed to load profile data. Please try again later.")
    }
}

  const handleProfileChange = (field: keyof ProfileData, value: string) => {
    setProfileData((prev) => ({ ...prev, [field]: value }))

    if (errors.profile[field as keyof VendorProfileErrors]) {
    setErrors((prev) => ({
      ...prev,
      profile: {
        ...prev.profile,
        [field]: ""
      }
    }))
  }
  }

  const handleBannerChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  const file = event.target.files?.[0]
  if (file) {
    setBannerUrl(URL.createObjectURL(file));
    setBannerFile(file);
  }
}

const handleIdProofChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  const file = event.target.files?.[0]
  if (file) {
    setIdProofFile(file)
    console.log("Selected ID Proof:", file.name)

     if (errors.profile.idProof) {
      setErrors((prev) => ({
        ...prev,
        profile: {
          ...prev.profile,
          idProof: ""
        }
      }))
    }
  }
}

  const handlePasswordChange = (field: keyof PasswordData, value: string) => {
    setPasswordData((prev) => ({ ...prev, [field]: value }))

     if (errors.password[field as keyof PasswordErrors] || errors.password.match) {
    setErrors((prev) => ({
      ...prev,
      password: {
        ...prev.password,
        [field]: "",
        match: field === 'confirmPassword' || field === 'newPassword' ? "" : prev.password.match
      }
    }))
  }
  }

  const handleSaveProfile = async() => {
    setIsLoading(true);
    try{
        const validation = validateVendorProfileForm(profileData);
        if (!validation.isValid) {
          setErrors(prev => ({ ...prev, profile: validation.errors }));
          toast("Please fix form errors", { icon: "⚠️" });
          return;
        }

       if (avatarFile) profileData.avatar = await uploadImageCloudinary(avatarFile);
       if (bannerFile) profileData.banner = await uploadImageCloudinary(bannerFile);
       if (idProofFile) profileData.idProof = await uploadImageCloudinary(idProofFile);

        const response = await vendorService.updateProfile(profileData);
        console.log("Profile update response:", response.data)
        if(response.success) {
          toast.success("Profile updated successfully!")
          setProfileData(response.data)
          fetchProfileData(); 
        } else {
          toast.error("Failed to update profile. Please try again.")
          console.error("Profile update failed:", response.message)
        }
    }catch(error){
      console.error("Error saving profile:", error)
      toast.error("Failed to save profile. Please try again later.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleUpdatePassword = async() => {
     try {
       const passwordErrors = validatePasswordForm(passwordData);
        if (Object.keys(passwordErrors).length > 0) {
          setErrors(prev => ({ ...prev, password: passwordErrors }));
          toast("Please fix password validation errors", { icon: "⚠️" });
          return;
        }
        const response = await vendorService.updatePassword(passwordData.currentPassword,passwordData.newPassword);
        console.log("Password change response:", response.data);
        if(response.success){
        toast.success("Password changed successfully!");
         setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
        })

         setErrors(prev => ({ ...prev, password: {} }));
        }else{
          toast.error(response.message);
        }
     } catch (error:any) {
       console.error("Error changing password:", error);
        const errorMessage = error.response?.data?.message;
         toast.error(errorMessage);
     }
  }

  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
        setAvatarUrl(URL.createObjectURL(file));
        setAvatarFile(file);
    }
  }

  const togglePasswordVisibility = (field: 'current' | 'new' | 'confirm') => {
  setShowPasswords(prev => ({
    ...prev,
    [field]: !prev[field]
  }))
}

  return (
     <VendorLayout
      notificationCount={5}
      backgroundClass="bg-black"
    >
    <div className="min-h-screen bg-gray-50">
      {/* Banner Section */}
      <div className="pt-16 px-4 sm:px-6 lg:px-16">  
      <div className="relative h-58 bg-gradient-to-r from-blue-600 to-purple-600 w-full mt-1 rounded-lg shadow-lg overflow-hidden">
           <img
            src={bannerUrl}
            alt=""
            className="absolute inset-0 w-full h-full object-cover"
            onError={(e) => {
              const target = e.target as HTMLImageElement
              target.src = ""
            }}
          />
        <div className="absolute inset-0 bg-black/20" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full relative">
          <button className="absolute top-4 right-4 bg-white/90 hover:bg-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
              />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            Change Banner
            <input
              type="file"
              accept="image/*"
              onChange={handleBannerChange}
              className="absolute inset-0 opacity-0 cursor-pointer"
            />
          </button>
        </div>
      </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 relative z-10">
        {/* Avatar Section */}
        <div className="flex items-end space-x-4 mb-8">
          <div className="relative">
            <div className="w-32 h-32 rounded-full border-4 border-white shadow-lg overflow-hidden bg-gray-200">
              <img
                src={avatarUrl || "/placeholder.svg"}
                alt="Vendor Avatar"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
                crossOrigin="anonymous"
                onError={(e) => {
                  const target = e.target as HTMLImageElement
                  target.src =
                    "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTI4IiBoZWlnaHQ9IjEyOCIgdmlld0JveD0iMCAwIDEyOCAxMjgiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMjgiIGhlaWdodD0iMTI4IiBmaWxsPSIjRjNGNEY2Ii8+Cjx0ZXh0IHg9IjY0IiB5PSI3NCIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjI0IiBmaWxsPSIjNkI3MjgwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5WTjwvdGV4dD4KPC9zdmc+"
                }}
              />
            </div>
            <label className="absolute -bottom-2 -right-2 w-8 h-8 bg-blue-600 hover:bg-blue-700 rounded-full flex items-center justify-center cursor-pointer transition-colors">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              <input type="file" accept="image/*" onChange={handleAvatarChange} className="hidden" />
            </label>
          </div>
          <div className="pb-4">
            <h1 className="text-3xl font-bold text-gray-900">Vendor Profile</h1>
            <p className="text-gray-600">Manage your vendor information and settings</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Information Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 w-full">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900">Profile Information</h2>
                <p className="text-gray-600 mt-1">Update your vendor profile details and business information</p>
              </div>
              <div className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                      Username
                    </label>
                    <input
                      id="username"
                      type="text"
                      value={profileData.username}
                      onChange={(e) => handleProfileChange("username", e.target.value)}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter username"
                    />
                    {errors.profile.username && (
                          <p className="text-sm text-red-600">{errors.profile.username}</p>
                        )}
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                      Email
                    </label>
                    <input
                      id="email"
                      type="email"
                      value={profileData.email}
                      onChange={(e) => handleProfileChange("email", e.target.value)}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="vendor@example.com"
                    />
                    {errors.profile.email && (
                        <p className="text-sm text-red-600">{errors.profile.email}</p>
                      )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                      Phone Number
                    </label>
                    <input
                      id="phone"
                      type="tel"
                      value={profileData.phone}
                      onChange={(e) => handleProfileChange("phone", e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="+1 (555) 123-4567"
                    />
                    {errors.profile.phone && (
                        <p className="text-sm text-red-600">{errors.profile.phone}</p>
                      )}
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="company" className="block text-sm font-medium text-gray-700">
                      Company Name
                    </label>
                    <input
                      id="company"
                      type="text"
                      value={profileData.companyName}
                      onChange={(e) => handleProfileChange("companyName", e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Your Company Ltd."
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                    Company Address
                  </label>
                  <textarea
                    id="address"
                    value={profileData.companyAddress}
                    onChange={(e) => handleProfileChange("companyAddress", e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    placeholder="Enter complete company address"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                    Business Description
                  </label>
                  <textarea
                    id="description"
                    value={profileData.description}
                    onChange={(e) => handleProfileChange("description", e.target.value)}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    placeholder="Describe your business, services, and expertise"
                  />
                </div>

            <div className="space-y-2">
                <label htmlFor="idproof" className="block text-sm font-medium text-gray-700">
                  ID Proof Document
                </label>

                <div className="flex items-center space-x-2">
                  <input
                    id="idproof"
                    type="file"
                    accept="image/*,.pdf"
                    onChange={handleIdProofChange}
                    className="hidden"
                  />

                  <label
                    htmlFor="idproof"
                    className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors flex items-center gap-2 cursor-pointer"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                      />
                    </svg>
                    Upload
                  </label>

                  {idProofFile ? (
                    <span className="text-sm text-gray-600">{idProofFile.name}</span>
                  ) : profileData.idProof ? (
                    <a
                      href={profileData.idProof}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-blue-600 underline"
                    >
                      View Current Document
                    </a>
                  ) : (
                    <span className="text-sm text-gray-500">No document uploaded</span>
                  )}
                  {errors.profile.idProof && (
                      <p className="text-sm text-red-600">{errors.profile.idProof}</p>
                    )}
                </div>

                <p className="text-sm text-gray-500">Upload a valid government-issued ID</p>
              </div>
               <button
                onClick={handleSaveProfile}
                disabled={isLoading}
                className={`w-full md:w-auto px-6 py-2 rounded-md transition-colors font-medium ${
                  isLoading
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                {isLoading ? 'Updating...' : 'Save Profile'}
              </button>
              </div>
            </div>
          </div>

          {/* Change Password Section */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 w-full">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900">Change Password</h2>
                <p className="text-gray-600 mt-1">Update your account password for security</p>
              </div>
              <div className="p-6 space-y-4">
                <div className="space-y-2">
                  <label htmlFor="current-password" className="block text-sm font-medium text-gray-700">
                    Current Password
                  </label>
                  <div className="relative">
                    <input
                      id="current-password"
                      type={showPasswords.current ? "text" : "password"}
                      value={passwordData.currentPassword}
                      onChange={(e) => handlePasswordChange("currentPassword", e.target.value)}
                      className="w-full px-4 py-2.5 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter current password"
                    />
                    <button
                      type="button"
                      onClick={() => togglePasswordVisibility('current')}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    >
                      {showPasswords.current ? (
                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                        </svg>
                      ) : (
                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      )}
                    </button>
                  </div>
                  {errors.password.currentPassword && (
                    <p className="text-sm text-red-600">{errors.password.currentPassword}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <label htmlFor="new-password" className="block text-sm font-medium text-gray-700">
                    New Password
                  </label>
                  <div className="relative">
                    <input
                      id="new-password"
                      type={showPasswords.new ? "text" : "password"}
                      value={passwordData.newPassword}
                      onChange={(e) => handlePasswordChange("newPassword", e.target.value)}
                      className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter new password"
                    />
                    <button
                      type="button"
                      onClick={() => togglePasswordVisibility('new')}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    >
                      {showPasswords.new ? (
                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                        </svg>
                      ) : (
                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      )}
                    </button>
                  </div>
                  {errors.password.newPassword && (
                    <p className="text-sm text-red-600">{errors.password.newPassword}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700">
                    Confirm New Password
                  </label>
                  <div className="relative">
                    <input
                      id="confirm-password"
                      type={showPasswords.confirm ? "text" : "password"}
                      value={passwordData.confirmPassword}
                      onChange={(e) => handlePasswordChange("confirmPassword", e.target.value)}
                      className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Confirm new password"
                    />
                    <button
                      type="button"
                      onClick={() => togglePasswordVisibility('confirm')}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    >
                      {showPasswords.confirm ? (
                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                        </svg>
                      ) : (
                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      )}
                    </button>
                  </div>
                  {errors.password.confirmPassword && (
                    <p className="text-sm text-red-600">{errors.password.confirmPassword}</p>
                  )}
                  {errors.password.match && (
                    <p className="text-sm text-red-600">{errors.password.match}</p>
                  )}
                </div>

                <div className="text-sm text-gray-500 space-y-1">
                  <p>Password requirements:</p>
                  <ul className="list-disc list-inside space-y-1 text-xs">
                    <li>At least 8 characters long</li>
                    <li>Include atleast one uppercase letter</li>
                    <li>Include at least one digit</li>
                    <li>Include at least one special character (@$!%*?&)</li>
                  </ul>
                </div>

                <button
                  onClick={handleUpdatePassword}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors font-medium"
                >
                  Update Password
                </button>
              </div>
            </div>

            {/* Quick Stats Card */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Account Status</h3>
              </div>
              <div className="p-6 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Verification Status</span>
                  <span className="text-sm font-medium text-green-600">{profileData.status?.toUpperCase()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Member Since</span>
                  <span className="text-sm font-medium">{profileData.createdAt
                                                          ? new Date(profileData.createdAt).toLocaleDateString('en-US', {
                                                              month: 'short',
                                                              day: '2-digit',
                                                              year: 'numeric'
                                                            }).replace(',', '')
                                                          : 'N/A'}
                                                        </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    </VendorLayout>
  )
}

export default VendorProfile
