import { BaseEntity, User } from './../../shared';

export class Pronostic implements BaseEntity {
    constructor(
        public id?: number,
        public scoreEquipeDomicile?: number,
        public scoreEquipeVisiteur?: number,
        public points?: number,
        public match?: BaseEntity,
        public utilisateur?: User,
    ) {
    }
}
