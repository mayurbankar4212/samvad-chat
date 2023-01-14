
export interface ChatUserDto {
    id: string;
    Name: string;
    Avatar: string;
    ProfileLink: string;
    Email: string;
    Phone: string;
}

export interface ClientApiKeyDto {
    id: string;
    ClientName: string;
    ClientCode: string;
    ApiKey: string;
    ValidFrom: Date;
    ValidTill: Date;
}
