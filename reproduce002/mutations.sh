#!/bin/sh

echo "This test needs the Traefik running..."
echo "This has an infinite loop, so use ctrl + c to stop it"

for (( ; ; i++))
    do
    echo "counter: $i"
    curl -H "Content-Type: application/rdf" localhost/dgraph/mutate?commitNow=true -XPOST -d $'
        {
        set {
            _:U1 <name>  "Lucas Lima" .
            _:U1 <age>  "32" .
            _:U1 <spouse>  _:U2 .
            
            _:U2 <name>  "Alessandra Lima" .
            _:U2 <age>  "30" .
            _:U2 <spouse>  _:U1 .
        }
        }
        '
    sleep 0.1
    done
