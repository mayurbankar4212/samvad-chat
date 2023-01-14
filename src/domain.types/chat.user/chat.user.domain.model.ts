
export interface ChatUserDomainModel {
    id?: string;
    Name: string;
    Avatar?: string;
    ProfileLink?: string;
    Phone?: string;
    Email?: string;
}

export interface ApiClientVerificationDomainModel {
    ClientCode: string;
    Password: string;
    ValidFrom: Date;
    ValidTill: Date;
}
