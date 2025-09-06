"use client"

import { toast as sonnerToast } from "react-hot-toast"

export const toast = {
  success: (message: string) => {
    sonnerToast.success(message, {
      duration: 4000,
      position: "top-right",
    })
  },
  error: (message: string) => {
    sonnerToast.error(message, {
      duration: 4000,
      position: "top-right",
    })
  },
  loading: (message: string) => {
    return sonnerToast.loading(message, {
      duration: Infinity,
      position: "top-right",
    })
  },
  dismiss: (toastId: string) => {
    sonnerToast.dismiss(toastId)
  },
}
