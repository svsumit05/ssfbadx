export class User {
    public userId: string;
    public firstname: string;
    public lastname: string;
    public email: string;
    public avatarUrl: string;
    public creationDate: string;
    public preferredLang: string;
    public connected = false;
    public permissions: any;
    public ticket: string;
    public role: string;
    public branch: string;
    public branch_id: string;
    public user_extra_info: any;

    public constructor(data: any = {}) {
        this.userId = data.userId || '';
        this.firstname = data.firstname || '';
        this.lastname = data.lastname || '';
        this.email = data.email || '';
        this.avatarUrl = data.avatarUrl || '';
        this.creationDate = data.creation_date || Date.now();
        this.preferredLang = data.preferredLang || null;
        this.connected = data.connected || false;
        this.permissions = data.permissions || [];
        this.ticket = data.ticket || '';
        this.role = data.role || '';
        this.branch = data.branch || '';
        this.branch_id = data.branch_id || '';
        this.user_extra_info = data.user_extra_info || [];
    }

    public getName() {
        return this.firstname + ' ' + this.lastname;
    }

    public getProfileImage() {
        return this.firstname.charAt(0) + this.lastname.charAt(0);
    }

    public canCurrentUser(permission: string) {
        return this.permissions.indexOf(permission) > -1;
    }

}
