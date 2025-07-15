import { create } from "zustand";
import { persist } from "zustand/middleware";

interface Admin {
    email: string
    token: string 
}

interface AdminState {
    admin: Admin | null
    setAdmin: (admin: Admin) => void
    clearAdmin: () => void
}

export const useAdminStore = create<AdminState>()(
    persist(
        (set) => ({
            admin: null,
            setAdmin: (admin) => set({ admin }),
            clearAdmin: () => set({ admin: null})
        }),
        {
            name: "admin-storage",
        }
    )
)
