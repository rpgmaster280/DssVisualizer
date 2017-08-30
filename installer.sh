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

if ! apt-get update; then
	echo "Unable to update apt repo. Exiting...";
	exit 1;
fi;

if ! apt-get install python3 python3-pip python3-virtualenv mongodb mongodb-server -y; then
	echo "Unable to install missing dependencies from apt repo. Exiting...";
	exit 1;
fi;

python3 -m virtualenv env;
source env/bin/activate;

if ! pip3 install flask; then
	echo "Unable to install flask using pip3. Exiting...";
	deactivate;
	exit 1;
fi;

if ! pip3 install pymongo; then
	echo "Unable to install pymongo using pip3. Exiting...";
	deactivate;
	exit 1;
fi;

deactivate;

echo "Installation successful.  Please use run.sh to run the web server.";
exit 0;
