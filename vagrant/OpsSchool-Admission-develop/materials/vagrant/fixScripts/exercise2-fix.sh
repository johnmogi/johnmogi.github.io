#!/bin/bash
#add fix to exercise2 here
# curl http://www.ascii-art.de/ascii/ab/007.txt - will work in machine, not in script.
sudo chmod +x /etc/hosts
sudo sed -i '/ascii.art.de/d' /etc/hosts
© 2022 GitHub, Inc.