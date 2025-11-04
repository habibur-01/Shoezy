import React from "react";

const ProfileDetails = () => {
  return (
    <div className="flex-1 bg-[var(--color-background)] shadow-all rounded-xl px-16 py-12">
      <h2 className="text-red-500 font-semibold mb-6 text-lg">Edit Your Profile</h2>

      <form className="space-y-6">
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-sm text-gray-700 mb-1">First Name</label>
            <input
              type="text"
              defaultValue="Md"
              className="w-full bg-[var(--color-gray)] rounded-md px-3 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-red-400"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-700 mb-1">Last Name</label>
            <input
              type="text"
              defaultValue="Rimel"
              className="w-full bg-[var(--color-gray)] rounded-md px-3 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-red-400"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-sm text-gray-700 mb-1">Email</label>
            <input
              type="email"
              defaultValue="rimel111@gmail.com"
              className="w-full bg-[var(--color-gray)] rounded-md px-3 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-red-400"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-700 mb-1">Address</label>
            <input
              type="text"
              defaultValue="Kingston, 5236, United State"
              className="w-full bg-[var(--color-gray)] rounded-md px-3 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-red-400"
            />
          </div>
        </div>

        <div className="pt-2 ">
          <label className="block text-sm text-gray-700 mb-2">Password Changes</label>
          <input
            type="password"
            placeholder="Current Password"
            className="w-full bg-[var(--color-gray)] rounded-md px-3 py-3 mb-3 text-sm focus:outline-none focus:ring-1 focus:ring-red-400"
          />
          <input
            type="password"
            placeholder="New Password"
            className="w-full bg-[var(--color-gray)] rounded-md px-3 py-3 mb-3 text-sm focus:outline-none focus:ring-1 focus:ring-red-400"
          />
          <input
            type="password"
            placeholder="Confirm New Password"
            className="w-full bg-[var(--color-gray)] rounded-md px-3 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-red-400"
          />
        </div>

        <div className="flex justify-end space-x-3 pt-6">
          <button
            type="button"
            className="px-6 py-2 text-gray-600 border border-gray-300 rounded-md text-sm hover:bg-gray-100 h-10"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="btn-red"
          >
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProfileDetails;
