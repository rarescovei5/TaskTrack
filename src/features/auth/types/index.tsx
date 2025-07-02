export interface RefreshResponse {
  accessToken: string;
}

export interface LoginResponse {
  accessToken: string;
  user: {
    id: string;
    email: string;
    username: string;
    profilePictureUrl: string | null;
    subscriptionPlan: SubscriptionPlans;
  };
}
export interface Credentials {
  email: string;
  password: string;
}

export enum SubscriptionPlans {
  Free,
  Pro,
}

export interface UserData {
  id: string;
  email: string;
  username: string;
  profilePictureUrl: string | null;
  subscriptionPlan: SubscriptionPlans;
}
