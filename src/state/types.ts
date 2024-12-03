/**
 * @Author Alexander Bassov Sun Jun 16 2024
 * @Email blackxes.dev@gmail.com
 */

import { PromptMomentResponse } from "../services/types";

export interface AuthReduxState {
  isSigningIn: boolean;
  accessTokenResponse?: google.accounts.oauth2.TokenResponse | null;
  credentialResponse?: google.accounts.id.CredentialResponse | null;
  clientError?: google.accounts.oauth2.ClientConfigError | null;
  promptMoment?: PromptMomentResponse | null;
}

export type AuthError =
  | google.accounts.oauth2.ClientConfigError
  | PromptMomentResponse;

export type TokenInfoResponse = {
  issued_to: string;
  audience: string;
  user_id: string;
  expires_in: number;
  email: string;
  email_verified: boolean;
  issuer: string;
  issued_at: number;
};

export type TokenInfoErrorResponse = {
  error: string;
  error_description: string;
};
