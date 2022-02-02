import { Subject } from 'rxjs';

import { DimensionsWH } from './dimensions-wh';

export class CoreGlobals {
    /** Properties */
    static isDevelopmentMode: boolean;
    static canvasDimensions: DimensionsWH;
    /** Outputs */
    static canvasResize$: Subject<DimensionsWH> = new Subject<DimensionsWH>();
    static loopUpdate$: Subject<number> = new Subject<number>();
    static physicsUpdate$: Subject<number> = new Subject<number>();
    /** Inputs */
    static onError$: Subject<string> = new Subject<string>();
}
