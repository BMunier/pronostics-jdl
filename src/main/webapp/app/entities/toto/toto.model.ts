import { BaseEntity } from './../../shared';

export class Toto implements BaseEntity {
    constructor(
        public id?: number,
        public nom?: string,
        public prenom?: string,
        public age?: string,
    ) {
    }
}
