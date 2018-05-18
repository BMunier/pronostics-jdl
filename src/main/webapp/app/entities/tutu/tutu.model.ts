import { BaseEntity } from './../../shared';

export class Tutu implements BaseEntity {
    constructor(
        public id?: number,
        public date?: any,
        public toto?: BaseEntity,
    ) {
    }
}
