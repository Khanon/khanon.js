import '@babylonjs/core/Loading/loadingScreen';
import '@babylonjs/core/Loading/Plugins/babylonFileLoader';
import '@babylonjs/core/Materials/PBR/pbrMaterial';

import * as Misc from './misc';
import { CoreGlobals } from './models/core-globals';
import { CoreProperties } from './models/core-properties';
import { DimensionsWH } from './models/dimensions-wh';
import { Engine } from './modules/engine/engine';
import { Logger } from './modules/logger/logger';
import { Scene } from './modules/scene/scene';
import { WorkerTimer } from './workers/worker-timer';

type SceneFunctionArg = (scene: Scene) => void;

export class Core {
    private static properties: CoreProperties;

    // Canvas
    private static canvas: HTMLCanvasElement;

    // Loop update
    private static loopUpdateLastMs: number;
    private static loopUpdateFPS: number;
    private static loopUpdateDelay: number;

    // Engine
    private static engine: Engine;

    // Scene
    private static loadSceneQueue: Misc.KeyValue<Scene, (scene: Scene) => void> = new Misc.KeyValue<Scene, SceneFunctionArg>();

    static initialize(properties: CoreProperties) {
        Core.properties = properties;
        Core.loopUpdateDelay = Core.properties.delayUpdate ?? 0;
        Core.loopUpdateFPS = 1000 / Core.properties.fps;
        CoreGlobals.isDevelopmentMode = !!Core.properties.isDevelopmentMode;
        if (Core.properties.onAppError) {
            CoreGlobals.onError$.subscribe({ next: (errorMsg: string) => Core.properties.onAppError(errorMsg) });
        }
    }

    /**
     * Creates and append canvas to a div element.
     * One canvas per application.
     */
    static createCanvasOnDivElement(htmlElement: HTMLElement): HTMLCanvasElement {
        if (Core.canvas) {
            Logger.error('Not allowed more than one canvas.');
            return;
        }
        Core.canvas = document.createElement('canvas');
        Core.canvas.id = 'canvas';
        htmlElement.appendChild(Core.canvas);
        CoreGlobals.canvasDimensions = Core.getCanvasDimensions();
        return Core.canvas;
    }

    /**
     * Get canvas
     */
    static getCanvas(): HTMLCanvasElement {
        return Core.canvas;
    }

    /**
     * Starts BabylonJs
     */
    static run(onReady: () => void): void {
        // Avoid babylonJs canvas scale error
        WorkerTimer.setTimeout(
            () => {
                Core.engine = new Engine(Core.canvas, { fpsContainer: Core.properties.fpsContainer });

                // Start loop update
                Core.loopUpdate();

                // Log info on startup
                // 8a8f mrar esto, las variables de entorno no van así en HTML,
                // ver cómo hacer seteo de esta variable desde la app nodriza
                // eliminar @types/node de packages
                Logger.info('Environment mode:', process.env.NODE_ENV);
                Core.logCanvasSize();

                // Manage resize
                window.addEventListener('resize', () => {
                    const canvasDimensions = Core.getCanvasDimensions();
                    Core.engine.babylonjs.resize();
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
    static logCanvasSize(): void {
        const canvasDimensions = Core.getCanvasDimensions();
        Logger.info('Canvas size:', canvasDimensions.width, canvasDimensions.height);
    }

    /**
     * Canvas width
     * @returns
     */
    static getCanvasDimensions(): DimensionsWH {
        return { width: Math.floor(Core.canvas.getBoundingClientRect().width), height: Math.floor(Core.canvas.getBoundingClientRect().height) };
    }

    /**
     * Load scene
     */
    static loadScene(scene: Scene, onLoaded?: (scene: Scene) => void): Scene {
        Core.engine.addScene(scene);
        Core.loadSceneQueue.add(scene, onLoaded);
        if (Core.loadSceneQueue.getKeys().length === 1) {
            WorkerTimer.setTimeout(
                () =>
                    scene.load(() => {
                        Core.loadSceneQueueNext(scene, onLoaded);
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
    private static loadSceneQueueNext(sceneLoaded: Scene, onLoaded?: (scene: Scene) => void): void {
        Core.loadSceneQueue.del(sceneLoaded);
        if (onLoaded) {
            onLoaded(sceneLoaded);
        }
        if (Core.loadSceneQueue.getKeys().length > 0) {
            const nextScene = Core.loadSceneQueue.getPairs()[0];
            WorkerTimer.setTimeout(() => nextScene.key.load(() => Core.loadSceneQueueNext(nextScene.key, nextScene.value)), 1, this);
        }
    }

    /**
     * Call loop update subscribers with a delta time parameter
     */
    private static loopUpdate(): void {
        Core.loopUpdateLastMs = performance.now();
        WorkerTimer.setInterval(
            () => {
                const currentMs = performance.now();
                const interval = currentMs - Core.loopUpdateLastMs;
                if (interval > Core.loopUpdateDelay) {
                    Core.loopUpdateLastMs = currentMs;
                    const delta = interval / Core.loopUpdateFPS;
                    CoreGlobals.loopUpdate$.next(delta);
                    CoreGlobals.physicsUpdate$.next(delta);
                }
            },
            0,
            this
        );
    }
}
