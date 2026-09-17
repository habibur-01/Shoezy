import React, { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { updateProfile, updateAvatar, changePassword } from "../../server/auth/auth";
import { updateAuthUser } from "../../redux/features/auth/authSlice";
import { toast } from "react-toastify";
import { FaEye, FaEyeSlash, FaLock, FaCamera, FaPhone, FaUser, FaSpinner } from "react-icons/fa";

const ProfileDetails = () => {
  const user = useSelector((state) => state.auth.user);
  console.log("🚀 ~ ProfileDetails ~ user:", user)
  const dispatch = useDispatch();
  const fileInputRef = useRef(null);

  const [profileData, setProfileData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
  });

  const [isUpdatingAvatar, setIsUpdatingAvatar] = useState(false);

  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });

  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [isChangingPass, setIsChangingPass] = useState(false);
  const [showPass, setShowPass] = useState({ current: false, next: false, confirm: false });

  useEffect(() => {
    if (user) {
      setProfileData({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.email || "",
        phone: user.phone || "",
      });
    }
  }, [user]);

  const handleProfileChange = (e) => {
    setProfileData({ ...profileData, [e.target.name]: e.target.value });
  };

  const handlePasswordChange = (e) => {
    setPasswords({ ...passwords, [e.target.name]: e.target.value });
  };

  // Trigger Device Camera / File Picker
  const handleCameraClick = () => {
    if (isUpdatingAvatar) return;
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // Handle Photo Selection & Direct API Upload with Camera Loading Spinner
  const handleFileSelect = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size should be less than 5MB");
      return;
    }

    try {
      setIsUpdatingAvatar(true);
      const reader = new FileReader();
      reader.onload = async () => {
        const base64Data = reader.result;
        try {
          const result = await updateAvatar(base64Data);
          if (result?.data?.success) {
            dispatch(updateAuthUser(result.data.data));
            toast.success("Avatar photo updated successfully!");
          } else {
            toast.error(result?.data?.message || "Failed to update avatar photo");
          }
        } catch (error) {
          toast.error(error?.response?.data?.message || "Error uploading avatar photo");
        } finally {
          setIsUpdatingAvatar(false);
          if (fileInputRef.current) fileInputRef.current.value = "";
        }
      };
      reader.readAsDataURL(file);
    } catch (err) {
      setIsUpdatingAvatar(false);
      toast.error("Failed to process photo file");
    }
  };

  // Profile Details Update Handler (Excludes Email)
  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsSavingProfile(true);
      const { email, ...updatePayload } = profileData;

      const result = await updateProfile(updatePayload);
      if (result?.data?.success) {
        dispatch(updateAuthUser(result.data.data));
        toast.success("Profile details saved successfully!");
      } else {
        toast.error(result?.data?.message || "Failed to update profile");
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Error updating profile");
    } finally {
      setIsSavingProfile(false);
    }
  };

  // Password Change Handler
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (!passwords.currentPassword) {
      toast.error("Please enter your current password");
      return;
    }
    if (!passwords.newPassword || passwords.newPassword.length < 6) {
      toast.error("New password must be at least 6 characters");
      return;
    }
    if (passwords.newPassword !== passwords.confirmNewPassword) {
      toast.error("New passwords do not match");
      return;
    }

    try {
      setIsChangingPass(true);
      const result = await changePassword(
        passwords.currentPassword,
        passwords.newPassword
      );
      if (result?.data?.success) {
        toast.success("Password updated successfully!");
        setPasswords({
          currentPassword: "",
          newPassword: "",
          confirmNewPassword: "",
        });
      } else {
        toast.error(result?.data?.message || "Failed to change password");
      }
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to change password"
      );
    } finally {
      setIsChangingPass(false);
    }
  };

  const getUserInitials = () => {
    const f = profileData.firstName?.[0] || "";
    const l = profileData.lastName?.[0] || "";
    return (f + l).toUpperCase() || "U";
  };

  return (
    <div className="flex-1 bg-[var(--color-background)] shadow-all rounded-xl px-8 sm:px-16 py-12 space-y-10">
      
      {/* Hidden Device Photo Picker Input */}
      <input
        type="file"
        ref={fileInputRef}
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />

      {/* Header & Avatar Camera Card */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-6 p-6 rounded-2xl bg-stone-50 border border-stone-200/80">
        <div className="flex items-center space-x-5">
          <div
            className="relative group cursor-pointer"
            onClick={handleCameraClick}
            title="Click to take or select photo from device"
          >
            {user?.avatar ? (
              <img
                src={user.avatar}
                alt="Profile Avatar"
                className="w-20 h-20 rounded-full object-cover border-2 border-stone-300 shadow-sm transition-opacity group-hover:opacity-90"
              />
            ) : (
              <div className="w-20 h-20 rounded-full bg-stone-900 text-stone-50 font-bold text-2xl flex items-center justify-center border-2 border-stone-300 shadow-sm">
                {getUserInitials()}
              </div>
            )}
            
            {/* Camera Icon Button with Loading Spinner */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleCameraClick();
              }}
              disabled={isUpdatingAvatar}
              className="absolute bottom-0 right-0 p-2.5 bg-stone-900 hover:bg-stone-800 text-white rounded-full shadow-md transition-all cursor-pointer disabled:opacity-90 flex items-center justify-center ring-2 ring-white"
              title="Take photo from device"
            >
              {isUpdatingAvatar ? (
                <FaSpinner className="text-xs animate-spin text-amber-300" />
              ) : (
                <FaCamera className="text-xs" />
              )}
            </button>
          </div>

          <div>
            <h2 className="text-xl font-bold text-stone-900">
              {profileData.firstName} {profileData.lastName}
            </h2>
            <p className="text-xs text-stone-500 font-medium mt-0.5">{profileData.email}</p>
            <div className="flex items-center gap-2 mt-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-100 text-emerald-800 uppercase tracking-wider">
                {user?.role || "Customer"} Account
              </span>
              {user?.emailVerified && (
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-blue-100 text-blue-800 uppercase tracking-wider">
                  Verified Member
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Device Photo Upload Trigger Button */}
        <button
          type="button"
          onClick={handleCameraClick}
          disabled={isUpdatingAvatar}
          className="px-4 py-2.5 text-xs font-semibold text-stone-800 border border-stone-300 rounded-lg hover:bg-stone-100 transition cursor-pointer flex items-center gap-2 disabled:opacity-60 shadow-2xs"
        >
          {isUpdatingAvatar ? (
            <>
              <FaSpinner className="animate-spin text-xs text-amber-600" />
              <span>Uploading Photo...</span>
            </>
          ) : (
            <>
              <FaCamera className="text-xs text-stone-600" />
              <span>Take / Upload Photo</span>
            </>
          )}
        </button>
      </div>

      {/* Profile Form (Email Cannot Be Changed) */}
      <div>
        <h2 className="text-[var(--color-red,#db4444)] font-semibold mb-6 text-xl flex items-center gap-2">
          <FaUser className="text-base" />
          <span>Edit Your Profile Details</span>
        </h2>

        <form onSubmit={handleProfileSubmit} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1.5">
                First Name
              </label>
              <input
                type="text"
                name="firstName"
                value={profileData.firstName}
                onChange={handleProfileChange}
                className="w-full bg-[var(--color-gray,#f5f5f5)] rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-red-400 border border-stone-200"
                placeholder="First Name"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1.5">
                Last Name
              </label>
              <input
                type="text"
                name="lastName"
                value={profileData.lastName}
                onChange={handleProfileChange}
                className="w-full bg-[var(--color-gray,#f5f5f5)] rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-red-400 border border-stone-200"
                placeholder="Last Name"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Email Address — Strictly Disabled & Locked */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700">
                  Email Address
                </label>
                <span className="text-[11px] text-amber-700 font-semibold flex items-center gap-1">
                  <FaLock className="text-[10px]" />
                  <span>Locked</span>
                </span>
              </div>
              <div className="relative">
                <input
                  type="email"
                  name="email"
                  value={profileData.email}
                  disabled
                  readOnly
                  className="w-full bg-stone-100 rounded-lg px-4 py-3 text-sm text-stone-500 font-medium cursor-not-allowed border border-stone-200/90 shadow-inner"
                />
                <FaLock className="absolute right-3.5 top-1/2 -translate-y-1/2 text-stone-400 text-xs" />
              </div>
              <p className="text-[11px] text-amber-700 mt-1 font-medium">
                Email address is permanently associated with your account and cannot be modified.
              </p>
            </div>

            {/* Phone Number — Triggers OTP Verification Requirement at Checkout if changed */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1.5">
                Phone Number
              </label>
              <div className="relative">
                <input
                  type="tel"
                  name="phone"
                  value={profileData.phone}
                  onChange={handleProfileChange}
                  className="w-full bg-[var(--color-gray,#f5f5f5)] rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-red-400 border border-stone-200"
                  placeholder="+1 234 567 890"
                />
                <FaPhone className="absolute right-3.5 top-1/2 -translate-y-1/2 text-stone-400 text-xs" />
              </div>
              <p className="text-[11px] text-stone-500 mt-1 leading-normal">
                Updating your phone number will require OTP verification when proceeding to checkout.
              </p>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={isSavingProfile}
              className="btn-red px-6 py-2.5 rounded-lg font-medium text-sm transition shadow-sm hover:shadow cursor-pointer disabled:opacity-70"
            >
              {isSavingProfile ? "Saving Profile..." : "Save Profile Details"}
            </button>
          </div>
        </form>
      </div>

      {/* Divider */}
      <hr className="border-gray-200" />

      {/* Password Changes Form */}
      <form onSubmit={handlePasswordSubmit} className="space-y-4">
        <h3 className="text-base font-semibold text-gray-900 mb-2">
          Password Changes
        </h3>

        <div className="relative">
          <input
            type={showPass.current ? "text" : "password"}
            name="currentPassword"
            placeholder="Current Password"
            value={passwords.currentPassword}
            onChange={handlePasswordChange}
            className="w-full bg-[var(--color-gray,#f5f5f5)] rounded-lg px-4 py-3 pr-11 text-sm focus:outline-none focus:ring-1 focus:ring-red-400 border border-stone-200"
          />
          <button
            type="button"
            onClick={() => setShowPass({ ...showPass, current: !showPass.current })}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1 cursor-pointer"
          >
            {showPass.current ? <FaEyeSlash /> : <FaEye />}
          </button>
        </div>

        <div className="relative">
          <input
            type={showPass.next ? "text" : "password"}
            name="newPassword"
            placeholder="New Password (min 6 characters)"
            value={passwords.newPassword}
            onChange={handlePasswordChange}
            className="w-full bg-[var(--color-gray,#f5f5f5)] rounded-lg px-4 py-3 pr-11 text-sm focus:outline-none focus:ring-1 focus:ring-red-400 border border-stone-200"
          />
          <button
            type="button"
            onClick={() => setShowPass({ ...showPass, next: !showPass.next })}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1 cursor-pointer"
          >
            {showPass.next ? <FaEyeSlash /> : <FaEye />}
          </button>
        </div>

        <div className="relative">
          <input
            type={showPass.confirm ? "text" : "password"}
            name="confirmNewPassword"
            placeholder="Confirm New Password"
            value={passwords.confirmNewPassword}
            onChange={handlePasswordChange}
            className="w-full bg-[var(--color-gray,#f5f5f5)] rounded-lg px-4 py-3 pr-11 text-sm focus:outline-none focus:ring-1 focus:ring-red-400 border border-stone-200"
          />
          <button
            type="button"
            onClick={() => setShowPass({ ...showPass, confirm: !showPass.confirm })}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1 cursor-pointer"
          >
            {showPass.confirm ? <FaEyeSlash /> : <FaEye />}
          </button>
        </div>

        <div className="flex justify-end space-x-3 pt-4">
          <button
            type="button"
            onClick={() =>
              setPasswords({
                currentPassword: "",
                newPassword: "",
                confirmNewPassword: "",
              })
            }
            className="px-6 py-2.5 text-gray-600 border border-gray-300 rounded-lg text-sm hover:bg-gray-100 cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isChangingPass}
            className="btn-red px-6 py-2.5 rounded-lg font-medium text-sm transition shadow-sm hover:shadow cursor-pointer disabled:opacity-70"
          >
            {isChangingPass ? "Updating Password..." : "Update Password"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProfileDetails;
