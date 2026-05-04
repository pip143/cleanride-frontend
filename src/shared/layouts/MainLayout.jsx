import Navigation from "../../components/Navigation"

/**
 * MainLayout component
 * Wraps authenticated pages with Navigation at top
 */
export function MainLayout({ children }) {
  return (
    <div className="min-h-screen bg-slate-50">
      <Navigation />
      <main className="pt-16">
        {children}
      </main>
    </div>
  )
}
