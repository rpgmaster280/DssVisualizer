#!/bin/bash -e

BASEDIR=`dirname $0`/..

if [ ! -d "$BASEDIR/ve" ]; then
	virtualenv -q $BASEDIR/ve --no-site-packages
	echo "Virtualenv created."
fi

if [ ! -d  "/usr/share/doc/gir1.2-webkit-3.0" ]; then 
	apt-get install gir1.2-webkit-3.0 
	echo "Webkit-3.0 Installed"
fi


if [ ! -f "$BASEDIR/ve/updated" -o $BASEDIR/requirements.pip -nt $BASEDIR/ve/updated ]; then
        apt-get install python3-pip
	python3 -m pip install -r $BASEDIR/requirements.pip
        python -m pip install -r $BASEDIR/requirements.pip
	touch $BASEDIR/ve/updated
	echo "Requirements installed."
fi
