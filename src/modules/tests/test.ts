/* eslint-disable linebreak-style */
import chaiHttp = require("chai-http");
import chai = require('chai');
import { expect } from "chai";
import app from "../../app";

describe('Chat testing', function () {
    
    it('Starting a conversation', async () =>{
        const res = await chai.request(app).post('/conversations/start');
        expect(res).to.have.status(201);
        expect(res.body.Data).to.have.property('Conversation');
        expect(res.body.Data.Conversation).to.have.property('InitiatingUserId');
        expect(res.body.Data.Conversation).to.have.property('OtherUserId');
    });
    
    it('User sends a message',async () => {
        const res = await chai.request(app).post('/conversations/:conversationId/messages');
        expect(res).to.have.status(201);
        expect(res.body.Data).to.have.property('ChatMessage');
        expect(res.body.Data.Conversation).to.have.property('SenderId');
        expect(res.body.Data.Conversation).to.have.property('Message');
    });

    it('Get conversation between 2 users',async () => {
        const res = await chai.request(app).get('/conversations/first-user/:firstUserId/second-user/:secondUserId');
        expect(res).to.have.status(200);
        expect(res.body.Data).to.have.property('Conversation');
    });

    it('Get marked conversations',async () => {
        const res = await chai.request(app).get('/users/:userId/conversations/marked');
        expect(res).to.have.status(200);
        expect(res.body.Data).to.have.property('Conversation');
        expect(res.body.Data.Conversation).to.have.property('Marked');
    });

    it('Get recent user conversation',async () => {
        const res = await chai.request(app).get('/users/:userId/conversations/recent');
        expect(res).to.have.status(200);
        expect(res.body.Data).to.have.property('Conversation');
    });

    it('Get conversation messages',async () => {
        const res = await chai.request(app).get('/conversations/:conversationId/messages');
        expect(res).to.have.status(200);
        expect(res.body.Data).to.have.property('ConversationMessages');
    });

    it('Search user conversation',async () => {
        const res = await chai.request(app).get('/users/:userId/conversations/search');
        expect(res).to.have.status(200);
        expect(res.body.Data).to.have.property('UserConversations');
    });

    it('Search user conversation',async () => {
        const res = await chai.request(app).get('/users/:userId/conversations/search');
        expect(res).to.have.status(200);
        expect(res.body.Data).to.have.property('UserConversations');
    });

    it('Get conversation by ID',async () => {
        const res = await chai.request(app).get('/conversations/:conversationId');
        expect(res).to.have.status(200);
        expect(res.body.Data).to.have.property('Conversation');
    });

    it('Update conversation by ID',async () => {
        const res = await chai.request(app).put('/conversations/:conversationId');
        expect(res).to.have.status(200);
        expect(res.body.Data).to.have.property('Conversation');
        expect(res.body.Data.Conversation).to.have.property('Topic');
        expect(res.body.Data.Conversation).to.have.property('Marked');
    });

    it('Delete conversation by ID',async () => {
        const res = await chai.request(app).delete('/conversations/:conversationId');
        expect(res).to.have.status(200);
        expect(res.body.Data).to.have.property('Deleted');
    });

    it('Get message by ID',async () => {
        const res = await chai.request(app).get('/messages/:messageId');
        expect(res).to.have.status(200);
        expect(res.body.Data).to.have.property('ChatMessage');
    });

    it('Update message by ID',async () => {
        const res = await chai.request(app).put('/messages/:messageId');
        expect(res).to.have.status(200);
        expect(res.body.Data).to.have.property('ChatMessage');
        expect(res.body.Data.ChatMessage).to.have.property('id');
        expect(res.body.Data.ChatMessage).to.have.property('SenderId');
    });

    it('Delete message by ID',async () => {
        const res = await chai.request(app).delete('/messages/:messageId');
        expect(res).to.have.status(200);
        expect(res.body.Data).to.have.property('Deleted');
    });

});
