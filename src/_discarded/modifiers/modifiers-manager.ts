/**
 * Modifiers are meant to add functionalities or modify properties of Actors or Scenes.
 * Modifeiers can be used from outer the container and also be combined with other modifiers.
 */
/*
import * as Misc from '../../misc';
import { Modifier } from './modifier';
import { Logger } from '../../modules/logger/logger';

export class ModifiersManager {
    private readonly modifiers: Misc.KeyValue<string, any> = new Misc.KeyValue<string, any>();

    add<T>(modifier: Modifier): T {
        if (this.modifiers.get(modifier.id)) {
            Logger.warn(`Can't add modifier, Id already exists: ${modifier.id}`);
            return undefined;
        }
        this.modifiers.add(modifier.id, modifier);
        return this.modifiers.get(modifier.id);
    }

    get<T>(modifierId: string): T {
        const modifier = this.modifiers.get(modifierId);
        if (!modifier) {
            Logger.error('Modifier not found:', modifierId);
            return undefined;
        }
        return modifier;
    }
}
*/
