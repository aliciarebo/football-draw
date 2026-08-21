import { CreateSeasonPredictionRequest } from "../../predictions/models/create-season-prediction-request.model";
import { SeasonPrediction } from "../../predictions/models/season-prediction.model";
export type UserRole = 'USER' | 'ADMIN';
export interface User {
  id: number;
  userName: string;
  role: UserRole;
}
export interface UserPrediction {
    user: User;
    seasonPrediction: SeasonPrediction;
    createdAt: string;
    updatedAt?: string | null;
}

export interface LoginCredentials {
  userName: string;
  password: string;
}
export interface LoginResponse {
  user: User;
  token: string;
  refreshToken: string;
}

export interface UserCreationRequest{
  userName: string;
  password: string;
}

export interface UserPredictionResponse {
  id: number;
  user: User;
  seasonPrediction: CreateSeasonPredictionRequest;
  createdAt: string;
  updatedAt?: string | null;
}