export interface FootballApiTeam {
  id: number;
  name: string;
  tla: string;
  crest: string;
}

export interface CompetitionTeamsResponse {
  teams: FootballApiTeam[];
}