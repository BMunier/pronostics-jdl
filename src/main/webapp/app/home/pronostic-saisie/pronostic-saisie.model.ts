import { BaseEntity, User } from './../../shared';
import { Pronostic } from '../../entities/pronostic';
import { Stade } from '../../entities/stade';
import { StatutMatch, PhaseCompetition } from '../../entities/match';

export class PronosticSaisie implements BaseEntity {
    constructor(
        public id?: number,
        public scoreEquipeDomicile?: number,
        public scoreEquipeVisiteur?: number,
        public points?: number,
        public match?: BaseEntity,
        public utilisateur?: User,
        public updated?:boolean
    ) {
    }
}
