/**
 * @Author Alexander Bassov Tue Jun 11 2024
 * @Email blackxes.dev@gmail.com
 */

import {
  AuthorizationCodeConfig,
  AuthorizationCodeResponse,
  ImplicitGrantConfig,
  ImplicitGrantResponse,
  OneTabConfig,
  OneTabResponse,
  RevokationResponse,
} from "./types";

/**
 * Google client library wrapper to simplify the use of the library
 */
class GoogleSignInServiceClass {
  #clientId: string = "";
  #scope: string = "";

  /**
   * Initializes the service
   * @param clientId
   * @param scope
   */
  initialize(clientId: string, scope?: string) {
    this.#clientId = clientId;
    this.#scope = scope ?? "";
  }

  /**
   * Displays the One Tap prompt or the browser native credential manager
   * after the initialize() method is invoked.
   */
  oneTab(options?: Partial<OneTabConfig>): Promise<OneTabResponse> {
    return new Promise((resolve) => {
      const _options = { client_id: this.#clientId, ...options };

      if (!_options.client_id) return;

      google.accounts.id.initialize({
        ..._options,
        callback: resolve,
      });
      google.accounts.id.prompt((moment) => {
        resolve({
          dismissedReason: moment.getDismissedReason(),
          momentType: moment.getMomentType(),
        });
      });
    });
  }

  /**
   * Starts the OAuth 2.0 Code UX flow.
   */
  authorizationCode(
    options?: Partial<AuthorizationCodeConfig>
  ): Promise<AuthorizationCodeResponse> {
    return new Promise((resolve) => {
      const _options = {
        client_id: this.#clientId,
        scope: this.#scope,
        ...options,
      };

      if (!_options.client_id) return;

      const client = google.accounts.oauth2.initCodeClient({
        ..._options,
        callback: resolve,
        error_callback: resolve,
      });
      client.requestCode();
    });
  }

  /**
   * Starts the OAuth 2.0 Token UX flow
   */
  implicitGrant(
    options?: Partial<ImplicitGrantConfig>
  ): Promise<ImplicitGrantResponse> {
    return new Promise((resolve) => {
      const _options = {
        client_id: this.#clientId,
        scope: this.#scope,
        ...options,
      };

      if (!_options.client_id) return;

      const client = google.accounts.oauth2.initTokenClient({
        ..._options,
        callback: resolve,
        error_callback: resolve,
      });
      client.requestAccessToken();
    });
  }

  /**
   * Revokes the OAuth grant used to share the ID token for the specified
   * user.
   */
  revokeGrants(hint: string): Promise<RevokationResponse> {
    return new Promise((resolve) => google.accounts.id.revoke(hint, resolve));
  }

  /**
   * Checks if all given scopes are granted
   */
  checkAllScopes(
    tokenResponse: google.accounts.oauth2.TokenResponse,
    scopes: string
  ): Promise<boolean> {
    return new Promise((resolve) => {
      resolve(
        google.accounts.oauth2.hasGrantedAllScopes(tokenResponse, scopes)
      );
    });
  }

  /**
   * Checks if any given scopes are granted
   */
  checkAnyScopes(
    tokenResponse: google.accounts.oauth2.TokenResponse,
    scopes: string
  ): Promise<boolean> {
    return new Promise((resolve) => {
      resolve(google.accounts.oauth2.hasGrantedAnyScope(tokenResponse, scopes));
    });
  }
}

const GoogleSignInService = new GoogleSignInServiceClass();

export default GoogleSignInService;
