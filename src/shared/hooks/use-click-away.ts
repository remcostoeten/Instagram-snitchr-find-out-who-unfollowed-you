"use client"

/**
 * @author Remco Stoeten
 * @description A custom hook that handles click events outside of a specified element.
 * It's useful for closing dropdowns, modals, or other interactive elements when clicking outside.
 */

import { useEffect, type RefObject } from "react"

/**
 * Hook that alerts clicks outside of the passed ref
 * @param {RefObject<HTMLElement>} ref - The ref object attached to the element to monitor
 * @param {Function} handler - The callback function to be called when a click outside occurs
 */
export function useClickAway(ref: RefObject<HTMLElement>, handler: (event: MouseEvent | TouchEvent) => void) {
    useEffect(() => {
        /**
         * Alert if clicked on outside of element
         * @param {MouseEvent | TouchEvent} event - The click or touch event
         */
        function handleClickOutside(event: MouseEvent | TouchEvent) {
            if (!ref.current || ref.current.contains(event.target as Node)) {
                return
            }
            handler(event)
        }

        // Bind the event listener
        document.addEventListener("mousedown", handleClickOutside)
        document.addEventListener("touchstart", handleClickOutside)

        // Unbind the event listener on clean up
        return function cleanup() {
            document.removeEventListener("mousedown", handleClickOutside)
            document.removeEventListener("touchstart", handleClickOutside)
        }
    }, [ref, handler])
}

