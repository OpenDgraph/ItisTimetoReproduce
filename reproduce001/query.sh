#!/bin/sh

curl -H "Content-Type: application/graphql+-" -X POST localhost:8081/query -d $'
{
  A as q(func: has(email)){
    email
  }
  
  RS as result(func: uid(A)) @filter(regexp(email, /Address/)){
  email
}
  
  result2(func: uid(A)) @filter(NOT uid(RS)){
    email
}
  result3(func: uid(A)) @filter(NOT regexp(email, /Address/)){
    email
}
}
' | jq >> ./results/result1.json