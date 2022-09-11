#!/bin/bash
#add fix to exercise5-server1 here
sudo apt-get install sshpass
sudo -u vagrant ssh-keygen -t rsa -N "" -f /home/vagrant/.ssh/id_rsa
echo "StrictHostKeyChecking no" >> /home/vagrant/.ssh/config