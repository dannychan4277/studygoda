"use client";

import { useState, useEffect, useCallback, useSyncExternalStore } from "react";
import config from "@/config";

const STORAGE_KEY = "studygoda_compare";
const MAX = config.compare.maxItems;

// External store for cross-component sync
const listeners = new Set();
function subscribe(cb) {
  listeners.add(cb);
  return () => listeners.delete(cb);
}
function notify() {
  listeners.forEach((cb) => cb());
}
function getSnapshot() {
  if (typeof window === "undefined") return "[]";
  return window.localStorage.getItem(STORAGE_KEY) || "[]";
}
function getServerSnapshot() {
  return "[]";
}

export function useCompareList() {
  const raw = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const slugs = JSON.parse(raw);

  const add = useCallback((slug) => {
    const current = JSON.parse(getSnapshot());
    if (current.includes(slug) || current.length >= MAX) return;
    const next = [...current, slug];
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    notify();
  }, []);

  const remove = useCallback((slug) => {
    const current = JSON.parse(getSnapshot());
    const next = current.filter((s) => s !== slug);
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    notify();
  }, []);

  const toggle = useCallback((slug) => {
    const current = JSON.parse(getSnapshot());
    if (current.includes(slug)) {
      remove(slug);
    } else {
      add(slug);
    }
  }, [add, remove]);

  const clear = useCallback(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify([]));
    notify();
  }, []);

  const has = useCallback(
    (slug) => slugs.includes(slug),
    [slugs]
  );

  return { slugs, add, remove, toggle, clear, has, isFull: slugs.length >= MAX };
}
