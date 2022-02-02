import { DimensionsWH } from './dimensions-wh';

export interface TextBlockProperties {
    /**
     * Array containing each text line
     */
    textBlock?: string[];

    /**
     * Font name (fontface)
     */
    fontName: string;

    /**
     * Font size
     */
    fontSize: number;

    /**
     * Text color
     */
    textColor: string;

    /**
     * Font style (bold, italic, etc..)
     */
    fontStyle?: string;

    /**
     * Background color.
     * Transparent background on 'undefined'.
     */
    bgColor?: string;

    /**
     * Center horizontally (true by default)
     */
    centerH?: boolean;

    /**
     * Center vertically (true by default)
     */
    centerV?: boolean;

    /**
     * Texture size.
     * Fit area to text on 'undefined'.
     */
    textureSize?: DimensionsWH;
}
