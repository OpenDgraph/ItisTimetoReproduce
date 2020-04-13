#! /usr/bin/env bash

URL_21M="https://github.com/dgraph-io/benchmarks/blob/master/data/release/21million.rdf.gz?raw=true"
URL_1M="https://github.com/dgraph-io/benchmarks/blob/master/data/1million.rdf.gz?raw=true"

URL_schema="https://github.com/dgraph-io/benchmarks/blob/master/data/release/release.schema?raw=true"
URL_1million_schema="https://github.com/dgraph-io/benchmarks/blob/master/data/1million.schema?raw=true"

function curl_data(){
    curl --progress-bar -LS -o $1 "$2"
}

if [ ! -d "./datasets" ]; then
  mkdir datasets
fi

if [ ! -f ./datasets/release.schema ]; then
    echo "release.schema File does not exist"
    curl_data "./datasets/release.schema" $URL_schema
else 
    echo "release.schema exists"
fi

if [ ! -f ./datasets/1million.schema ]; then
    echo "1million.schema File does not exist"
    curl_data "./datasets/1million.schema" $URL_1million_schema
else 
    echo "1million.schema exists"
fi

if [ ! -f ./datasets/1million.rdf.gz ]; then
    echo "1million File does not exist"
    curl_data "./datasets/1million.rdf.gz" $URL_1M
else 
    echo "1million.rdf.gz exists"
fi

if [ ! -f ./datasets/21million.rdf.gz ]; then
    echo "21million File does not exist"
    curl_data "./datasets/21million.rdf.gz" $URL_21M
else 
    echo "21million.rdf.gz exists"
fi