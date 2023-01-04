import request  from "supertest";
import chai from "chai";
import chaiHttp from "chai-http";
import { expect } from "chai";
import { describe, it } from "mocha";
import Application from "../src/app";
import itParam from "mocha-param";
import exp from "constants";

const infra = Application.instance();

/////////////////////////////////////////////////////////////////////////////////////////////////////

describe('Chat testing', function () {

    var agent = request.agent(infra._app);
    var firstUserId = "fcd89488-0a30-4c15-8b49-cf2e3f6e9f68";
    var secondUserId = "091d3464-b361-4a85-9e78-1f8765a994a8";
    var conversationId = "8348cac8-ba45-4d65-8937-d78b1d3215af";
    var messageId = "f7a65fb5-1a39-406e-80ea-7491eb480761";

    it('01: Starting a conversation', async () =>{
        const startConversation = globalThis.TestCache.StartConversation;
        agent
            .post('/api/v1/chats/conversations/start')
            .send(startConversation)
            .expect(res => {
                
                expect(res.body.Data).to.have.property('Conversation');
                
                expect(res.body.Data.Conversation).to.have.property('id');
                expect(res.body.Data.Conversation).to.have.property('IsGroupConversation');
                expect(res.body.Data.Conversation).to.have.property('Marked');
                expect(res.body.Data.Conversation).to.have.property('InitiatingUserId');
                expect(res.body.Data.Conversation).to.have.property('OtherUserId');
                expect(res.body.Data.Conversation).to.have.property('Topic');
                expect(res.body.Data.Conversation).to.have.property('Users');

                startConversation['id'] = res.body.Data.Conversation.id;
                startConversation['InitiatingUserId'] = res.body.Data.Conversation.InitiatingUserId;
                startConversation['OtherUserId'] = res.body.Data.Conversation.OtherUserId;

                expect(res.body.Data.Conversation.id).to.equal(startConversation.id);
                expect(res.body.Data.Conversation.InitiatingUserId).to.equal(startConversation.InitiatingUserId);
                expect(res.body.Data.Conversation.OtherUserId).to.equal(startConversation.OtherUserId);

            })
            .expect(201);
    });
    
    it('02: User sends a message',async () => {
        const firstUserSendsMessage = globalThis.TestCache.FirstUserSendsMessage;
        agent
            .post('/api/v1/chat/conversations/:conversationId/messages')
            .send(firstUserSendsMessage)
            .expect(res => {

                expect(res.body.Data).to.have.property('ChatMessage');

                expect(res.body.Data.ChatMessage).to.have.property('id');
                expect(res.body.Data.ChatMessage).to.have.property('SenderId');
                expect(res.body.Data.ChatMessage).to.have.property('ConversationId');
                expect(res.body.Data.ChatMessage).to.have.property('Message');
                expect(res.body.Data.ChatMessage).to.have.property('UpdatedAt');
                expect(res.body.Data.ChatMessage).to.have.property('CreatedAt');

                firstUserSendsMessage['id'] = res.body.Data.ChatMessage.id;
                firstUserSendsMessage['SenderId'] = res.body.Data.ChatMessage.SenderId;
                firstUserSendsMessage['ConversationId'] = res.body.Data.ChatMessage.ConversationId;
                firstUserSendsMessage['Message'] = res.body.Data.ChatMessage.Message;

                expect(res.body.Data.ChatMessage.id).to.equal(firstUserSendsMessage.id);
                expect(res.body.Data.ChatMessage.SenderId).to.equal(firstUserSendsMessage.SenderId);
                expect(res.body.Data.ChatMessage.ConversationId).to.equal(firstUserSendsMessage.ConversationId);
                expect(res.body.Data.ChatMessage.Message).to.equal(firstUserSendsMessage.Message);

            })
            .expect(201);
    });

    it('03: Get conversation between 2 users',async () => {
        agent
            .get('/api/v1/chats/conversations/first-user/:firstUserId/second-user/:secondUserId')
            .expect(res => {
                
                expect(res.body.Data).to.have.property('Conversation');
                
                expect(res.body.Data.Conversation).to.have.property('id');
                expect(res.body.Data.Conversation).to.have.property('IsGroupConversation');
                expect(res.body.Data.Conversation).to.have.property('Marked');
                expect(res.body.Data.Conversation).to.have.property('InitiatingUserId');
                expect(res.body.Data.Conversation).to.have.property('OtherUserId');
                expect(res.body.Data.Conversation).to.have.property('Topic');
                expect(res.body.Data.Conversation).to.have.property('Users');

            })
            .expect(200);
    });

    itParam('04: Get marked conversations',[firstUserId],async () => {
        agent
            .get('/api/v1/chats/users/:userId/conversations/marked')
            .expect(res => {

                expect(res.body.Data).to.have.property('Conversations');
                
                expect(res.body.Data.Conversation).to.have.property('id');
                expect(res.body.Data.Conversation).to.have.property('IsGroupConversation');
                expect(res.body.Data.Conversation).to.have.property('Marked');
                expect(res.body.Data.Conversation).to.have.property('InitiatingUserId');
                expect(res.body.Data.Conversation).to.have.property('OtherUserId');
                expect(res.body.Data.Conversation).to.have.property('Topic');
                expect(res.body.Data.Conversation).to.have.property('Users');

                expect(res.body.Data.Conversation.Marked).to.equal(true);
                
            })
            .expect(200);
    });

    itParam('05: Get recent user conversation',[firstUserId],async () => {
        agent
            .get('/api/v1/chats/users/:userId/conversations/recent')
            .expect(res => {
                expect(res.body.Data).to.have.property('Conversations');
                
                expect(res.body.Data.Conversation).to.have.property('id');
                expect(res.body.Data.Conversation).to.have.property('IsGroupConversation');
                expect(res.body.Data.Conversation).to.have.property('Marked');
                expect(res.body.Data.Conversation).to.have.property('InitiatingUserId');
                expect(res.body.Data.Conversation).to.have.property('OtherUserId');
                expect(res.body.Data.Conversation).to.have.property('Topic');
                expect(res.body.Data.Conversation).to.have.property('Users');

                expect(res.body.Data.Conversation.InitiatingUserId).to.equal(firstUserId) || expect(res.body.Data.Conversation.OtherUserId).to.equal(firstUserId);

            })
            .expect(200);
    });

    itParam('06: Search user conversation',[secondUserId],async () => {
        agent
            .get('/api/v1/chats/users/:userId/conversations/search')
            .expect(res=> {

                expect(res.body.Data).to.have.property('UserConversations');

                expect(res.body.Data.UserConversations).to.have.property('TotalCount');
                expect(res.body.Data.UserConversations).to.have.property('RetrievedCount');
                expect(res.body.Data.UserConversations).to.have.property('PageIndex');
                expect(res.body.Data.UserConversations).to.have.property('ItemsPerPage');
                expect(res.body.Data.UserConversations).to.have.property('Items');

                expect(res.body.Data.UserConversations.Items).to.have.property('id');
                expect(res.body.Data.UserConversations.Items).to.have.property('IsGroupConversation');
                expect(res.body.Data.UserConversations.Items).to.have.property('Marked');
                expect(res.body.Data.UserConversations.Items).to.have.property('InitiatingUserId');
                expect(res.body.Data.UserConversations.Items).to.have.property('OtherUserId');
                expect(res.body.Data.UserConversations.Items).to.have.property('Topic');
                expect(res.body.Data.UserConversations.Items).to.have.property('Users');

                expect(res.body.Data.UserConversations.Items.InitiatingUserId).to.equal(firstUserId) || expect(res.body.Data.UserConversations.Items.OtherUserId).to.equal(firstUserId);

            })
            .expect(200);
    });
    
    itParam('07: Get conversation messages',[conversationId],async () => {
        agent
            .get('/api/v1/chats/conversations/:conversationId/messages')
            .expect(res => {
                expect(res.body.Data).to.have.property('ConversationMessages');

                expect(res.body.Data.ConversationMessages).to.have.property('id');
                expect(res.body.Data.ConversationMessages).to.have.property('ConversationId');
                expect(res.body.Data.ConversationMessages).to.have.property('SenderId');
                expect(res.body.Data.ConversationMessages).to.have.property('Message');

                expect(res.body.Data.ConversationMessages.ConversationId).to.equal(conversationId);
            })
            .expect(200);
    });

    itParam('08: Get conversation by ID',[conversationId],async () => {
        agent
            .get('/api/v1/chats/conversations/:conversationId')
            .expect(res=> {

                expect(res.body.Data).to.have.property('Conversations');
                
                expect(res.body.Data.Conversation).to.have.property('id');
                expect(res.body.Data.Conversation).to.have.property('IsGroupConversation');
                expect(res.body.Data.Conversation).to.have.property('Marked');
                expect(res.body.Data.Conversation).to.have.property('InitiatingUserId');
                expect(res.body.Data.Conversation).to.have.property('OtherUserId');
                expect(res.body.Data.Conversation).to.have.property('Topic');
                expect(res.body.Data.Conversation).to.have.property('Users');

                expect(res.body.Data.Conversation.id).to.equal(conversationId);

            })
            .expect(200);
        
    });

    itParam('09: Update conversation by ID',[conversationId],async () => {
        const updateConversationById = globalThis.TestCache.UpdateConversationById;

        agent
            .put('/api/v1/chats/conversations/:conversationId')
            .send(updateConversationById)
            .expect(res=>{

                expect(res.body.Data).to.have.property('Conversation');
                
                expect(res.body.Data.Conversation).to.have.property('id');
                expect(res.body.Data.Conversation).to.have.property('IsGroupConversation');
                expect(res.body.Data.Conversation).to.have.property('Marked');
                expect(res.body.Data.Conversation).to.have.property('InitiatingUserId');
                expect(res.body.Data.Conversation).to.have.property('OtherUserId');
                expect(res.body.Data.Conversation).to.have.property('Topic');
                expect(res.body.Data.Conversation).to.have.property('Users');

                updateConversationById['Marked'] = res.body.Data.Conversation.Marked;
                updateConversationById['Topic'] = res.body.Data.Conversation.Topic;

                expect(res.body.Data.Conversation.Marked).to.equal(updateConversationById.Marked);
                expect(res.body.Data.Conversation.Topic).to.equal(updateConversationById.Topic);

            })
            .expect(200);
    
    });

    itParam('10: Delete conversation by ID',[conversationId],async () => {
        agent
            .delete('/api/v1/chats/conversations/:conversationId')
            .expect(res=> {
                
                expect(res.body.Data).to.have.property('Deleted');

                expect(res.body.Data.Deleted).of.equal(true);
            })
            .expect(200);
    });

    itParam('11: Get message by ID',[messageId],async () => {
        agent
            .get('/api/v1/chats/messages/:messageId')
            .expect(res=>{

                expect(res.body.Data).to.have.property('ChatMessage');

                expect(res.body.Data.ChatMessage).to.have.property('id');
                expect(res.body.Data.ChatMessage).to.have.property('SenderId');
                expect(res.body.Data.ChatMessage).to.have.property('ConversationId');
                expect(res.body.Data.ChatMessage).to.have.property('Message');

                expect(res.body.Data.ChatMessage.id).to.equal(messageId);

            })
            .expect(200);

    });

    it('12: Update message by ID',async () => {
        const updateMessageById = globalThis.TestCache.UpdateMessageById;

        agent
            .put('/api/v1/chats/messages/:messageId')
            .send(updateMessageById)
            .expect(res=>{

                expect(res.body.Data).to.have.property('ChatMessage');

                expect(res.body.Data.ChatMessage).to.have.property('id');
                expect(res.body.Data.ChatMessage).to.have.property('SenderId');
                expect(res.body.Data.ChatMessage).to.have.property('ConversationId');
                expect(res.body.Data.ChatMessage).to.have.property('Message');

                expect(res.body.Data.ChatMessage.Message).to.equal(globalThis.TestCache.UpdateMessageById.Message);

            })
            .expect(200);
    });

    itParam('13: Delete message by ID',[messageId],async () => {
        agent
            .delete('/api/v1/chats/messages/:messageId')
            .expect(res=> {
                
                expect(res.body.Data).to.have.property('Deleted');

                expect(res.body.Data.Deleted).of.equal(true);
            })
            .expect(200);

    });

});
