#!/bin/sh

    curl -X POST localhost:8081/alter -d '
        name: string @index(term) .
        email: string @index(term, trigram) .
        age: int .
        '

    # curl -X POST localhost:8081/alter -d '
    #     name: string @index(term) .
    #     email: string @index(exact, term, trigram) .
    #     age: int .
    #     '

    # curl -X POST localhost:8081/alter -d '
    #     name: string .
    #     email: string .
    #     age: int .
    #     '