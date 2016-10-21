from core.config.configReader import ConfigReader
from core.apis.datasource.common import Common

class PyClick:
    """PyClick API.  Most of these methods must be overwritten in your plugin.
    Datasource plugin must have a file named pyClick.py with a class name of PyClick
    """

    def getPlugin(self):
        """Internal method to get an instance of the active plugin"""
        return ConfigReader().getInstanceOfDatasourcePlugin("PyClick")


    def selectClickData(self, startDate, endDate):
        """Override: Select the click data by start and end date. The input here will be strings, datetimes will be passed to the plugin.

        :param startDate: The a string value of the local datetime to begin search on
        :type startDate: str
        :param endDate: The a string value of the local datetime to end search on
        :type endDate: str
        :returns: JSON object
        """
        pyClick = self.getPlugin()
        jsonData = pyClick.selectClickData(Common().formatDateStringToUTC(startDate), Common().formatDateStringToUTC(endDate))
        return jsonData

    def selectClickDataById(self, dataId):
        """Override: Select the Click data by its ID

        :param dataId: The ID of the Data point
        :type dataId: str
        :returns: JSON object
        """
        pyClick = self.getPlugin()
        jsonData = pyClick.selectClickDataById(dataId)
        return jsonData

    def insertFixedClickData(self, dataId, clicks_id, content, className, start, title, typeClick):
        """Override: Inserts a new record of the data. Does not overwrite the original key press.

        :param oldDataId: The key of the original click data
        :type oldDataId: str
        :param content: The updated content
        :type content: str
        :param _type: The updated type
        :type _type: str
        :param classname: The updated class name
        :type classname: str
        :param title: The updated title
        :type title: str
        :param start: The string value of the updated datetime of the event, datetime UTC will be passed to the plugin.
        :type start: str
        :returns: newly created id.
        """
        pyClick = self.getPlugin()
        result = pyClick.insertFixedClickData(dataId, clicks_id, content, className, Common().formatDateStringToUTC(start), title, typeClick)
        return result

    def updateFixedClickData(self, dataId, clicks_id, content, className, start, title, typeClick):
        """Override: Updates the record of the 'fixed' click data.

        :param dataId: The ID of the 'fixed' click data to edit.
        :type dataId: str
        :param content: The updated content
        :type content: str
        :param _type: The updated type
        :type _type: str
        :param classname: The updated class name
        :type classname: str
        :param title: The updated title
        :type title: str
        :param start: The string value of the updated datetime of the event, datetime UTC will be passed to the plugin.
        :type start: str
        :returns: The modified count.
        """
        pyClick = self.getPlugin()
        result = pyClick.updateFixedClickData(dataId, clicks_id, content, className, Common().formatDateStringToUTC(start), title, typeClick)
        return result

    def deleteFixedClickData(self, dataId):
        """Override: Delete a 'fixed' click data.

        :param dataId: The ID of the 'fixed' data to delete
        :type dataId: str
        :returns: The deleted count.
        """
        pyClick = self.getPlugin()
        result = pyClick.deleteFixedClickData(dataId)
        return result

    def addAnnotationClick(self, dataId, annotationText):
        """Override: Add an annotation to the Click object.

        :param dataId: The ID of the data to add the annotation to.
        :type dataId: str
        :param annotationText: The annotation text
        :type annotationText: str
        :returns: The modified count.
        """
        pyClick = self.getPlugin()
        return pyClick.addAnnotationClick(dataId, annotationText)

    # edit an annotation for the dataId
    def editAnnotationClick(self, dataId, oldAnnotationText, newAnnotationText):
        """Override: Edit an annotation on the Click object.

        :param dataId: The ID of the data to edit the annotation of.
        :type dataId: str
        :param oldAnnotationText: The old annotation text
        :type oldAnnotationText: str
        :param newAnnotationText: The new annotation text
        :type newAnnotationText: str
        :returns: The modified count.
        """
        pyClick = self.getPlugin()
        return pyClick.editAnnotationClick(dataId, oldAnnotationText, newAnnotationText)

    #delete an annotation for the dataId
    def deleteAnnotationClick(self, dataId, annotationText):
        """Override: Delete one annotation from the Click object.

        :param dataId: The ID of the data to remove the annotation from.
        :type dataId: str
        :param annotationText: The annotation text to remove.
        :type annotationText: str
        :returns: The modified count.
        """
        pyClick = self.getPlugin()
        return pyClick.deleteAnnotationClick(dataId, annotationText)

    # deletes all annotations for the dataId
    def deleteAllAnnotationsForClick(self, dataId):
        """Override: Delete all annotations from the Click object.

        :param dataId: The ID of the data to remove all annotations from.
        :type dataId: str
        :returns: The modified count.
        """
        pyClick = self.getPlugin()
        return pyClick.deleteAllAnnotationsForClick(dataId)

    # add an annotation to the timeline, not a datapoint
    def addAnnotationToClickTimeline(self, startTime, annotationText):
        """Override: Ands an annotation to the timeline (not a data point)

        :param startTime: The datetime string in local time to add the annotation to.  Will be converted to UTC before passing on to plugin
        :type startTime: str
        :param annotationText: The annotation text to add.
        :type annotationText: str
        :returns: The modified count.
         """

        pyClick = self.getPlugin()
        return pyClick.addAnnotationToClickTimeline(Common().formatDateStringToUTC(startTime), annotationText)
