// import express from 'express';
// import { ChatController } from './chat.controller';
// import { Loader } from '../../startup/loader';

// ///////////////////////////////////////////////////////////////////////////////////

// export const register = (app: express.Application): void => {

//     const router = express.Router();
//     const authenticator = Loader.authenticator;
//     const controller = new ChatController();

//     router.post('/conversations/start', authenticator.authenticateClient, controller.startConversation);
//     router.post('/conversations/:conversationId/messages', authenticator.authenticateClient, controller.sendMessage);
//     router.post('/conversations/:conversationId/users/:userId/add', authenticator.authenticateClient, controller.addUserToConversation);
//     router.post('/conversations/:conversationId/users/:userId/remove', authenticator.authenticateClient, controller.removeUserFromConversation);
//     router.get('/conversations/first-user/:firstUserId/second-user/:secondUserId', authenticator.authenticateClient, controller.getConversationBetweenTwoUsers);
//     router.get('/users/:userId/conversations/marked', authenticator.authenticateClient, controller.getMarkedConversationsForUser);
//     router.get('/users/:userId/conversations/recent', authenticator.authenticateClient, controller.getRecentConversationsForUser);
//     router.get('/users/:userId/conversations/search', authenticator.authenticateClient, controller.searchUserConversations);
//     router.get('/conversations/:conversationId/messages', authenticator.authenticateClient, controller.getConversationMessages);
//     router.get('/conversations/:conversationId', authenticator.authenticateClient, controller.getConversationById);
//     router.put('/conversations/:conversationId', authenticator.authenticateClient, controller.updateConversation);
//     router.delete('/conversations/:conversationId', authenticator.authenticateClient, controller.deleteConversation);
//     router.get('/messages/:messageId', authenticator.authenticateClient, controller.getMessage);
//     router.put('/messages/:messageId', authenticator.authenticateClient, controller.updateMessage);
//     router.delete('/messages/:messageId', authenticator.authenticateClient, controller.deleteMessage);

//     app.use('/api/v1/chats', router);
// };
