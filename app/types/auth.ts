export interface RegisterFormData {
    email: string;
    password: string;
  }
  
  export interface LoginFormData {
    email: string;
    password: string;
  }
  
  export interface AuthResponse {
    success: boolean;
    token?: string;
    error?: string;
    user?: {
      id: number;
      email: string;
    };
  }