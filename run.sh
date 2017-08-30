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

if ! [ -f "env/bin/activate" ]; then
	echo "Unable to find a required file. Please run installer.sh.";
	exit 1;
fi;

source env/bin/activate;
cd app/webserver;
service mongodb start;
python3 flask_webserver.py
service mongodb stop;
cd ../..;
deactivate;
exit 0;
