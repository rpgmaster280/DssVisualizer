
if ! [ -f "env/bin/activate" ]; then
	echo "Unable to find needed file. Please run installer.sh.";
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
