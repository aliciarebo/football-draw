import { Team } from "./team-model";

export interface Player {
  id: string;
  playerName: string;
  position?: string;
  team?: Team;
}