import { LoopUpdateable } from '../../models/loop-updateable';
import { MotionProperties } from './motion-properties';
import { DisplayObject } from '../../models/display-object';
import { MotionEndCriteria } from './motion-end-criteria';
import { WorkerTimer } from '../../workers/worker-timer';

export abstract class Motion extends LoopUpdateable {
    displayObject: DisplayObject;
    protected onDoneCallback: () => void;

    constructor(protected readonly properties: MotionProperties) {
        super();
    }

    abstract onInitialize(): void;
    abstract loopUpdate(delta: number): void;

    initialize(displayObject: DisplayObject, onDoneCallback?: () => void): void {
        this.displayObject = displayObject;
        this.onDoneCallback = onDoneCallback;
        this.onInitialize();
        if (this.properties.endCriteria === MotionEndCriteria.TIMEOUT) {
            WorkerTimer.setTimeout(() => this.done(), this.properties.endValue, this);
        }
    }

    start(): void {
        this.subscribeLoopUpdate();
    }

    end(): void {
        this.unSubscribeLoopUpdate();
    }

    protected done(): void {
        this.end();
        this.onDoneCallback();
    }
}
