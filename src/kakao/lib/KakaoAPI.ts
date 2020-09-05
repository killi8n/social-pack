import { KakaoAPIConstructorProps, GetAuthTokenParams, KakaoAuthTokenResponse, KakaoProfileParams, KakaoProfileResponse } from "../../types"
import axios from "axios"

const KAKAO_OAUTH_HOST = "https://kauth.kakao.com/oauth"
const KAKAO_API_HOST = "https://kapi.kakao.com/v2"

class KakaoAPI {
    private clientId: string
    private redirectURI: string
    private responseType: string = "code"
    private grantType: string = "authorization_code"

    constructor({ clientId, redirectURI }: KakaoAPIConstructorProps) {
        this.clientId = clientId
        this.redirectURI = redirectURI
    }

    getAuthURL = (): string | null => {
        try {
            const kakaoURL = `${KAKAO_OAUTH_HOST}/authorize?client_id=${this.clientId}&redirect_uri=${this.redirectURI}&response_type=${this.responseType}`
            return kakaoURL
        } catch (e) {
            console.error(e)
            return null
        }
    }

    getAuthToken = async ({ code }: GetAuthTokenParams): Promise<KakaoAuthTokenResponse | null> => {
        try {
            const kakaoTokenURL = `${KAKAO_OAUTH_HOST}/token?client_id=${this.clientId}&redirect_uri=${this.redirectURI}&grant_type=${this.grantType}&code=${code}`
            const result = await axios.post<KakaoAuthTokenResponse>(kakaoTokenURL)
            if (!result || !result.data) {
                throw Error("no kakao auth token data")
            }
            return result.data
        } catch (e) {
            console.error(e)
            return null
        }
    }

    getUserProfile = async ({ authorization }: KakaoProfileParams) => {
        try {
            const kakaoUserProfileURL = `${KAKAO_API_HOST}/user/me?property_keys=["kakao_account.profile"]`
            const result = await axios.get<KakaoProfileResponse>(kakaoUserProfileURL, {
                headers: {
                    authorization
                }
            })
            if (!result || !result.data) {
                throw Error("no kakao profile data")
            }
            return result.data
        } catch (e) {
            console.error(e)
            return null
        }
    }
}

export default KakaoAPI