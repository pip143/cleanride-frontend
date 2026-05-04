import { useEffect, useState } from "react"
import { useAuth } from "../../../shared/hooks/useAuth"
import { useToast } from "../../../shared/hooks/useToast"
import { ProfilePresenter } from "../index"
import { LoadingSpinner } from "../../../components/LoadingSpinner"
import { validatePassword } from "../../../core/utils/validation"

export default function ProfileView() {
  const { userId } = useAuth()
  const { showToast } = useToast()

  const [state, setState] = useState({
    profile: null,
    loading: true,
    error: null,
    photoPreview: null,
  })

  const [activeTab, setActiveTab] = useState("info")
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phonenumber: "",
  })
  const [passwordData, setPasswordData] = useState({
    current: "",
    new: "",
    confirm: "",
  })
  const [saving, setSaving] = useState(false)

  const loadProfile = async () => {
    setState((prev) => ({ ...prev, loading: true, error: null }))
    const result = await ProfilePresenter.loadProfile(userId)

    if (result.success) {
      setState((prev) => ({
        ...prev,
        profile: result.data,
        loading: false,
      }))
    } else {
      setState((prev) => ({
        ...prev,
        error: result.error,
        loading: false,
      }))
      showToast(result.error, "error")
    }
  }

  useEffect(() => {
    if (!userId) {
      setState((prev) => ({ ...prev, error: "User not logged in" }))
      return
    }
    loadProfile()
  }, [userId])

  // Sync formData when profile loads
  useEffect(() => {
    if (state.profile) {
      setFormData({
        name: state.profile.name || "",
        email: state.profile.email || "",
        phonenumber: state.profile.phonenumber || "",
      })
    }
  }, [state.profile])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handlePasswordChange = (e) => {
    const { name, value } = e.target
    setPasswordData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSaveProfile = async () => {
    setSaving(true)
    const result = await ProfilePresenter.updateProfile(userId, {
      name: formData.name,
      email: formData.email,
      phonenumber: formData.phonenumber,
    })

    if (result.success) {
      showToast("Profile updated successfully", "success")
      loadProfile()
    } else {
      showToast(result.error, "error")
    }
    setSaving(false)
  }

  const handleChangePassword = async () => {
    if (passwordData.new !== passwordData.confirm) {
      showToast("Passwords do not match", "error")
      return
    }

    const validation = validatePassword(passwordData.new)
    if (validation) {
      showToast(validation, "error")
      return
    }

    setSaving(true)
    const result = await ProfilePresenter.updatePassword(
      userId,
      passwordData.current,
      passwordData.new
    )

    if (result.success) {
      showToast("Password updated successfully", "success")
      setPasswordData({ current: "", new: "", confirm: "" })
    } else {
      showToast(result.error, "error")
    }
    setSaving(false)
  }

  const handlePhotoUpload = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Preview
    const reader = new FileReader()
    reader.onloadend = () => {
      setState((prev) => ({ ...prev, photoPreview: reader.result }))
    }
    reader.readAsDataURL(file)

    // Upload
    setSaving(true)
    const result = await ProfilePresenter.uploadPhoto(userId, file)

    if (result.success) {
      showToast("Photo uploaded successfully", "success")
      // Reload profile to get updated photo URL
      loadProfile()
    } else {
      showToast(result.error, "error")
      setState((prev) => ({ ...prev, photoPreview: null }))
    }
    setSaving(false)
  }

  if (state.loading) return <LoadingSpinner />

  const displayPhoto = state.photoPreview || state.profile?.photoUrl

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-8">
        <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
        <p className="text-gray-600 mt-1">Manage your account settings</p>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-8">
        {state.error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-800">
            {state.error}
          </div>
        )}

        {/* Main Content */}
        <div className="grid md:grid-cols-3 gap-6">
          {/* Sidebar */}
          <div className="md:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="text-center mb-6">
                <div className="w-20 h-20 mx-auto bg-blue-100 rounded-full flex items-center justify-center text-2xl overflow-hidden">
                  {displayPhoto ? (
                    <img src={displayPhoto} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    "👤"
                  )}
                </div>
                <h3 className="mt-4 font-semibold text-gray-900">{formData.name || "User"}</h3>
                <p className="text-sm text-gray-600">{formData.email}</p>
              </div>

              <div className="space-y-2">
                <button
                  onClick={() => setActiveTab("info")}
                  className={`w-full text-left px-4 py-2 rounded-lg transition ${
                    activeTab === "info"
                      ? "bg-blue-50 text-blue-600 font-medium"
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  Account Info
                </button>
                <button
                  onClick={() => setActiveTab("password")}
                  className={`w-full text-left px-4 py-2 rounded-lg transition ${
                    activeTab === "password"
                      ? "bg-blue-50 text-blue-600 font-medium"
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  Security
                </button>
                <button
                  onClick={() => setActiveTab("photo")}
                  className={`w-full text-left px-4 py-2 rounded-lg transition ${
                    activeTab === "photo"
                      ? "bg-blue-50 text-blue-600 font-medium"
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  Profile Photo
                </button>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="md:col-span-2">
            {/* Account Info Tab */}
            {activeTab === "info" && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Account Information</h2>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      name="phonenumber"
                      value={formData.phonenumber}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <button
                    onClick={handleSaveProfile}
                    disabled={saving}
                    className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium disabled:opacity-50"
                  >
                    {saving ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              </div>
            )}

            {/* Password Tab */}
            {activeTab === "password" && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Change Password</h2>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Current Password
                    </label>
                    <input
                      type="password"
                      name="current"
                      value={passwordData.current}
                      onChange={handlePasswordChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      New Password (min 6 characters)
                    </label>
                    <input
                      type="password"
                      name="new"
                      value={passwordData.new}
                      onChange={handlePasswordChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Confirm Password
                    </label>
                    <input
                      type="password"
                      name="confirm"
                      value={passwordData.confirm}
                      onChange={handlePasswordChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <button
                    onClick={handleChangePassword}
                    disabled={saving}
                    className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium disabled:opacity-50"
                  >
                    {saving ? "Updating..." : "Update Password"}
                  </button>
                </div>
              </div>
            )}

            {/* Photo Tab */}
            {activeTab === "photo" && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Profile Photo</h2>

                <div className="text-center">
                  <div className="w-32 h-32 mx-auto bg-blue-100 rounded-full flex items-center justify-center text-5xl mb-6 overflow-hidden">
                    {displayPhoto ? (
                      <img src={displayPhoto} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                      "👤"
                    )}
                  </div>

                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    disabled={saving}
                    className="hidden"
                    id="photo-upload"
                  />
                  <label
                    htmlFor="photo-upload"
                    className="inline-block px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium cursor-pointer disabled:opacity-50"
                  >
                    {saving ? "Uploading..." : "Choose Photo"}
                  </label>
                  <p className="text-sm text-gray-600 mt-4">JPG or PNG, max 5MB</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
