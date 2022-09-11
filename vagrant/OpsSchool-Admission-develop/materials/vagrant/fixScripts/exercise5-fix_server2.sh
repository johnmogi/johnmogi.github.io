#!/bin/bash
#add fix to exercise5-server2 here
sudo apt-get update
sudo apt-get install sshpass
sudo -u vagrant ssh-keygen -t rsa -N "" -f /home/vagrant/.ssh/id_rsa
sshpass -p vagrant ssh -o StrictHostKeyChecking=no vagrant@192.168.100.10 cat /home/vagrant/.ssh/id_rsa.pub >> /home/vagrant/.ssh/authorized_keys
sshpass -p vagrant scp /home/vagrant/.ssh/id_rsa.pub vagrant@192.168.100.10:/home/vagrant/.ssh/server2.pub
sshpass -p vagrant ssh -o StrictHostKeyChecking=no vagrant@192.168.100.10 "cat /home/vagrant/.ssh/server2.pub >> /home/vagrant/.ssh/authorized_keys"
echo "StrictHostKeyChecking no" >> /home/vagrant/.ssh/config