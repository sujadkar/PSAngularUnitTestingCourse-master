import { MessageService } from "./message.service"

describe('MessageService',() => {
    let messageService : MessageService;

    beforeEach(() => {
    });

    it('should have no messages to start',() => {
        messageService = new MessageService();
   
        expect(messageService.messages.length).toBe(0);
    })

    
    it('should add message when add is called',() => {
        messageService = new MessageService();
   
        messageService.add('message1');

        expect(messageService.messages.length).toBe(1);
    })

    it('should remove all messages when clear is called',() => {
        //Arrange
        messageService = new MessageService();
        messageService.add('message1');
        
        //Act
        messageService.clear();

        //Assert
        expect(messageService.messages.length).toBe(0);
    })
})