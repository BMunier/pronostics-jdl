import { BaseEntity } from './../../shared';

export class Equipe implements BaseEntity {
    constructor(
        public id?: number,
        public codeEquipe?: string,
        public nomEquipe?: string,
        public rangFifa?: number,
        public ecussonContentType?: string,
        public ecusson?: any,
        public pays?: BaseEntity,
        public competitions?: BaseEntity[],
    ) {
    }
}
