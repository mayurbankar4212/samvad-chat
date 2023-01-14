import { ChatUserDomainModel } from '../../domain.types/chat.user/chat.user.domain.model';
import { ChatUserDto } from '../../domain.types/chat.user/chat.user.dto';

////////////////////////////////////////////////////////////////////////////////////////////////

export interface IChatUserRepo {

    create(UserDomainModel: ChatUserDomainModel): Promise<ChatUserDto>;

    // getById(id: string): Promise<ApiClientDto>;

    // getByClientCode(clientCode: string): Promise<ApiClientDto>;

    // getClientHashedPassword(id: string): Promise<string>;

    // getApiKey(id: string): Promise<ClientApiKeyDto>;

    // setApiKey(id: string, apiKey: string, validFrom: Date, validTill: Date): Promise<ClientApiKeyDto>;

    // isApiKeyValid(apiKey: string): Promise<CurrentClient>;

    // update(id: string, clientDomainModel: ApiClientDomainModel): Promise<ApiClientDto>;

    // search(filters: ApiClientSearchFilters): Promise<ApiClientSearchResults>;

    // delete(id: string): Promise<boolean>;

}
