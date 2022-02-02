import { Vector3, Matrix } from '@babylonjs/core/Maths/math.vector';

import * as Misc from '../../../misc';
import { DisplayObject } from '../../../models/display-object';
import { PhysicsUpdateable } from '../../../models/physics-updatable';

export class ActorSimplePhysics extends PhysicsUpdateable {
    static id: string = 'ActorSimplePhysics';
    id: string = ActorSimplePhysics.id;

    private displayObject: DisplayObject;

    private velocity: Vector3 = new Vector3();
    private maxVelocity: number = Number.MAX_VALUE;
    private translationMatrix: Matrix = new Matrix();
    private rotationVector: Vector3 = new Vector3();

    onFloor: boolean = false;

    start(displayObject: DisplayObject): void {
        this.displayObject = displayObject;
        this.subscribePhysicsUpdate();
    }

    release(): void {
        this.unSubscribePhysicsUpdate();
    }

    setTranslation(translation: Vector3): void {
        this.translationMatrix.setTranslation(translation);
    }

    setTranslationFromFloats(x: number, y: number, z: number): void {
        this.translationMatrix.setTranslationFromFloats(x, y, z);
    }

    getTranslation(): Vector3 {
        return this.translationMatrix.getTranslation();
    }

    setRotation(rotation: Vector3): void {
        this.rotationVector.set(rotation.x, rotation.y, rotation.z);
    }

    setRotationFromFloats(x: number, y: number, z: number): void {
        this.rotationVector.set(x, y, z);
    }

    getRotation(): Vector3 {
        return this.rotationVector;
    }

    applyForce(force: Vector3): void {
        this.velocity = this.velocity.add(force);
        if (this.velocity.length() > this.maxVelocity) {
            this.velocity.normalize().scale(this.maxVelocity);
        }
    }

    applyForceFromFloats(x: number, y: number, z: number): void {
        this.velocity.x += x;
        this.velocity.y += y;
        this.velocity.z += z;
        if (this.velocity.length() > this.maxVelocity) {
            this.velocity.normalize().scale(this.maxVelocity);
        }
    }

    setMaxVelocity(maxVelocity: number): void {
        this.maxVelocity = maxVelocity;
    }

    getVelocity(): Vector3 {
        return this.velocity;
    }

    scaleVelocity(scale: number): void {
        this.velocity.x *= scale;
        this.velocity.y *= scale;
        this.velocity.z *= scale;
    }

    resetVelocity(): void {
        this.velocity.set(0, 0, 0);
    }

    physicsUpdate(delta: number): void {
        // Set to zero residual vels
        if (Math.abs(this.velocity.x) < Misc.Maths.MIN_VALUE) {
            this.velocity.x = 0;
        }
        if (Math.abs(this.velocity.y) < Misc.Maths.MIN_VALUE) {
            this.velocity.y = 0;
        }
        if (Math.abs(this.velocity.z) < Misc.Maths.MIN_VALUE) {
            this.velocity.z = 0;
        }

        // Apply velocity to position
        this.translationMatrix.addTranslationFromFloats(this.velocity.x * delta, this.velocity.y * delta, this.velocity.z * delta);
        this.displayObject.setPosition(this.getTranslation());
        this.displayObject.setRotation(this.getRotation());
    }
}
