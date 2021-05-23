export class Classement  {
    constructor(
        public idUtilisateur?: number,
        public username?: string,
        public nomUtilisateur?: string,
        public prenomUtilisateur?: string,
        public nbPointsTotal?: number,
        public nbPronosJustes?: number,
        public nbPronosPartiels?: number,
        public nbPronosFaux?: number,
        public nbPronosJoues?: number,
        public position?: number

    ) {
    }
}
