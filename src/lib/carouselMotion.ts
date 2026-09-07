"use client";

import { useSyncExternalStore } from "react";

const KEY = "clearfin-carousel-paused";
const EVENT = "clearfin:carousel-pause";
let fallbackPaused = false;

function readPaused() {
  try { return sessionStorage.getItem(KEY) === "true" || fallbackPaused; }
  catch { return fallbackPaused; }
}
function subscribePause(callback: () => void) {
  window.addEventListener(EVENT, callback);
  return () => window.removeEventListener(EVENT, callback);
}
export function setCarouselPaused(paused: boolean) {
  fallbackPaused = paused;
  try { sessionStorage.setItem(KEY, String(paused)); } catch { /* Visit-only fallback. */ }
  window.dispatchEvent(new Event(EVENT));
}
function subscribeMotion(callback: () => void) {
  const media = window.matchMedia("(prefers-reduced-motion: reduce)");
  media.addEventListener("change", callback);
  document.addEventListener("visibilitychange", callback);
  return () => {
    media.removeEventListener("change", callback);
    document.removeEventListener("visibilitychange", callback);
  };
}
const readMotionBlocked = () => document.hidden || window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const serverPaused = () => false;
const serverBlocked = () => true;

export function useCarouselMotion() {
  const paused = useSyncExternalStore(subscribePause, readPaused, serverPaused);
  const blocked = useSyncExternalStore(subscribeMotion, readMotionBlocked, serverBlocked);
  return { paused, blocked };
}
