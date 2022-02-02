import { LoopUpdateable } from '../../models/loop-updateable';

export abstract class State<T> extends LoopUpdateable {
    private onEndCallback: () => void;

    constructor(readonly id: string, protected readonly subject: T) {
        super();
    }

    abstract onStart(): void;
    abstract onEnd(): void;

    start(onEndCallback: () => void): void {
        this.onEndCallback = onEndCallback;
        this.onStart();
    }

    end(): void {
        this.onEndCallback();
        this.onEnd();
    }

    /**
     * Override on child to notify messages to this actor from outer scene
     *
     * @param id
     */
    notify(id: any): void {}
}
