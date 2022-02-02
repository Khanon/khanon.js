import { Particle } from '../particle';
import { ParticleProperties } from '../particle-properties';
import { Sprite } from '../../sprite/sprite';
import { SpriteAnimation } from '../../sprite/sprite-animation';
import { ParticleEndCriteria } from '../particle-end-criteria';
import { SpriteTexture } from '../../sprite/sprite-texture';

export interface ParticleSpriteProperties extends ParticleProperties {
    spriteTexture: SpriteTexture;
    spriteAnimation?: SpriteAnimation;
}

export class ParticleSprite extends Particle {
    id: 'ParticleSprite';

    constructor(protected readonly properties: ParticleSpriteProperties) {
        super(properties);
    }

    createDisplayObject(): Sprite {
        const sprite = new Sprite();
        sprite.setTexture(this.properties.spriteTexture);
        return sprite;
    }

    onStart(): void {
        if (this.properties.spriteAnimation) {
            this.displayObject.play(
                this.properties.spriteAnimation,
                undefined,
                this.properties.endCriteria === ParticleEndCriteria.ANIMATION_END ? () => this.end() : undefined
            );
        } else {
            this.displayObject.visible = true;
        }
    }
}
