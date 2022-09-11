#!/bin/bash
#add fix to exercise6-fix here
#test ./exercise6-fix.sh /vagrant/Vagrantfile /tmp 

ARGUMENTS=$#

if [ $ARGUMENTS -lt 2 ] ; then
    echo "Please insert the correct number of arguments [min 2 arguments]"
    exit
else 
echo $ARGUMENTS
fi

# check for passed args? 
# check for passed files? 
# check for passed directories? 
# check for file size"? 