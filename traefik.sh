#!/usr/bin/env sh
set -e

echo "##### IMPORTANT"
echo "Before using it, make sure the variables are according to your system"
echo "It is set to darwin"

VERSION="v2.0.4"
OperationalSystem="darwin"
TARFILE="traefik_${VERSION}_${OperationalSystem}_amd64.tar.gz"
DOWNLOAD_URL="https://github.com/containous/traefik/releases/download/$VERSION/$TARFILE"

if [ ! -d ./traefik ] ; then
    mkdir ./traefik
  fi

baixarTraefik() {
  echo "$DOWNLOAD_URL"
  wget "$DOWNLOAD_URL" -O ./traefik/$TARFILE -q
}

unzipTar()
{
    echo "./traefik/$TARFILE "
    tar -xzvf ./traefik/$TARFILE -C ./traefik/
}

if [ ! -f './traefik/new.lock' ] ; then
    echo "There are no traefik's binaries in this Path."
    rm -rf ./traefik/*
    echo "Downloading Traefik..."
    baixarTraefik
    echo "Installing Traefik..."
    touch ./traefik/new.lock
    unzipTar
    cp dynamic_conf.yml ./traefik
    cp startLB ./traefik
  fi

  startTraefik(){
   echo "Running Traefik"
   cd ./traefik
   sh ./startLB.sh
}

  startTraefik

  echo "just exited..."

  exit 0