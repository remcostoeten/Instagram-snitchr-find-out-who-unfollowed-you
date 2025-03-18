export interface AnimationConfig {
    duration?: number // in milliseconds
    curve?: "linear" | "easeIn" | "easeOut" | "easeInOut" | "custom"
    customCurve?: [number, number, number, number] // custom bezier curve values
    staggerDelay?: number // in milliseconds
    bounce?: number // bounce strength (0-1)
}

export const defaultAnimationConfig: AnimationConfig = {
    duration: 300,
    curve: "easeInOut",
    staggerDelay: 50,
    bounce: 0.15,
}

export const easingFunctions = {
    linear: [0, 0, 1, 1],
    easeIn: [0.4, 0, 1, 1],
    easeOut: [0, 0, 0.6, 1],
    easeInOut: [0.4, 0, 0.2, 1],
}

