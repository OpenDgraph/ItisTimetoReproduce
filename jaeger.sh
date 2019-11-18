#!/usr/bin/env sh
set -e

echo "##### IMPORTANT"
echo "Before using it, make sure the variables are according to your system"
echo "It is set to darwin"

VERSION='1.15.1'
OperationalSystem="darwin"
FILE_Name="jaeger-${VERSION}-${OperationalSystem}-amd64"
TARFILE="${FILE_Name}.tar.gz"
DOWNLOAD_URL="https://github.com/jaegertracing/jaeger/releases/download/v$VERSION/$TARFILE"

if [ ! -d ./jaeger ] ; then
    mkdir ./jaeger
  fi

baixarjaeger() {
  echo "$DOWNLOAD_URL"
  wget "$DOWNLOAD_URL" -O ./jaeger/$TARFILE -q
}

unzipTar()
{
    echo "./jaeger/$TARFILE "
    tar -xzvf ./jaeger/$TARFILE -C ./jaeger/
}

if [ ! -f './jaeger/new.lock' ] ; then
    echo "There are no jaeger's binaries in this Path."
    rm -rf ./jaeger/*
    echo "Downloading jaeger..."
    baixarjaeger
    echo "Installing jaeger..."
    unzipTar
    mv ./jaeger/$FILE_Name/* ./jaeger/
    rm -rf ./jaeger/$FILE_Name
    touch ./jaeger/new.lock
  fi

  startjaeger(){
   echo "Running jaeger"
   cd ./jaeger
   ./jaeger-all-in-one
}

  startjaeger

  echo "just exited..."

  exit 0