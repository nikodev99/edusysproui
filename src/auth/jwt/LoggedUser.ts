import LocalStorageManager from "@/core/LocalStorageManager.ts";
import {jwt} from "@/core/utils/text_display.ts";
import {UserProfile} from "../dto/user.ts";
import {School} from "@/entity";
import {Role} from "../dto/role.ts";

export class LoginUser {
    private static instance : LoginUser | null = null

    private cachedUser: UserProfile | null = null
    private cashedToken: string | null = null
    private cashedRefreshToken: string | null = null
    private cashedSchool: School | null = null

    static getInstance() {
        if (LoginUser.instance === null) {
            LoginUser.instance = new LoginUser()
        }
        return LoginUser.instance
    }

    public getUser(): UserProfile | null {
        if (this.cachedUser === null) {
            this.cachedUser = LocalStorageManager.get<UserProfile>(jwt.user)
        }
       return this.cachedUser
    }

    public getToken(): string | null {
        if (this.cashedToken === null) {
            this.cashedToken = LocalStorageManager.get<string>(jwt.tokenKey)
        }
        return this.cashedToken
    }

    getRefreshToken(): string | null {
        if (this.cashedRefreshToken === null) {
            this.cashedRefreshToken = LocalStorageManager.get<string>(jwt.refreshTokenKey)
        }
        return this.cashedRefreshToken
    }

    getSchool(): School | null {
        if (this.cashedSchool === null) {
            this.cashedSchool = LocalStorageManager.get<School>(jwt.school)
        }
        return this.cashedSchool
    }

    getRole(): Role[] | null {
        return LocalStorageManager.get<Role[]>(jwt.roles)
    }

    public setUser(user: UserProfile) {
        LocalStorageManager.update<UserProfile>(jwt.user, () => user)
    }

    public setToken(token: string) {
        LocalStorageManager.update<string>(jwt.tokenKey, () => token)
    }

    public setRefreshToken(token: string) {
        LocalStorageManager.update<string>(jwt.refreshTokenKey, () => token)
    }

    public setSchool(school: School) {
        LocalStorageManager.update<School>(jwt.school, () => school)
    }

    public setRoles(roles: Role[]) {
        LocalStorageManager.update<Role[]>(jwt.roles, () => roles)
    }

    public removeUser() {
        LocalStorageManager.remove(jwt.user)
    }

    public removeToken() {
        LocalStorageManager.remove(jwt.tokenKey)
    }

    public removeRefreshToken() {
        LocalStorageManager.remove(jwt.refreshTokenKey)
    }

    public removeSchool() {
        LocalStorageManager.remove(jwt.school)
    }

    public removeRoles() {
        LocalStorageManager.remove(jwt.roles)
    }

    public clearCache() {
        this.cachedUser = null
        this.cashedToken = null
        this.cashedRefreshToken = null
        this.cashedSchool = null
        this.removeRoles()
    }

}

export const loggedUser = LoginUser.getInstance()