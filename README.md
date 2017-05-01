## pvlogweb
Pvlogweb is a web interface for the pvlog datalogger.

## Installation
Installation is dependent of webserver. In the following it is shown for
apache.

Install dependencies:
- apache
- wsgi interface for apache
- virtualenv

On debian like system they can be installed by:
```sh
sudo apt-get install apache2 libapache2-mod-wsgi virtualenv
```

Create and activate virtualenv:
```sh
virtualenv venv
source venv/bin/activate
```
Extract and install pvlogweb:
```sh
tar -xvf pvlogweb*.tar
python pvlogweb*/setup.py install
```

create directory for pvlogweb
```sh
sudo mkdir /var/www/pvlogweb
```

copy data to pvlogweb
```sh
sudo cp venv /var/www/pvlogweb
sudo cp pvlogweb*/static /var/www/pvlogweb
```

Set correct rights
```sh
sudo chown -R www-data /var/www/pvlogweb
sudo chgrp -R www-data /var/www/pvlogweb
sudo chmod -R 550 /var/www/pvlogweb
```

Setup password file
```sh
sudo mkdir /var/lib/pvlogweb
sudo cp pvlogweb*/password.conf /var/lib/pvlogweb/
sudo chown -R www-data /var/pvlib/pvlogweb
sudo chgrp -R www-data /var/pvlib/pvlogweb
sudo chmod -R 770 /var/pvlib/pvlogweb
```

Enable web site
```sh
sudo cp pvlogweb*/pvlogweb.conf /etc/apache2/sites-available/
sudo sudo a2ensite pvlogweb.conf
```
