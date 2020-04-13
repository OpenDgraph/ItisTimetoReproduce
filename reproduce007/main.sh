#! /usr/bin/env bash

PWD=$(pwd)
NAME="John Doe"

echo "Starting test at ${PWD}"

echo "
#####################################################################################################################
Dgraph Version - $(dgraph -h | grep version)
#####################################################################################################################
"

PID_Terminal=$$

# sleep 7
echo "PID_Terminal = ${PID_Terminal}"

# Download dataset

sh ./download_dataset.sh

# Run tests

sh ./test_01.sh

sleep 10
sh ./clean.sh

echo 'before main closed'
sleep 2
exit 0
kill -15 $PID_Terminal
