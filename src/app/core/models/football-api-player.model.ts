export interface PlayersApiResponse {
  success: boolean;
  data: FootballApiPlayer[];
  meta: MetaData;
}

export interface FootballApiPlayer {
  player_id: number;
  player_name: string;
  nationality: string;
  position: string;
}

export interface MetaData {
  pagination: Pagination;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  total_pages: number;
}