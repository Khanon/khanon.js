import { Scene as BabylonJsScene } from '@babylonjs/core/scene';

import { Actor } from './actor';
import { ObservablesContainer } from '../../models/observables-container';
import { SpritesManager } from '../sprite/sprites-manager';
import { MeshesManager } from '../mesh/meshes-manager';
import { DisplayObject } from '../../models/display-object';
import { Sprite } from '../sprite/sprite';
import { Mesh } from '../mesh/mesh';
import { Logger } from '../logger/logger';
import { AssetsManager } from '../assets-manager/assets-manager';
import * as Misc from '../../misc';

export class ActorsManager {
    private readonly _actors: Misc.KeyValue<Actor, void> = new Misc.KeyValue<Actor, void>();

    constructor(
        private readonly babylonJsScene: BabylonJsScene,
        private readonly assetsManager: AssetsManager,
        private readonly spritesManager: SpritesManager,
        private readonly meshesManager: MeshesManager,
        private readonly sceneObservables: ObservablesContainer
    ) {}

    get actors(): Actor[] {
        return this._actors.getKeys();
    }

    addActor(actor: Actor): any {
        // Create display objects for any actor added to the scene
        const displayObject: DisplayObject = actor.getDisplayObject(this.babylonJsScene);
        if (displayObject instanceof Sprite) {
            this.spritesManager.addSprite(displayObject);
        } else if (displayObject instanceof Mesh) {
            this.meshesManager.addMesh(displayObject);
        } else {
            Logger.error('Unknown DisplayObject instance on actor -', actor.name);
            return undefined;
        }
        actor.createParticlesManager(this.babylonJsScene, this.assetsManager);
        actor.setSceneObservables(this.sceneObservables);
        actor.initialize(this.assetsManager, () => this.delActor(actor));

        this._actors.add(actor);
        return actor;
    }

    delActor(actor: Actor): void {
        this._actors.del(actor);
    }

    release(): void {
        const actors = [...this._actors.getKeys()];
        actors.forEach((actor) => {
            actor.release();
        });
        this.actors.slice(0, this.actors.length);
    }
}
