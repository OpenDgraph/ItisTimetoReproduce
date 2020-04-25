#! /usr/bin/env bash

set -e

PWD=$(pwd)
PID_Terminal=$$

echo "
#####################################################################################################################
TEST RUNNING - Test Bulkload and shards with 2 groups
#####################################################################################################################
"
echo "Starting test at ${PWD}"
echo "PID_Terminal = ${PID_Terminal}"

source ./nodes/main.sh

install #remove this if don't need to update to latest Dgraph version

datafile=dataset1.rdf
dataschema=my.schema

# zero starts in the same command bellow.
bulk "-f ./datasets/$datafile" "-s ./datasets/$dataschema" --num_go_routines=4 --num_go_routines=1 --map_shards=4 --reduce_shards=2

sleep 2
# Start nodes
zero

_cwd=$(pwd)

# First Alpha node
alpha --cwd="$_cwd/out/0/"
PID_ALPHA_0=$PID_ALPHA

sleep 4
# Second Alpha node
alpha --my localhost:7081 -o 1 --cwd="$_cwd/out/1/"

sleep 2
echo "PID_ZERO = ${PID_ZERO}"
echo "PID_ALPHA = ${PID_ALPHA}"
echo "PID_ALPHA_0= ${PID_ALPHA_0}"

sleep 300
kill -15 $PID_ALPHA
kill -15 $PID_ALPHA_0
kill -15 $PID_ZERO

sleep 1
echo 'test exited with 0'
exit 0

