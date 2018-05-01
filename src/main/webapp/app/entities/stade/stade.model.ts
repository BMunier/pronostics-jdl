import { BaseEntity } from './../../shared';

export class Stade implements BaseEntity {
    constructor(
        public id?: number,
        public nom?: string,
        public ville?: string,
        public pays?: BaseEntity,
    ) {
    }
}
