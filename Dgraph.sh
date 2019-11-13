#!/usr/bin/env sh
set -e

echo "##### IMPORTANT"
echo "Before using it, make sure the variables are according to your system"
echo "It is set to darwin"

##### Constants

RIGHT_NOW=$(date +"%x %r %Z")
TIME_STAMP="Updated on $RIGHT_NOW by $USER"
VERSION="v1.1.0"
TARFILE="dgraph-darwin-amd64.tar.gz"
DOWNLOAD_URL="https://github.com/dgraph-io/dgraph/releases/download/$VERSION/$TARFILE"
CheckDgraph=$(ls -f ./dgraph/dgraph | wc -l)

baixarDgraph() {
  echo "$DOWNLOAD_URL"
  wget "$DOWNLOAD_URL" -O ./dgraph/$TARFILE -q
}

unzipTar() {
  echo "./dgraph/$TARFILE "
 tar -xzvf ./dgraph/$TARFILE -C ./dgraph/
}

exportJSON() {
curl http://localhost:8080/admin/export?format=json
}

if [ "$1" = "-export" ] || [ "$1" = "--ex" ]
  then
    echo "Exporting.."
    exportJSON
    touch ./dgraph/new.lock
    echo "Done! exiting..."
    exit 0
  fi

if [ ! -d ./dgraph ] ; then
    mkdir ./dgraph
    exit 0
  fi

if [ ! -f './dgraph/dgraph-ratel' ] ; then
    rm -rf ./dgraph/*
    echo "There are no Dgraph's binaries in this Path."
    echo "Download..."
    baixarDgraph
    echo "Installing..."
    touch ./dgraph/new.lock
    unzipTar
  fi

# ================================================================ #
# =================== Apenas Funções Locally ===================== #
# ================================================================ #

dgraphZero(){
  echo "Starting Dgraph zero"
  cd dgraph
  ./dgraph zero -w=./wz
}
dgraphAlpha(){
  echo "Starting Dgraph Alpha"
  cd dgraph
  ./dgraph alpha -l 8000 -o=1
}

startLocally(){
   echo "Running Cluster"
  # test1 & test2
   (trap 'kill 0' SIGINT; dgraphZero & dgraphAlpha)
}

startLocally

echo "just exited..."