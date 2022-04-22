export interface CoreProperties {
    /** Canvas HTML parent element */
    canvasParentHTMLElement?: HTMLElement;
    /** FPS container HTML element */
    fpsContainer?: string;
    /** Target FPS of the application */
    fps: number;
    /** Don't update before this delay */
    delayUpdate?: number;
    /** Critical error app callback */
    onAppError?: (errorMsg: string) => void;
    /** Development mode */
    isDevelopmentMode?: boolean;
}
