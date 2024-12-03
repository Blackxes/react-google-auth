/**
 * @Author Alexander Bassov Tue Jun 18 2024
 * @Email blackxes.dev@gmail.com
 */

import { InvalidTokenError, jwtDecode } from "jwt-decode";
import { TokenInfoErrorResponse, TokenInfoResponse } from "./types";

/**
 * Sends a request to the tokeninfo endpoint and returns the token information
 * @param token Either access_token, id_token or token_handle
 * @returns Information about the given token
 */
export const getTokenInfo = async (
  token: string,
  tokenType: "access_token" | "id_token"
) => {
  const url =
    "https://www.googleapis.com/oauth2/v1/tokeninfo?" + tokenType + "=" + token;
  const response = await fetch(url);
  const result: TokenInfoResponse | TokenInfoErrorResponse =
    await response.json();

  return result;
};

/** Aliases of @function getTokenInfo */
export const getAccessTokenInfo = async (token: string) =>
  getTokenInfo(token, "access_token");
/** Aliases of @function getTokenInfo */
export const getIdTokenInfo = async (token: string) =>
  getTokenInfo(token, "id_token");

/**
 * Parses the jwt token and returns its payload
 */
export const decodeJwt = (jwt: string) => {
  try {
    return jwtDecode(jwt);
  } catch (error) {
    return error as InvalidTokenError;
  }
};
