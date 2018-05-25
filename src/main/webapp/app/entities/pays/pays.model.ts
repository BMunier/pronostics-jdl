import { BaseEntity } from './../../shared';

export class Pays implements BaseEntity {
    constructor(
        public id?: number,
        public nom?: string,
        public codeIso?: string,
        public drapeauContentType?: string,
        public drapeau?: any,
        public competitions?: BaseEntity[],
    ) {
    }
}
