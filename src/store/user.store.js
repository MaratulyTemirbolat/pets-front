import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import Cookies from "js-cookie";
import { fetchUserData } from "../services/auths.service";

export const useUserStore = create()(
  persist(
    (set, get) => ({
      user: null,
      setUser: (newUser) => set({ user: {...newUser, "access": undefined, "refresh": undefined} }),
      isExistedAccessToken: () => (Cookies.get("access") ? true : false),
      setAccessToken: (accessToken) =>
        Cookies.set("access", accessToken, { expires: 30 }),
      resetUser: () => {
        set({ user: null });
        Cookies.remove("access");
      },
      getAccessToken: () => Cookies.get("access"),
      fetchUser: async () => {
        if (!get().user && get().isExistedAccessToken()) {
          fetchUserData(get().getAccessToken()).then((resp) => {
            if (resp.isOk) set({ user: resp.response.data });
          })
        }
      },
    }),
    {
      name: "user-storage",
      storage: createJSONStorage(() => sessionStorage),
      version: 1,
    }
  )
);
