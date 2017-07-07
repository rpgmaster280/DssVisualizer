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

import subprocess
import os
import time

class CommandLine:

    def main():
        
        #Start the flask web server
        p = subprocess.Popen(["python3", os.getcwd() + "/webserver/flask_webserver.py"], 
            stdout=subprocess.PIPE, 
            stderr=subprocess.PIPE)

        #Give webserver a little bit of time to start
        time.sleep(0.25)

        #Start the WebKit
        import webserver.webkit_browser
        
        #Shutdown web server
        subprocess.call(["kill", str(p.pid)])
        
        #Block until web server shuts down
        #p.wait()
        output, errors = p.communicate()
        print(output.decode("utf-8"))
        print(errors.decode("utf-8"))

    if __name__ == "__main__":
        main()
        
