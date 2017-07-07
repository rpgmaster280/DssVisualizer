'''
Created on Jun 27, 2017

@author: root
'''

from dss_requests.IRequest import IRequest

class GetAllPluginsRequest(IRequest):
    def __init__(self, connection):
        super().__init__("GET_PLUGINS_REQUEST", connection)
        
    def validateInput(self):
        return True
    
    def processRequest(self):
        raise RuntimeWarning("Method not implemented")