import { BaseEntity, User } from './../../shared';

export class Classement  {
    constructor(
        public idUtilisateur?: number,
        public nomUtilisateur?: string,
        public prenomUtilisateur?: string,
        public nbPointsTotal?: number,
        public nbPronosPartiels?: number,
        public nbPronosFaux?: number,
        public nbPronosJoues?: number

    ) {
    }
}
