/**
 * DISCARDEED AT THE MOMENT
 */
/*
import { Scene as BabylonJsScene } from '@babylonjs/core/scene';
import { DynamicTexture } from '@babylonjs/core/Materials/Textures/dynamicTexture';

import { DynamicTextureTextBlockProperties } from '../misc/dynamic-textures/dynamic-texture-textblock-properties';
import { SpriteTexture } from '../modules/sprite/sprite-texture';
import { DimensionsWH } from '../models/dimensions-wh';

export class SpriteTextFont {
    charSizes: DimensionsWH[] = [];

    private fontTexture: SpriteTexture;

    constructor(private readonly babylonJsScene: BabylonJsScene, private readonly properties: DynamicTextureTextBlockProperties) {
        this.create();
    }

    create(): void {
        const xSep = 4;
        const ySep = 10;

        let characters: string[] = [];
        for (let i = 0; i < 256; i++) {
            characters.push(String.fromCharCode(i));
        }
        console.log('this.characters', characters);

        const font = `${this.properties.fontStyle} ${this.properties.fontSize}px ${this.properties.fontName}`;

        let charWidth = 0;
        let charHeight = 0;
        let textureWidth = 1024;
        let textureHeight = 0;
        let dynamicTexture: DynamicTexture;
        let spritePackedJson = { frames: {} };

        characters.forEach((char) => {
            const checkSizeTx = new DynamicTexture('DynamicTexture', 64, this.babylonJsScene, false);
            const ctx = checkSizeTx.getContext();
            ctx.font = font;
            const metricsFirst = ctx.measureText(char);
            let height = Math.ceil(metricsFirst.actualBoundingBoxAscent + metricsFirst.actualBoundingBoxDescent);
            let width = Math.ceil(metricsFirst.width) + xSep;
            charWidth = width + xSep > charWidth ? width + xSep : charWidth;
            charHeight = height + ySep > charHeight ? height + ySep : charHeight;
            checkSizeTx.dispose();
            this.charSizes.push({ width: width, height: height });
        });
        const numRowX = Math.floor(1024 / charWidth);
        textureWidth = numRowX * charWidth;
        textureHeight = Math.ceil(characters.length / numRowX) * charHeight;

        console.log('numRowX', numRowX);
        console.log('maxCharWidth:', charWidth);
        console.log('maxCharHeight:', charHeight);
        console.log('textureWidth', textureWidth);
        console.log('textureHeight', textureHeight);
        console.log('rowX, rowY', textureWidth / charWidth, textureHeight / charHeight);
        console.log('sizes:', this.charSizes);
        console.log('json:', spritePackedJson);

        dynamicTexture = new DynamicTexture('DynamicTexture', { width: textureWidth, height: textureHeight }, this.babylonJsScene, false);
        const ctxTx = dynamicTexture.getContext();
        if (this.properties.bgColor) {
            ctxTx.beginPath();
            ctxTx.rect(0, 0, textureWidth, textureHeight);
            ctxTx.fillStyle = this.properties.bgColor;
            ctxTx.fill();
        }

        let x = 0;
        let y = charHeight / 2 + ySep;
        characters.forEach((char, index) => {
            if (x + charWidth > textureWidth) {
                x = 0;
                y += charHeight;
            }
            dynamicTexture.drawText(char, x, y, font, this.properties.textColor, null, false);
            x += charWidth;
        });

        this.fontTexture = new SpriteTexture(this.babylonJsScene);
        this.fontTexture.setFromDynamicTexture(dynamicTexture, charWidth, charHeight);
    }

    getTexture(): SpriteTexture {
        return this.fontTexture;
    }
}
*/
