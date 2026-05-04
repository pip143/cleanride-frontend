# CleanRide Frontend - MVP Architecture
## Phase 1: Core Infrastructure ✅ COMPLETED

### 📁 Project Structure

```
src/
├── core/                          # Core application infrastructure
│   ├── api/
│   │   ├── axiosInstance.js      # Axios instance with interceptors
│   │   └── index.js
│   ├── routes/
│   │   ├── AppRouter.jsx         # Main routing configuration
│   │   ├── ProtectedRoute.jsx    # Auth-protected route wrapper
│   │   └── index.js
│   ├── utils/
│   │   ├── helpers.js            # Utility functions (date, currency, etc)
│   │   ├── errorHandling.js      # Error handling utilities
│   │   └── index.js
│   ├── context/                   # Auth context (existing)
│   └── index.js
│
├── features/                       # Feature modules (MVP structure)
│   ├── dashboard/
│   │   ├── model/                 # API calls only
│   │   ├── presenter/             # Business logic only
│   │   ├── view/                  # React components only
│   │   └── index.js
│   ├── services/                  # Car wash services
│   │   ├── model/
│   │   ├── presenter/
│   │   ├── view/
│   │   └── index.js
│   ├── bookings/                  # Booking management
│   │   ├── model/
│   │   ├── presenter/
│   │   ├── view/                  # BookingsListView, BookingFormView
│   │   └── index.js
│   ├── vehicles/                  # User vehicles
│   │   ├── model/
│   │   ├── presenter/
│   │   ├── view/                  # VehiclesListView, VehicleFormView
│   │   └── index.js
│   ├── profile/                   # User profile
│   │   ├── model/
│   │   ├── presenter/
│   │   ├── view/
│   │   └── index.js
│   ├── reviews/                   # Service reviews
│   │   ├── model/
│   │   ├── presenter/
│   │   ├── view/                  # ReviewFormView
│   │   └── index.js
│   └── index.js
│
├── shared/                        # Shared code
│   ├── hooks/
│   │   ├── useAuth.js             # Auth context hook
│   │   ├── useLoading.js          # Loading state management
│   │   └── index.js
│   ├── components/
│   │   └── index.js               # Component exports
│   ├── layouts/
│   │   └── MainLayout.jsx         # Main app layout
│   └── index.js
│
├── components/                    # Legacy/common components (existing)
│   ├── LoadingSpinner.jsx
│   ├── Card.jsx
│   ├── Toast.jsx
│   ├── Navigation.jsx
│   ├── Icons.jsx
│   └── ProtectedRoute.jsx
│
├── services/                      # Service layer (existing, now uses core/api)
│   ├── api.js                     # Re-exports from core/api/axiosInstance
│   ├── authService.js
│   ├── bookingService.js
│   ├── reviewService.js
│   ├── serviceService.js
│   ├── userService.js
│   └── vehicleService.js
│
├── pages/                         # Page components (legacy, phased out)
│   ├── Login.jsx
│   ├── Register.jsx
│   └── ... (old pages)
│
├── App.jsx                        # Main app component
├── main.jsx
└── styles/                        # CSS files
```

---

## 🏗️ MVP Architecture Pattern

Each feature follows strict MVP (Model-Presenter-View) separation:

### **MODEL** (`model/`)
- **Responsibility**: API calls only
- **No React hooks**: ❌
- **No business logic**: ❌
- **No JSX**: ❌
- **Example**:
```javascript
const dashboardModel = {
  async getUserProfile(userId) {
    const response = await axiosInstance.get(`/api/users/${userId}/profile`)
    return response.data
  }
}
```

### **PRESENTER** (`presenter/`)
- **Responsibility**: Business logic & data transformation
- **Calls model functions**: ✅
- **Manages state transformation**: ✅
- **No JSX**: ❌
- **No direct React hooks in class**: ✅ (but can be used in hooks exported)
- **Example**:
```javascript
class DashboardPresenter {
  async loadData(userId) {
    const stats = await dashboardModel.getStats(userId)
    return {
      success: true,
      data: this.transformStats(stats)
    }
  }

  transformStats(stats) {
    return { ...stats, display: this.format(stats) }
  }
}
```

### **VIEW** (`view/`)
- **Responsibility**: React component & UI rendering only
- **No direct API calls**: ❌
- **Calls presenter functions**: ✅
- **Uses presenter state**: ✅
- **JSX only**: ✅
- **Example**:
```javascript
export default function DashboardView() {
  const [data, setData] = useState(null)

  useEffect(() => {
    const result = await dashboardPresenter.loadData(userId)
    setData(result.data)
  }, [])

  return <div>{data}</div>
}
```

---

## 🔗 Data Flow

```
User Interaction → VIEW (React Component)
                 ↓
         PRESENTER (Business Logic)
                 ↓
            MODEL (API Calls)
                 ↓
         Backend/Server
                 ↓
            (Response)
                 ↓
         MODEL (Return Data)
                 ↓
         PRESENTER (Transform)
                 ↓
         VIEW (setState & render)
                 ↓
         User sees update
```

---

## 📝 Updated Routes

All routes now protected and use MVP views:

- `GET /` → Redirect to `/login`
- `GET /login` → Login page
- `GET /register` → Register page
- `GET /dashboard` → DashboardView (protected)
- `GET /services` → ServicesView (protected)
- `GET /bookings` → BookingsListView (protected)
- `GET /bookings/new` → BookingFormView (protected)
- `GET /bookings/:id/edit` → BookingFormView (protected)
- `GET /vehicles` → VehiclesListView (protected)
- `GET /vehicles/new` → VehicleFormView (protected)
- `GET /vehicles/:id/edit` → VehicleFormView (protected)
- `GET /profile` → ProfileView (protected)
- `GET /reviews/new` → ReviewFormView (protected)

---

## 🎯 Key Improvements

✅ **Strict Separation of Concerns**
- Model: API layer
- Presenter: Business logic
- View: UI rendering

✅ **Reusable Code**
- Models can be tested independently
- Presenters handle all transformations
- Views are simple and testable

✅ **Scalability**
- Easy to add new features
- Each feature is isolated
- No cross-feature dependencies

✅ **Maintainability**
- Clear file structure
- Consistent patterns
- Easy to debug

✅ **Error Handling**
- Centralized error utilities
- Consistent error messages
- Presenter handles all errors

✅ **Protected Routes**
- Authentication enforced at route level
- Redirects to login if not authenticated
- Clean navigation

---

## 🔄 Backward Compatibility

**Existing pages still work:**
- `/pages/Login.jsx` - Still used
- `/pages/Register.jsx` - Still used
- Old components in `/components/` - Still available
- Old services in `/services/` - Re-mapped to core/api

---

## 🚀 Next Steps (Phase 2)

- Import features properly in pages
- Fix any remaining component dependencies
- Test all routes and integrations
- Add more styling
- Database integration verification

---

## 📦 Available Utilities

### Core Utilities:
```javascript
// Helpers
import { formatDate, formatCurrency, debounce, capitalize } from "@/core/utils"

// Error Handling
import { getErrorMessage, handleApiError } from "@/core/utils"

// Axios
import axiosInstance from "@/core/api"

// Routing
import { AppRouter, ProtectedRoute } from "@/core/routes"

// Hooks
import { useAuth, useLoading } from "@/shared/hooks"
```

---

## 📊 Current Status

✅ Phase 1 Complete:
- Core infrastructure setup
- Feature folder structures created
- MVP models, presenters, views implemented
- All features scaffold created
- Routing configured
- Protected routes working
- Error handling utilities in place
- Hooks and utilities organized

⏳ Phase 2: Testing & Integration
⏳ Phase 3: Refinement & Styling

---

Generated: 2025-04-15
Version: 1.0.0
