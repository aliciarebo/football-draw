import { Team } from "./team-model";

export interface Player {
  id: number;
  name: string;
  position: string | null;
  teamId?: number;
}