#!/bin/bash
#add fix to exercise1 here
# route not installed on vag machine.
sudo su
apt update
apt install net-tools ; route delete 208.86.224.90
curl http://www.textfiles.com/art/bnbascii.txt