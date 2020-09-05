import { google, oauth2_v2 } from "googleapis"
import { GoogleAPIConstructorProps, GetAuthTokenParams, OAuth2Client, Credentials } from "../../types"

class GoogleAPI {
    private clientId: string
    private clientSecret: string
    private redirectURI: string

    private oauth2Client: OAuth2Client

    constructor(constructorProps: GoogleAPIConstructorProps) {
        const { clientId, clientSecret, redirectURI } = constructorProps
        this.clientId = clientId
        this.clientSecret = clientSecret
        this.redirectURI = redirectURI
        
        this.oauth2Client = new google.auth.OAuth2(
            this.clientId,
            this.clientSecret,
            this.redirectURI
        )
        google.options({ auth: this.oauth2Client })
    }

    getAuthURL = (): string | null => {
        try {
            const authURL = this.oauth2Client.generateAuthUrl({
                access_type: 'offline',
                scope: ['profile', 'email'],
            })
            return authURL
        } catch (e) {
            console.error(e)
            return null
        }
    }

    getAuthToken = async ({ code }: GetAuthTokenParams): Promise<Credentials | null> => {
        try {
            const result = await this.oauth2Client.getToken(decodeURIComponent(code))
            this.oauth2Client.credentials = result.tokens
            return result.tokens
        } catch (e) {
            console.error(e)
            return null
        }
    }

    getUserInfo = async (): Promise<oauth2_v2.Schema$Userinfo | null> => {
        try {
            const userInfo = await google.oauth2({
                auth: this.oauth2Client,
                version: "v2"
            }).userinfo.get()
            return userInfo.data
        } catch (e) {
            console.error(e)
            return null
        }
    }
}

export default GoogleAPI