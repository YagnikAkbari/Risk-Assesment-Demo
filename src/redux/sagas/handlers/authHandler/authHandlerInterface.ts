export interface SignupResponse {
  message: string;
  user: {
    id: string;
    email: string;
    name: string;
    slug: string;
    location: string;
    company_size: string;
    is_active: boolean;
  };
}

export interface VerifyOtpResponse {
  message: string;
}

export interface SigninResponse {
  company_name: string;
  access_token: string;
}
