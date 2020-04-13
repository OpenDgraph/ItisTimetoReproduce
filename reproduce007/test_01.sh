#! /usr/bin/env bash

PWD=$(pwd)
PID_Terminal=$$

echo "
#####################################################################################################################
TEST RUNNING - Encrypted Backups and Restores
#####################################################################################################################
"
echo "Starting test at ${PWD}"
echo "PID_Terminal = ${PID_Terminal}"

source ./nodes/main.sh

datafile=1million.rdf.gz
dataschema=1million.schema

dd if=/dev/random bs=1 count=32 of=enc_key_file

bulk '--encryption_key_file ./enc_key_file' "-f ./datasets/$datafile" "-s ./datasets/$dataschema"

sleep 8

# Turn on Encryption
zero
alpha '--encryption_key_file ./enc_key_file'

sleep 2
echo "PID_ZERO = ${PID_ZERO}"
echo "PID_ALPHA = ${PID_ALPHA}"

sleep 7
echo "####################### Make backup #########################"

if [ ! -d "./residual" ]; then
  mkdir residual
fi

curl --request POST \
  --url http://localhost:8080/admin \
  --header 'content-type: application/graphql' \
  --data-binary '@./graphql/fullbackup.graphql'
echo ''
echo "####################### Make backup end #########################"

sleep 2
echo "####################### Restore Start #########################"

sleep 2
kill -15 $PID_ZERO
kill -15 $PID_ALPHA

sleep 2
echo "... cleaning"
rm -rf p
rm -rf w
rm -rf zw

echo "... restoring"
restore --location ./residual

echo "####################### End of Restore #########################"

sleep 2
echo "####################### Start restored nodes #########################"
zero
alpha '--encryption_key_file ./enc_key_file'

sleep 60
kill -15 $PID_ZERO
kill -15 $PID_ALPHA

sleep 1
echo 'test exited with 0'
exit 0

