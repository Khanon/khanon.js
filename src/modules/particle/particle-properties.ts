import { ParticleEndCriteria } from './particle-end-criteria';
import { Motion } from '../motion/motion';
import { MotionProperties } from '../motion/motion-properties';

export interface ParticleProperties {
    x?: number;
    y?: number;
    z?: number;
    scale?: number;
    alpha?: number;
    motion?: Motion;
    endCriteria?: ParticleEndCriteria;
    endValue?: number;
}
