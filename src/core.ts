import '@babylonjs/core/Loading/loadingScreen';
import '@babylonjs/core/Loading/Plugins/babylonFileLoader';
import '@babylonjs/core/Materials/PBR/pbrMaterial';

import { Engine } from './modules/engine/engine';
import { Logger } from './modules/logger/logger';
import { Scene } from './modules/scene/scene';
import { DimensionsWH } from './models/dimensions-wh';
import { CoreProperties } from './models/core-properties';
import { WorkerTimer } from './workers/worker-timer';
import { CoreGlobals } from './models/core-globals';
import * as Misc from '../khanon3d/misc';

export class Core {
    private canvas: HTMLCanvasElement;

    // Loop update
    private loopUpdateLastMs: number;
    private loopUpdateFPS: number;
    private loopUpdateDelay: number;

    // Engine
    private engine: Engine;

    // Scene
    private loadSceneQueue: Misc.KeyValue<Scene, (scene: Scene) => void> = new Misc.KeyValue<Scene, (scene: Scene) => void>();

    constructor(private readonly properties: CoreProperties) {
        this.loopUpdateDelay = this.properties.delayUpdate ?? 0;
        this.loopUpdateFPS = 1000 / this.properties.fps;
        CoreGlobals.isDevelopmentMode = !!this.properties.isDevelopmentMode;
        if (this.properties.onAppError) {
            CoreGlobals.onError$.subscribe({ next: (errorMsg: string) => this.properties.onAppError(errorMsg) });
        }
    }

    /**
     * Creates and append canvas to a div element.
     * One canvas per application.
     */
    createCanvasOnDivElement(htmlElement: HTMLElement): HTMLCanvasElement {
        if (this.canvas) {
            Logger.error('Not allowed more than one canvas.');
            return;
        }
        this.canvas = document.createElement('canvas');
        this.canvas.id = 'canvas';
        htmlElement.appendChild(this.canvas);
        CoreGlobals.canvasDimensions = this.getCanvasDimensions();
        return this.canvas;
    }

    /**
     * Starts BabylonJs
     */
    run(onReady: () => void): void {
        // Avoid babylonJs canvas scale error
        WorkerTimer.setTimeout(
            () => {
                this.engine = new Engine(this.canvas, { fpsContainer: this.properties.fpsContainer });

                // Start loop update
                this.loopUpdate();

                // Log info on startup
                Logger.info('Environment mode:', process.env.NODE_ENV);
                this.logCanvasSize();

                // Manage resize
                window.addEventListener('resize', () => {
                    const canvasDimensions = this.getCanvasDimensions();
                    this.engine.babylonjs.resize();
                    CoreGlobals.canvasDimensions = canvasDimensions;
                    CoreGlobals.canvasResize$.next(canvasDimensions);
                });

                onReady();
            },
            1,
            this
        );
    }

    /**
     * Log canvas size { width, height }
     */
    logCanvasSize(): void {
        const canvasDimensions = this.getCanvasDimensions();
        Logger.info('Canvas size:', canvasDimensions.width, canvasDimensions.height);
    }

    /**
     * Canvas width
     * @returns
     */
    getCanvasDimensions(): DimensionsWH {
        return { width: Math.floor(this.canvas.getBoundingClientRect().width), height: Math.floor(this.canvas.getBoundingClientRect().height) };
    }

    /**
     * Load scene
     */
    loadScene(scene: Scene, onLoaded?: (scene: Scene) => void): Scene {
        this.engine.addScene(scene);
        this.loadSceneQueue.add(scene, onLoaded);
        if (this.loadSceneQueue.getKeys().length === 1) {
            WorkerTimer.setTimeout(
                () =>
                    scene.load(() => {
                        this.loadSceneQueueNext(scene, onLoaded);
                    }),
                1,
                this
            );
        }
        return scene;
    }

    /**
     * Proccess load scene queue.
     * Queue is needeed since BabylonJs mess up on loading more than one scene simultaneously.
     */
    private loadSceneQueueNext(sceneLoaded: Scene, onLoaded?: (scene: Scene) => void): void {
        this.loadSceneQueue.del(sceneLoaded);
        if (onLoaded) {
            onLoaded(sceneLoaded);
        }
        if (this.loadSceneQueue.getKeys().length > 0) {
            const nextScene = this.loadSceneQueue.getPairs()[0];
            WorkerTimer.setTimeout(() => nextScene.key.load(() => this.loadSceneQueueNext(nextScene.key, nextScene.value)), 1, this);
        }
    }

    /**
     * Call loop update subscribers with a delta time parameter
     */
    private loopUpdate(): void {
        this.loopUpdateLastMs = performance.now();
        WorkerTimer.setInterval(
            () => {
                const currentMs = performance.now();
                const interval = currentMs - this.loopUpdateLastMs;
                if (interval > this.loopUpdateDelay) {
                    this.loopUpdateLastMs = currentMs;
                    let delta = interval / this.loopUpdateFPS;
                    CoreGlobals.loopUpdate$.next(delta);
                    CoreGlobals.physicsUpdate$.next(delta);
                }
            },
            0,
            this
        );
    }
}
