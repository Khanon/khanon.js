/**
 * DISCARDEED AT THE MOMENT
 */

/*
import { Vector3 } from '@babylonjs/core/Maths/math.vector';
import { Sprite as BabylonJsSprite } from '@babylonjs/core/Sprites/sprite';

import { DisplayObject } from '../../models/display-object';
import { SpriteProperties } from './sprite-properties';
import { SpriteTextFont } from './sprite-text-font';
import { Logger } from '../logger/logger';

export class SpriteText extends DisplayObject {
    babylonjs: BabylonJsSprite;
    private spriteTextFont: SpriteTextFont;
    // https://forum.babylonjs.com/t/grouping-parenting-sprites/1492
    // ¿Usar flat meshes para esto, que sí permiten pareent tree?. ¿puede hacerse que una malla mire a cámara siempre?
    private scale: number = 1;

    constructor(readonly name: string = '', readonly properties: SpriteProperties = {}) {
        super(name);
    }

    get visible(): boolean {
        return this.babylonjs.isVisible;
    }

    set visible(visible: boolean) {
        if (!this.spriteTextFont) {
            Logger.error('No SpriteTexture on sprite:', this.name);
        }
        this.babylonjs.isVisible = visible;
    }

    play(): void {}
    stop(): void {}

    setFont(spriteTextFont: SpriteTextFont): void {
        this.spriteTextFont = spriteTextFont;
        this.babylonjs = new BabylonJsSprite(this.name, this.spriteTextFont.getTexture().babylonjs);
        this.babylonjs.width = 100;
        this.babylonjs.height = 100;
        this.visible = false;
    }

    setText(text: string): void {}

    release(): void {
        this.babylonjs.dispose();
    }

    setFrame(frame: number): void {
        this.stop();
        this.visible = true;
        if (frame < 0) {
            frame = this.properties.numFrames - 1;
        }
        this.babylonjs.cellIndex = frame;
    }
    setRotation(rotation: Vector3): void {
        this.babylonjs.angle = rotation.x;
    }

    getRotation(): Vector3 {
        return new Vector3(this.babylonjs.angle, 0, 0);
    }

    setScale(scale: number): void {
        this.scale = scale;
        this.babylonjs.width = 100 * this.scale;
        this.babylonjs.height = 100 * this.scale;
    }

    getScale(): number {
        return this.scale;
    }

    setAlpha(alpha: number): void {
        this.babylonjs.color.a = alpha;
    }

    getAlpha(): number {
        return this.babylonjs.color.a;
    }
}
*/
