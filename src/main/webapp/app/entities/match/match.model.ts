import { BaseEntity } from './../../shared';

export const enum StatutMatch {
    'PAS_DEMARRE',
    'EN_COURS',
    'TERMINE'
}

export const enum PhaseCompetition {
    'GROUPE',
    'HUITIEME',
    'QUART',
    'DEMI',
    'FINAL'
}

export class Match implements BaseEntity {
    constructor(
        public id?: number,
        public scoreEquipeDomicile?: number,
        public scoreEquipeVisiteur?: number,
        public date?: any,
        public statut?: StatutMatch,
        public phaseCompetition?: PhaseCompetition,
        public groupe?: string,
        public stade?: BaseEntity,
        public equipeDomicile?: BaseEntity,
        public equipeVisiteur?: BaseEntity,
        public competition?: BaseEntity,
    ) {
    }
}
