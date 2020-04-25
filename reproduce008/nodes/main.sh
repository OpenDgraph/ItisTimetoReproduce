#! /usr/bin/env bash

# dgraph zero & PID_ZERO=$!
# dgraph alpha & PID_ALPHA=$!

echo

function install(){
    curl https://get.dgraph.io -sSf | bash
}

function zero(){
    dgraph zero $@ & PID_ZERO=$!
}

function alpha(){
   dgraph alpha $@ & PID_ALPHA=$!
}

function bulk(){
    dgraph zero & PID_ZERO_B=$!
    sleep 7
    echo '####################### bulk start #########################'
    echo "dgraph bulk $@"
    dgraph bulk $@
    echo '####################### end of bulk #########################'

    #mv ./out/0/p ./p
    sleep 3
    kill -15 $PID_ZERO_B
    sleep 3
}

function restore(){
   dgraph restore $@
}
