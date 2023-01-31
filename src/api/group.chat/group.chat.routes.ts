import express from 'express';
import { GroupChatController } from '../group.chat/group.chat.controller';
import { Loader } from '../../startup/loader';

///////////////////////////////////////////////////////////////////////////////////

export const register = (app: express.Application): void => {

    const router = express.Router();
    const authenticator = Loader.authenticator;
    const controller = new GroupChatController();

    //router.post('/group/conversations/start', controller.startGroupConversation);
    router.post('/group/create', controller.createGroup);
    router.post('/group/conversations/:conversationId/messages', controller.sendGroupMessage);
    router.get('/group/conversations/:conversationId/messages', controller.getGroupConversationMessages);
    router.get('/group/conversations/:conversationId', controller.getGroupConversationById);
    router.put('/group/conversations/:conversationId/:userId', controller.updateGroupConversation);
    router.delete('/group/conversations/:conversationId', controller.deleteGroupConversation);
    router.post('/group/conversations/:conversationId/users/:userId/add',controller.addUsersToGroupConversation);
    router.get('/group/messages/:messageId', controller.getGroupMessage);
    router.put('/group/messages/:messageId', controller.updateGroupMessage);
    router.delete('/group/messages/:messageId', controller.deteteGroupMessage);
    router.get('/group/users/:userId/conversations/recent', controller.getRecentConversationsForUser);
    router.put('/group/setting/:adminId/:conversationId/:userId', controller.makeGroupAdmin);

    app.use('/api/v1/chats', router);
};
