

class DssResponse:
	def __init__(self, success, message, data):
		self.success = success
		self.message = message
		self.data = data
		
	def isSuccessful(self):
		return self.success
		
	def getMessage(self):
		return self.message
		
	def getData(self):
		return self.data
		
	def toJSON(self):
		raise RuntimeError("Not implemented")