/**
 * @Author Alexander Bassov Tue Dec 03 2024
 * @Email blackxes.dev@gmail.com
 */

export const isCredentialResponse = (
  v: any
): v is google.accounts.id.CredentialResponse => {
  return "credential" in v;
};

export const isTokenResponse = (
  v: any
): v is google.accounts.oauth2.TokenResponse => {
  return "access_token" in v;
};

export const isCodeResponse = (
  v: any
): v is google.accounts.oauth2.CodeResponse => {
  return "code" in v;
};

export const isClientConfigError = (
  v: any
): v is google.accounts.oauth2.ClientConfigError => {
  return "message" in v && "type" in v;
};
