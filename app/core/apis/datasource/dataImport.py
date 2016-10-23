from core.config.configReader import ConfigReader

class DataImport:

    def importKeypressData(self, jsonData):
        pyKeyPress = ConfigReader().getInstanceOfDatasourcePlugin("PyKeyPress")
        insertedCount = pyKeyPress.importKeypressData(jsonData)
        return insertedCount

    def importClick(self, jsonData):
        pyClick = ConfigReader().getInstanceOfDatasourcePlugin("PyClick")
        insertedCount = pyClick.importClick(jsonData)
        return insertedCount

    def importTimed(self, jsonData):
        pyTimed = ConfigReader().getInstanceOfDatasourcePlugin("PyTimed")
        insertedCount = pyTimed.importTimed(jsonData)
        return insertedCount

    def importTsharkThroughput(self, jsonData):
        tsharkThroughput = ConfigReader().getInstanceOfDatasourcePlugin("TsharkThroughput")
        insertedCount = tsharkThroughput.importTsharkThroughputData(jsonData)
        return insertedCount

    def importMultiExcludeThroughput(self, jsonData):
        multiExcludeThroughput = ConfigReader().getInstanceOfDatasourcePlugin("MultiExcludeThroughput")
        insertedCount = multiExcludeThroughput.importMultiExcludeThroughputData(jsonData)
        return insertedCount

    def importMultiIncludeThroughput(self, jsonData):
        multiInclude = ConfigReader().getInstanceOfDatasourcePlugin("MultiIncludeThroughput")
        insertedCount = multiInclude.importMultiIncludeThroughputData(jsonData)
        return insertedCount

    def importMultiExcludeProtocol(self, jsonData):
        multiExcludeProtocol = ConfigReader().getInstanceOfDatasourcePlugin("MultiExcludeProtocol")
        insertedCount = multiExcludeProtocol.importMultiExcludeProtocolData(jsonData)
        return insertedCount

    def importMultiIncludeProtocol(self, jsonData):
        multiIncludeProtocol = ConfigReader().getInstanceOfDatasourcePlugin("MultiIncludeProtocol")
        insertedCount = multiIncludeProtocol.importMultiIncludeProtocolData(jsonData)
        return insertedCount

    def importTsharkProtocol(self, jsonData):
        tsharkProtocol = ConfigReader().getInstanceOfDatasourcePlugin("TsharkProtocol")
        insertedCount = tsharkProtocol.importTsharkProtocolData(jsonData)
        return insertedCount
