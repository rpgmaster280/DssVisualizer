
class IRequest:
    def __init__(self, request_label, db_connection):
        self.db_connection = db_connection
        self.request_label = request_label
    
    def getRequestLabel(self):
        return self.request_label
    
    def setUserInput(self, user_input):
        self.user_input = user_input
        
    def getUserInput(self):
        return self.user_input
    
    def validateInput(self):
        raise RuntimeWarning("Method not implemented")
    
    def processRequest(self, server_state_info):
        raise RuntimeWarning("Method not implemented")
    
    def changeConnection(self, new_connection):
        self.db_connection = new_connection

