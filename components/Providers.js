"use client";

import { FavoritesProvider } from "@/context/FavoritesContext";

export default function Providers({ children }) {
  return <FavoritesProvider>{children}</FavoritesProvider>;
}
