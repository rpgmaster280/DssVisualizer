# Copyright (C) 2017  Jamie Acosta, Robert McCain
#
# This file is part of DssVisualizer.
# 
# DssVisualizer is free software: you can redistribute it and/or modify
# it under the terms of the GNU General Public License as published by
# the Free Software Foundation, either version 3 of the License, or
# (at your option) any later version.
# 
# DssVisualizer is distributed in the hope that it will be useful,
# but WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
# GNU General Public License for more details.
# 
# You should have received a copy of the GNU General Public License
# along with DssVisualizer.  If not, see <http://www.gnu.org/licenses/>.

class IRequest:
    def __init__(self, request_label):
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

