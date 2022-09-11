#!/bin/bash
#add fix to exercise3 here
sudo -u root chmod +x /etc/apache2/sites-available/
sed -i 's/\(.*\)denied/\Require all granted/' /etc/apache2/sites-available/000-default.conf
service apache2 restart
curl http://192.168.100.10