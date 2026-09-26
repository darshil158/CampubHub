import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs))
}

export const FALLBACK_IMAGE_DATA_URI =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300' viewBox='0 0 400 300'%3E%3Crect width='400' height='300' fill='%230B0F1C'/%3E%3Crect x='20' y='20' width='360' height='260' rx='16' fill='%2313192B' stroke='%2338BDF8' stroke-opacity='0.2'/%3E%3Ccircle cx='200' cy='120' r='32' fill='%2300F0FF' fill-opacity='0.15'/%3E%3Cpath d='M180 180h40l-20-30z' fill='%2300F0FF' fill-opacity='0.4'/%3E%3Ctext x='50%25' y='225' dominant-baseline='middle' text-anchor='middle' fill='%2394A3B8' font-family='sans-serif' font-weight='600' font-size='13'%3EQuadly 3D Campus Item%3C/text%3E%3C/svg%3E"

export const FALLBACK_AVATAR_DATA_URI =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Ccircle cx='50' cy='50' r='50' fill='%2300F0FF' fill-opacity='0.2'/%3E%3Ccircle cx='50' cy='40' r='20' fill='%2300F0FF' fill-opacity='0.8'/%3E%3Cpath d='M20 85c0-18 14-25 30-25s30 7 30 25z' fill='%2300F0FF' fill-opacity='0.8'/%3E%3C/svg%3E"

export const handleImageError = (e, fallback = FALLBACK_IMAGE_DATA_URI) => {
  e.currentTarget.onerror = null
  e.currentTarget.src = fallback
}

