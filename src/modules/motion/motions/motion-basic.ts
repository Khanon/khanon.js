import { Vector3 } from '@babylonjs/core/Maths/math.vector';

import { Motion } from '../motion';
import { MotionEndCriteria } from '../motion-end-criteria';
import { MotionProperties } from '../motion-properties';

export interface MotionBasicProperties extends MotionProperties {
    alphaStart?: number;
    alphaEnd?: number;
    alphaVel?: number;
    posVel?: Vector3;
    posSin?: Vector3;
    posSinVel?: number;
    posSinMoment?: number;
    rotSin?: Vector3;
    rotSinVel?: number;
    rotSinMoment?: number;
}

export class MotionBasic extends Motion {
    private stack: ((delta: number) => void)[] = [];

    private posSinOrigin: Vector3;
    private posSinTime: number;

    private rotSinOrigin: Vector3;
    private rotSinTime: number;

    constructor(protected readonly properties: MotionBasicProperties) {
        super(properties);
    }

    onInitialize(): void {
        this.displayObject.setAlpha(this.properties.alphaStart ?? 1);

        if (this.properties.alphaVel) {
            if (this.properties.alphaStart < this.properties.alphaEnd) {
                this.stack.push((delta: number) => this.alphaAdd(delta));
            } else {
                this.stack.push((delta: number) => this.alphaSub(delta));
            }
        }
        if (this.properties.posVel) {
            this.stack.push((delta: number) => this.posAdd(delta));
        }
        if (this.properties.posSin) {
            this.posSinTime = this.properties.posSinMoment ?? 0;
            this.posSinOrigin = this.displayObject.getPosition();
            this.stack.push((delta: number) => this.posSin(delta));
        }
        if (this.properties.rotSin) {
            this.rotSinTime = this.properties.rotSinMoment ?? 0;
            this.rotSinOrigin = this.displayObject.getRotation();
            this.stack.push((delta: number) => this.rotSin(delta));
        }
    }

    loopUpdate(delta: number): void {
        this.stack.forEach((fn) => fn(delta));
    }

    /**
     * Alpha addition
     *
     * @param delta
     */
    alphaAdd(delta: number): void {
        this.displayObject.setAlpha(this.displayObject.getAlpha() + this.properties.alphaVel * delta);
        if (this.displayObject.getAlpha() >= this.properties.alphaEnd) {
            this.displayObject.setAlpha(this.properties.alphaEnd);
            if (this.properties.endCriteria === MotionEndCriteria.ALPHA_END) {
                this.done();
            }
        }
    }

    /**
     * Alpha substraction
     *
     * @param delta
     */
    alphaSub(delta: number): void {
        this.displayObject.setAlpha(this.displayObject.getAlpha() - this.properties.alphaVel * delta);
        if (this.displayObject.getAlpha() <= this.properties.alphaEnd) {
            this.displayObject.setAlpha(this.properties.alphaEnd);
            if (this.properties.endCriteria === MotionEndCriteria.ALPHA_END) {
                this.done();
            }
        }
    }

    /**
     * Position movement
     *
     * @param delta
     */
    posAdd(delta: number): void {
        this.displayObject.babylonjs.position.addInPlace(this.properties.posVel.scale(delta));
    }

    /**
     * Sinusoidal position
     *
     * @param delta
     */
    posSin(delta: number): void {
        this.posSinTime += delta * this.properties.posSinVel;
        this.displayObject.babylonjs.position = this.posSinOrigin.add(this.properties.posSin.scale(Math.sin(this.posSinTime)));
    }

    /**
     * Sinusoidal rotation
     *
     * @param delta
     */
    rotSin(delta: number): void {
        this.rotSinTime += delta * this.properties.rotSinVel;
        this.displayObject.setRotation(this.rotSinOrigin.add(this.properties.rotSin.scale(Math.sin(this.rotSinTime))));
    }
}
