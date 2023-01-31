import { BannedUserDomainModel } from '../../domain.types/banned.user/banned.user.domain.type';
import { BannedUserDto } from '../../domain.types/banned.user/banned.user.dto';

////////////////////////////////////////////////////////////////////////////////////////////////

export interface IBannedUserRepo {

    create(UserDomainModel: BannedUserDomainModel): Promise<BannedUserDto>;

    getById(id: string): Promise<BannedUserDto>;

    // getByClientCode(clientCode: string): Promise<ApiClientDto>;

    // getClientHashedPassword(id: string): Promise<string>;

    // getApiKey(id: string): Promise<ClientApiKeyDto>;

    // setApiKey(id: string, apiKey: string, validFrom: Date, validTill: Date): Promise<ClientApiKeyDto>;

    // isApiKeyValid(apiKey: string): Promise<CurrentClient>;

    // update(id: string, userDomainModel: ChatUserDomainModel): Promise<ChatUserDto>;

    // search(filters: ApiClientSearchFilters): Promise<ApiClientSearchResults>;

    delete(id: string): Promise<boolean>;

    getAllUsers(): Promise<BannedUserDto[]>

}
