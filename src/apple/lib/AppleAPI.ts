import axios from "axios"
import jwt from "jsonwebtoken"
import { AppleAPIContructorProps, GetAuthTokenParams, AppleAuthTokenResponse, AppleGetUserInfoParams } from "../../types";

const APPLE_ID_HOST = "https://appleid.apple.com"

class AppleAPI {
    private keyId: string
    private teamId: string
    private clientId: string
    private pem: Buffer
    private redirectURI: string
    private responseType: string = "code"
    private responseMode: string = "form_post"
    private grantType: string = "authorization_code"

    constructor({ keyId, teamId, clientId, pem, redirectURI }: AppleAPIContructorProps) {
        this.keyId = keyId
        this.teamId = teamId
        this.clientId = clientId
        this.pem = pem
        this.redirectURI = redirectURI
    }
    
    getAuthURL = (): string | null => {
        try {
            const authURL = `${APPLE_ID_HOST}/auth/authorize?response_type=${this.responseType}&response_mode=${this.responseMode}&client_id=${this.clientId}&redirect_uri=${this.redirectURI}&scope=name email`
            return authURL
        } catch (e) {
            console.error(e)
            return null
        }
    }

    private getClientSecret = (): string | null => {
        try {
            const privateKey = this.pem
            const headers = {
                kid: this.keyId,
                typ: undefined, // is there another way to remove type?
            }
            const claims = {
                iss: this.teamId,
                aud: APPLE_ID_HOST,
                sub: this.clientId,
            }
            const token = jwt.sign(claims, privateKey, {
                algorithm: 'ES256',
                header: headers,
                expiresIn: '24h',
            })
            return token
        } catch (e) {
            console.error(e)
            return null
        }
    }

    getAuthToken = async ({ code }: GetAuthTokenParams): Promise<AppleAuthTokenResponse | null> => {
        try {
            const url = `${APPLE_ID_HOST}/auth/token?client_id=${this.clientId}&client_secret=${this.getClientSecret()}&code=${code}&grant_type=${this.grantType}`
            const result = await axios.post<AppleAuthTokenResponse>(url)
            if (!result || !result.data) {
                throw Error("APPLE AUTH TOKEN ERROR")
            }
            return result.data
        } catch (e) {
            console.error(e)
            return null
        }
    }

    getUserInfo = ({ idToken }: AppleGetUserInfoParams) => {
        try {
            const decoded = jwt.decode(idToken)
            return decoded
        } catch (e) {
            console.error(e)
            return null
        }
    }
}

export default AppleAPI