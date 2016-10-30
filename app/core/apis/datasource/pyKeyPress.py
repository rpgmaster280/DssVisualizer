#  Copyright (C) 2016  Jamie Acosta, Jennifer Weand, Juan Soto, Mark Eby, Mark Smith, Andres Olivas
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

from core.config.configReader import ConfigReader
from core.apis.datasource.common import Common


class PyKeyPress:
    """PyKeyLogger API.  Most of these methods must be overwritten in your plugin.
    Datasource plugin must have a file named pyKeyPress.py with a class name of PyKeyPress
    """

    def getPlugin(self):
        """Internal method to get an instance of the active plugin"""
        return ConfigReader().getInstanceOfDatasourcePlugin("PyKeyPress")

    # Keypress#
    def selectKeyPressData(self, startDate, endDate, techName, eventName):
        """Override: Select the key press data by start and end date. The input here will be strings, datetimes will be passed to the plugin.

        :param startDate: The a string value of the local datetime to begin search on
        :type startDate: str
        :param endDate: The a string value of the local datetime to end search on
        :type endDate: str
        :param techName: The technician name to return data
        :type: str
        :param: eventName: The name of the event to return data
        :type: str
        :returns: JSON object
        """
        pyKeyPress = self.getPlugin()
        jsonData = pyKeyPress.selectKeyPressData(Common().formatDateStringToUTC(startDate),
                                                 Common().formatDateStringToUTC(endDate), techName, eventName)
        return jsonData

    def selectKeyPressDataById(self, dataId):
        """Override: Select the key press data by its ID

        :param dataId: The ID of the Data point
        :type dataId: str
        :returns: JSON object
        """
        pyKeyPress = self.getPlugin()
        jsonData = pyKeyPress.selectKeyPressDataById(dataId)
        return jsonData

    def insertFixedKeyPressData(self, dataId, keypress_id, content, className, start):
        """Override: Inserts a new record of the data. Does not overrite the original key press.

        :param oldDataId: The key of the original key press data
        :type oldDataId: str
        :param content: The updated content
        :type content: str
        :param className: The updtaed class name
        :type className: str
        :param start: The string value of the updated datetime of the event, datetime UTC will be passed to the plugin.
        :type start: str
        :returns: newly created id.
        """
        pyKeyPress = self.getPlugin()
        result = pyKeyPress.insertFixedKeyPressData(dataId, keypress_id, content, className,
                                                    Common().formatDateStringToUTC(start))
        return result

    def updateFixedKeyPressData(self, dataId, keypress_id, content, className, start):
        """Override: Updates the record of the 'fixed' key press data.

        :param dataId: The ID of the 'fixed' key press data to edit.
        :type dataId: str
        :param content: The updated content
        :type content: str
        :param className: The updtaed class name
        :type className: str
        :param start: The string value of the updated datetime of the event, datetime UTC will be passed to the plugin.
        :type start: str
        :returns: The modified count.
        """
        pyKeyPress = self.getPlugin()
        result = pyKeyPress.updateFixedKeyPressData(dataId, keypress_id, content, className,
                                                    Common().formatDateStringToUTC(start))
        return result

    def deleteFixedKeyPressData(self, dataId):
        """Override: Delete a 'fixed' key press data.

        :param dataId: The ID of the 'fixed' data to delete
        :type dataId: str
        :returns: The deleted count.
        """
        pyKeyPress = self.getPlugin()
        return pyKeyPress.deleteFixedKeyPressData(dataId)

    def addAnnotationKeyPress(self, dataId, annotationText):
        """Override: Add an annotation to the key press object.

        :param dataId: The ID of the data to add the annotation to.
        :type dataId: str
        :param annotationText: The annotation text
        :type annotationText: str
        :returns: The modified count.
        """
        pyKeyPress = self.getPlugin()
        return pyKeyPress.addAnnotationKeyPress(dataId, annotationText)

    # edit an annotation for the dataId
    def editAnnotationKeyPress(self, dataId, oldAnnotationText, newAnnotationText):
        """Override: Edit an annotation on the key press object.

        :param dataId: The ID of the data to edit the annotation of.
        :type dataId: str
        :param oldAnnotationText: The old annotation text
        :type oldAnnotationText: str
        :param newAnnotationText: The new annotation text
        :type newAnnotationText: str
        :returns: The modified count.
        """
        pyKeyPress = self.getPlugin()
        return pyKeyPress.editAnnotationKeyPress(dataId, oldAnnotationText, newAnnotationText)

    # delete an annotation for the dataId
    def deleteAnnotationKeyPress(self, dataId, annotationText):
        """Override: Delete one annotation from the key press object.

        :param dataId: The ID of the data to remove the annotation from.
        :type dataId: str
        :param annotationText: The annotation text to remove.
        :type annotationText: str
        :returns: The modified count.
        """
        pyKeyPress = self.getPlugin()
        return pyKeyPress.deleteAnnotationKeyPress(dataId, annotationText)

    # deletes all annotations for the dataId
    def deleteAllAnnotationsForKeyPress(self, dataId):
        """Override: Delete all annotations from the key press object.

        :param dataId: The ID of the data to remove all annotations from.
        :type dataId: str
        :returns: The modified count.
        """
        pyKeyPress = self.getPlugin()
        return pyKeyPress.deleteAllAnnotationsForKeyPress(dataId)

    # add an annotation to the timeline, not a datapoint
    def addAnnotationToKeyPressTimeline(self, startTime, annotationText):
        """Override: Ands an annotation to the timeline (not a data point)

        :param startTime: The datetime string in local time to add the annotation to.  Will be converted to UTC before passing on to plugin
        :type startTime: str
        :param annotationText: The annotation text to add.
        :type annotationText: str
        :returns: The modified count.
         """

        pyKeyPress = self.getPlugin()
        return pyKeyPress.addAnnotationToKeyPressTimeline(Common().formatDateStringToUTC(startTime), annotationText)