import { Subscription } from 'rxjs';

import { CoreGlobals } from './core-globals';

export abstract class LoopUpdateable {
    private loopUpdateSubscription: Subscription;

    loopUpdate(delta: number): void {}

    subscribeLoopUpdate(): void {
        this.loopUpdateSubscription = CoreGlobals.loopUpdate$.subscribe((delta) => this.loopUpdate(delta));
    }

    unSubscribeLoopUpdate(): void {
        if (this.loopUpdateSubscription) {
            this.loopUpdateSubscription.unsubscribe();
            this.loopUpdateSubscription = undefined;
        }
    }
}
