"use client"

// This file now acts as a compatibility layer to redirect useToast calls to Sonner
import { toast as sonnerToast } from "sonner"

// Compatibility layer to allow existing code to work with Sonner
export function useToast() {
  const toast = (props: any) => {
    if (props.variant === "destructive") {
      return sonnerToast.error(props.title, {
        description: props.description
      })
    }

    return sonnerToast(props.title, {
      description: props.description
    })
  }

  return {
    toast
  }
}

// For direct imports
export const toast = (props: any) => {
  if (props.variant === "destructive") {
    return sonnerToast.error(props.title, {
      description: props.description
    })
  }

  return sonnerToast(props.title, {
    description: props.description
  })
}
