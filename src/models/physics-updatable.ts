import { Subscription } from 'rxjs';

import { CoreGlobals } from './core-globals';

export abstract class PhysicsUpdateable {
    private physicsUpdateSubscription: Subscription;

    physicsUpdate(delta: number): void {}

    subscribePhysicsUpdate(): void {
        this.physicsUpdateSubscription = CoreGlobals.physicsUpdate$.subscribe((delta) => this.physicsUpdate(delta));
    }

    unSubscribePhysicsUpdate(): void {
        if (this.physicsUpdateSubscription) {
            this.physicsUpdateSubscription.unsubscribe();
            this.physicsUpdateSubscription = undefined;
        }
    }
}
