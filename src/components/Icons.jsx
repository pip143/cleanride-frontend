export function CarIcon() {
  return (
    <svg width="28" height="22" viewBox="0 0 28 22" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 13h24v6a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1v-6z" />
      <path d="M2 13l4-9h16l4 9" />
      <circle cx="7.5" cy="18" r="2.5" />
      <circle cx="20.5" cy="18" r="2.5" />
    </svg>
  )
}

export function UserIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="8" r="4" />
      <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
    </svg>
  )
}

export function ServiceIcon({ type }) {
  const p = {
    width: 22, height: 22, viewBox: "0 0 24 24", fill: "none",
    stroke: "#2563eb", strokeWidth: 2, strokeLinecap: "round", strokeLinejoin: "round",
  }
  if (type === "droplet") return <svg {...p}><path d="M12 2C6 9 4 13 4 15.5a8 8 0 0 0 16 0C20 13 18 9 12 2z" /></svg>
  if (type === "sparkle") return <svg {...p}><path d="M12 3l2 6 6 1-4.5 4.5 1.5 5.5-5-3-5 3 1.5-5.5L4 10l6-1 2-6z" /></svg>
  if (type === "star") return <svg {...p}><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>
  if (type === "home") return <svg {...p}><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></svg>
  if (type === "zap") return <svg {...p}><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" /></svg>
  if (type === "gem") return <svg {...p}><polygon points="6 3 18 3 22 9 12 22 2 9" /><line x1="2" y1="9" x2="22" y2="9" /><line x1="12" y1="3" x2="6" y2="9" /><line x1="12" y1="3" x2="18" y2="9" /></svg>
  return null
}

export function NavIcon({ type, active }) {
  const p = {
    width: 22, height: 22, viewBox: "0 0 24 24", fill: "none",
    stroke: active ? "#2563eb" : "#9ca3af", strokeWidth: 2, strokeLinecap: "round", strokeLinejoin: "round",
  }
  if (type === "home") return <svg {...p}><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></svg>
  if (type === "bookings") return <svg {...p}><rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>
  if (type === "profile") return <svg {...p}><circle cx="12" cy="8" r="4" /><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" /></svg>
  return null
}
