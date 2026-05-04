import { useEffect, useState } from "react"
import { useAuth } from "../../../shared/hooks/useAuth"

export default function ProfileViewComplete() {
  const { userId } = useAuth()

  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [activeTab, setActiveTab] = useState("info")
  
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState(" ")
  const [confirmPassword, setConfirmPassword] = useState("")
  
  const [savingProfile, setSavingProfile] = useState(false)
  const [savingPassword, setSavingPassword] = useState(false)
  const [uploadingPhoto, setUploadingPhoto] = useState(false)
  const [message, setMessage] = useState("")

  // Fetch profile on mount
  useEffect(() => {
    if (!userId) return
    const fetchProfile = async () => {
      setLoading(true)
      setError("")
      try {
        const response = await fetch(`http://localhost:8080/api/users/${userId}/profile`)
        if (!response.ok) throw new Error("Failed to load profile")
        const data = await response.json()
        setProfile(data)
        setName(data.name || "")
        setEmail(data.email || "")
      } catch {
        setError("Unable to load profile")
      } finally {
        setLoading(false)
      }
    }
    fetchProfile()
  }, [userId])

  const handleSaveProfile = async (e) => {
    e.preventDefault()
    setSavingProfile(true)
    setError("")
    try {
      const response = await fetch(`http://localhost:8080/api/users/${userId}/profile`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email })
      })
      if (!response.ok) throw new Error("Failed to update")
      setProfile(prev => ({ ...prev, name, email }))
      setMessage("Profile updated successfully!")
      setTimeout(() => setMessage(""), 3000)
    } catch {
      setError("Failed to update profile")
    } finally {
      setSavingProfile(false)
    }
  }

  const handleChangePassword = async (e) => {
    e.preventDefault()
    if (newPassword !== confirmPassword) {
      setError("Passwords don't match")
      return
    }
    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters")
      return
    }
    
    setSavingPassword(true)
    setError("")
    try {
      const response = await fetch(`http://localhost:8080/api/users/${userId}/password`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword })
      })
      if (!response.ok) throw new Error("Failed to change password")
      setCurrentPassword("")
      setNewPassword("")
      setConfirmPassword("")
      setMessage("Password changed successfully!")
      setTimeout(() => setMessage(""), 3000)
    } catch {
      setError("Failed to change password")
    } finally {
      setSavingPassword(false)
    }
  }

  const handlePhotoUpload = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    
    if (!file.type.includes("image")) {
      setError("Please select an image file")
      return
    }

    setUploadingPhoto(true)
    setError("")
    try {
      const formData = new FormData()
      formData.append("file", file)
      
      const response = await fetch(`http://localhost:8080/api/users/${userId}/photo`, {
        method: "POST",
        body: formData
      })
      if (!response.ok) throw new Error("Failed to upload ")
      
      setMessage("Photo uploaded successfully!")
      setTimeout(() => setMessage(""), 3000)
      
      // Refresh profile to show new photo
      const profileResponse = await fetch(`http://localhost:8080/api/users/${userId}/profile`)
      if (profileResponse.ok) {
        setProfile(await profileResponse.json())
      }
    } catch {
      setError("Failed to upload photo")
    } finally {
      setUploadingPhoto(false)
    }
  }

  if (!userId) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-slate-900">Please log in</h2>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 pt-20 px-4">
        <div className="max-w-2xl mx-auto text-center">Loading profile...</div>
      </div>
    )
  }

  const initials = profile?.name
    ? profile.name
        .split(" ")
        .map((p) => p[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "  ?"

  return (
    <div className="min-h-screen bg-slate-50 pt-20 pb-12">
      <div className="max-w-2xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900">My Profile</h1>
          <p className="text-slate-600 mt-2">Manage your account details and preferences</p>
        </div>

        {/* Alerts */}
        {message && (
          <div className="mb-6 rounded-xl bg-green-50 border border-green-200 p-4 text-sm text-green-700">
            {message}
          </div>
        )}
        {error && (
          <div className="mb-6 rounded-xl bg-red-50 border border-red-200 p-4 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* Profile Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8 mb-8">
          <div className="flex items-center gap-6">
            <div className="relative">
              <div className="h-20 w-20 rounded-full bg-blue-600 text-white font-bold text-xl flex items-center justify-center overflow-hidden flex-shrink-0">
                {profile?.photoUrl ? (
                  <img
                    src={`http://localhost:8080${profile.photoUrl}`}
                    alt="Profile"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  initials
                )}
              </div>
              <label className="absolute inset-0 rounded-full  cursor-pointer hover:bg-black/20 transition flex items-center justify-center">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  disabled={uploadingPhoto}
                  className="hidden"
                />
                <span className="text-white text-xs font-semibold opacity-0 hover:opacity-100">Change</span>
              </label>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-900">{profile?.name}</h2>
              <p className="text-slate-600">{profile?.email}</p>
              <p className="text-sm text-slate-500 mt-1">{profile?.role} account</p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-6 flex gap-2 border-b border-slate-200">
          <button
            onClick={() => setActiveTab("info")}
            className={`px-4 py-3 font-medium border-b-2 transition ${
              activeTab === "info"
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-slate-600 hover:text-slate-900"
            }`}
          >
            Account Info
          </button>
          <button
            onClick={() => setActiveTab("password")}
            className={`px-4 py-3 font-medium border-b-2 transition ${
              activeTab === "password"
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-slate-600 hover:text-slate-900"
            }`}
          >
            Security
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === "info" && (
          <form onSubmit={handleSaveProfile} className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8">
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <button
                type="submit"
                disabled={savingProfile}
                className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 font-medium transition"
              >
                {savingProfile ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>
        )}

        {activeTab === "password" && (
          <form onSubmit={handleChangePassword} className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8">
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Current Password</label>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">New Password</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Confirm Password</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={savingPassword}
                className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 font-medium transition"
              >
                {savingPassword ? "Updating..." : "Change Password"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
