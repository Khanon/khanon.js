import { Color4 } from '@babylonjs/core/Maths/math.color';
import { Engine as BabylonJsEngine } from '@babylonjs/core/Engines/engine';
import { Scene as BabylonJsScene } from '@babylonjs/core/scene';

// Inspector (only dev mode), these comments will be replaced from webpack.dev.js
/* babylonjs-debugLayer */
/* babylonjs-inspector */

import { ActionsManager } from '../actions/actions-manager';
import { SceneProperties } from './scene-properties';
import { ParticlesFactory } from '../particle/particles-factory';
import { Subscriber } from '../../models/subscriber';
import { SpritesManager } from '../sprite/sprites-manager';
import { MeshesManager } from '../mesh/meshes-manager';
import { ActorsManager } from '../actor/actors-manager';
import { ObservablesContainer } from '../../models/observables-container';
import { AssetsManager } from '../assets-manager/assets-manager';
import { Logger } from '../logger/logger';
import { CoreGlobals } from '../../models/core-globals';
import { StateMachine } from '../state-machine/state-machine';

export abstract class Scene extends Subscriber {
    abstract id: string;

    babylonjs: BabylonJsScene;

    isLoaded: boolean = false;
    isPlaying: boolean = false;

    // Engine properties
    protected babylonJsEngine: BabylonJsEngine;
    protected canvas: HTMLCanvasElement;
    private renderStart: (id: string) => void;
    private renderStop: (id: string) => void;

    // Shared scene observables
    protected observables: ObservablesContainer = new ObservablesContainer();

    // Managers
    protected state: StateMachine = new StateMachine();
    protected assetsManager: AssetsManager;
    protected spritesManager: SpritesManager;
    protected meshesManager: MeshesManager;
    protected actorsManager: ActorsManager;

    // Actions
    protected readonly actions: ActionsManager<any> = new ActionsManager<any>();

    // Particles
    protected particles: ParticlesFactory;

    constructor(protected readonly properties: SceneProperties) {
        super();
    }

    // ------------------------
    //   Load, play and Release
    // ------------------------

    abstract onLoad(): void;
    abstract onRelease(): void;

    abstract onPlay(): void;
    abstract onStop(): void;

    /**
     * On scene loading error
     */
    abstract onError(errorMsg: string): void;

    setEngineParams(babylonJsEngine: BabylonJsEngine, canvas: HTMLCanvasElement, renderStart: (id: string) => void, renderEnd: (id: string) => void): void {
        this.babylonJsEngine = babylonJsEngine;
        this.canvas = canvas;
        this.renderStart = renderStart;
        this.renderStop = renderEnd;
    }

    /**
     * Create babylonjs scene, trigger onLoad and play if indicated
     * @param properties
     */
    load(onLoaded?: () => void): void {
        if (this.isLoaded) {
            Logger.warn('Scene already loaded');
            return;
        }

        this.release();

        this.isPlaying = false;
        this.babylonjs = new BabylonJsScene(this.babylonJsEngine);
        this.assetsManager = new AssetsManager(this.babylonjs);
        this.spritesManager = new SpritesManager(this.assetsManager);
        this.meshesManager = new MeshesManager(this.assetsManager);
        this.actorsManager = new ActorsManager(this.babylonjs, this.assetsManager, this.spritesManager, this.meshesManager, this.observables);
        this.particles = new ParticlesFactory(this.babylonjs, this.assetsManager);

        // Setup the scene
        if (this.properties.clearColor) {
            this.babylonjs.clearColor = new Color4(
                this.properties.clearColor.r,
                this.properties.clearColor.g,
                this.properties.clearColor.b,
                this.properties.clearColor.a
            );
        }

        this.onLoad();
        this.assetsManager.loadAssets(this.properties.assetsJsonUrl).subscribe({
            error: (error) => {
                const errorMsg = `There was an error loading assets: ${this.properties.assetsJsonUrl}`;
                Logger.error(errorMsg, error);
                this.onError(errorMsg);
            },
            complete: () => {
                this.babylonjs.executeWhenReady(() => {
                    this.isLoaded = true;
                    if (onLoaded) {
                        onLoaded();
                    }
                    if (this.properties.playOnLoad === true) {
                        this.play();
                    }
                });
            },
        });

        // Babylonjs inspector (only DEV mode). Babylonjs inspector imports are removed on webpack build
        if (CoreGlobals.isDevelopmentMode) {
            this.debugInspector();
        }
    }

    /**
     * Play the scene, trigger render loop
     */
    play(): void {
        this.isPlaying = true;
        this.renderStart(this.id);
        this.babylonjs.activeCamera.attachControl(this.canvas);
        this.onPlay();
    }

    /**
     * Stop the scene, release from render loop
     */
    stop(): void {
        this.renderStop(this.id);
        this.onStop();
    }

    /**
     * Release all scene objects
     */
    release(): void {
        this.isLoaded = false;
        this.state.currentState?.end();
        this.actions.stopAll();
        this.particles?.release();
        this.onRelease();
        this.actorsManager?.release();
        this.spritesManager?.release();
        this.meshesManager?.release();
        this.assetsManager?.release();
        this.babylonjs?.dispose();
    }

    // ------------------------
    //   Debug methods
    // ------------------------

    private debugInspector(): void {
        window.addEventListener('keydown', (ev) => {
            if (ev.shiftKey && ev.ctrlKey && ev.altKey && ev.key === 'I') {
                // @ts-ignore
                if (this.babylonjs.debugLayer.isVisible()) {
                    // @ts-ignore
                    this.babylonjs.debugLayer.hide();
                } else {
                    // @ts-ignore
                    this.babylonjs.debugLayer.show();
                }
            }
        });
    }
}
