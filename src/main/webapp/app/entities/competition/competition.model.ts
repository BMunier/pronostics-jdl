import { BaseEntity } from './../../shared';

export class Competition implements BaseEntity {
    constructor(
        public id?: number,
        public nom?: string,
        public description?: string,
        public dateDebut?: any,
        public dateFin?: any,
        public equipe?: BaseEntity,
        public pays?: BaseEntity,
        public stade?: BaseEntity,
    ) {
    }
}
