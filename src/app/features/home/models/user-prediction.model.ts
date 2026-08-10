import { SeasonPrediction } from "../../predictions/models/season-prediction.model";
export type UserRole = 'USER' | 'ADMIN';
export interface User {
  id: string;
  userName: string;
  role: UserRole;
}
export interface UserPrediction {
    user: User
    seasonPrediction: SeasonPrediction,
    createdAt: string,
    updatedAt?: string
}

export interface LoginCredentials {
  userName: string;
  password: string;
}