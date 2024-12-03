/**
 * @Author Alexander Bassov Wed Jun 19 2024
 * @Email blackxes.dev@gmail.com
 */

// Responses
export type PromptMomentResponse = {
  momentType?: ReturnType<
    google.accounts.id.PromptMomentNotification["getMomentType"]
  >;
  dismissedReason?: ReturnType<
    google.accounts.id.PromptMomentNotification["getDismissedReason"]
  >;
};
export type OneTabResponse =
  | google.accounts.id.CredentialResponse
  | PromptMomentResponse;
export type AuthorizationCodeResponse =
  | google.accounts.oauth2.CodeResponse
  | google.accounts.oauth2.ClientConfigError;
export type ImplicitGrantResponse =
  | google.accounts.oauth2.TokenResponse
  | google.accounts.oauth2.ClientConfigError;
export type RevokationResponse = google.accounts.id.RevocationResponse;
export type CredentialResponse = google.accounts.id.CredentialResponse;

// Configs
export type OneTabConfig = Omit<google.accounts.id.IdConfiguration, "callback">;
export type AuthorizationCodeConfig = Omit<
  google.accounts.oauth2.CodeClientConfig,
  "callback" | "error_callback"
>;
export type ImplicitGrantConfig = Omit<
  google.accounts.oauth2.TokenClientConfig,
  "callback" | "error_callback"
>;
export type ImplicitGrantOverrideConfig =
  google.accounts.oauth2.OverridableTokenClientConfig;

// Clients
export type AuthorizationCodeClient = google.accounts.oauth2.CodeClient;
export type ImplicitGrantClient = google.accounts.oauth2.TokenClient;
