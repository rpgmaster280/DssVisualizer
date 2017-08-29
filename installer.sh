
if ! apt-get update; then
	echo "Unable to update apt repo. Exiting...";
	exit 1;
fi;

if ! apt-get install python3 python3-pip python3-virtualenv mongodb; then
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

echo -e "\
	 source env/bin/activate;\n\
	 cd app/webserver;\n\
	 service mongodb start;\n\
	 python3 flask_webserver.py\n\
	 service mongodb stop;\n\
	 cd ../..;\n\
	 deactivate;\n\
	" > run.sh;
chmod +x run.sh;

deactivate;
echo "Installation successful.  Please use run.sh to run the web server.";
exit 0;
