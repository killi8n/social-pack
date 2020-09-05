export { OAuth2Client, Credentials } from "google-auth-library"
export { oauth2_v2 } from "googleapis"

export interface GoogleAPIConstructorProps {
    clientId: string
    clientSecret: string
    redirectURI: string
}

export interface KakaoAPIConstructorProps {
    clientId: string
    redirectURI: string
}

export interface AppleAPIContructorProps {
    keyId: string
    teamId: string
    clientId: string
    redirectURI: string
    pem: Buffer
}

export interface GetAuthTokenParams {
    code: string
}

export interface KakaoAuthTokenResponse {
    access_token: string
    token_type: string
    refresh_token: string
    expires_in: number
    scope: string
    refresh_token_expires_in: number
}

export interface KakaoProfileParams {
    authorization: string
}

export interface KakaoProfileResponse {
    id: number
    connected_at: Date
    kakao_account: {
        profile_needs_agreement: boolean
        profile: {
            nickname: string
            thumbnail_image_url: string
            profile_image_url: string
        }
    }
}

export interface AppleAuthTokenResponse {
    access_token: string
    token_type: string
    expires_in: number
    refresh_token: string
    id_token: string
}

export interface AppleGetUserInfoParams {
    idToken: string
}

export interface AppleUserInfoDecoded {
    iss: string
    aud: string
    exp: number
    iat: number
    sub: string
    at_hash: string
    email: string
    email_verified: "true" | "false"
    auth_time: number
    nonce_supported: boolean
}