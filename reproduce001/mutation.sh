#!/bin/sh

    curl -H "Content-Type: application/rdf" localhost:8081/mutate?commitNow=true -XPOST -d $'
        {
        set {
            _:a1 <name> "Alice" .
            _:a1 <email>  "testAddress1@gmail.com" .
            _:a1 <age>  "32" .
            _:a1 <dgraph.type>  "User" .
            
            _:b2 <name> "Beney" .
            _:b2 <email>  "testAddress2@gmail.com" .
            _:b2 <age>  "21" .
            _:b2 <dgraph.type>  "User" .

            _:c3 <name> "Charly" .
            _:c3 <email>  "testaddress3@gmail.com" .
            _:c3 <age>  "30" .
            _:c3 <dgraph.type>  "User" .
        }
}'
