"use client";

import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";
import { stores } from "@/data/site";
import { repo } from "./data";
import type { StoreSlug } from "./types";

/* ---------- Which store this counter is working for ---------- */

const STORE_KEY = "ecospin-admin-store";
const StoreCtx = createContext<{ store: StoreSlug; setStore: (s: StoreSlug) => void }>({
  store: stores[0].slug,
  setStore: () => {},
});

export function AdminStoreProvider({ children }: { children: ReactNode }) {
  const [store, setStoreState] = useState<StoreSlug>(stores[0].slug);
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORE_KEY) as StoreSlug | null;
      // eslint-disable-next-line react-hooks/set-state-in-effect -- read saved choice once after hydration
      if (saved && stores.some((s) => s.slug === saved)) setStoreState(saved);
    } catch {}
  }, []);
  const setStore = useCallback((s: StoreSlug) => {
    setStoreState(s);
    try {
      localStorage.setItem(STORE_KEY, s);
    } catch {}
  }, []);
  return <StoreCtx.Provider value={{ store, setStore }}>{children}</StoreCtx.Provider>;
}

export const useAdminStore = () => useContext(StoreCtx);

/* ---------- Load data and refresh when it changes ---------- */

export function useRepoQuery<T>(load: () => Promise<T>, deps: unknown[]) {
  const [data, setData] = useState<T | undefined>(undefined);
  const [error, setError] = useState<string | null>(null);
  const [tick, setTick] = useState(0);

  useEffect(() => repo.subscribe(() => setTick((t) => t + 1)), []);

  useEffect(() => {
    let alive = true;
    load()
      .then((d) => alive && (setData(d), setError(null)))
      .catch((e: unknown) => alive && setError(e instanceof Error ? e.message : "Could not load data"));
    return () => {
      alive = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps, tick]);

  return { data, error, loading: data === undefined && !error };
}
