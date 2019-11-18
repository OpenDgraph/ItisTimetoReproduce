# Reproduce it

Here you gonna find some personal tests related to Dgraph. And issues on discuss or Dgraph's Github repo.

# What to do

#### Use:

>`sh ./dgraph.sh`

To Download Dgraph's binaries and use locally with a single instance.

---
#### Use:
>`sh ./dgraph.sh --multiple`

To Download Dgraph's binaries and use locally with multiple instances.

>>> If you want to go back to a single instance or vice versa, you need to delete the files from Dgraph, leaving only the binaries.

---
#### Use:

> `sh ./jaeger.sh`

To Download jaeger's binaries and use locally.

---
#### Use:

> `sh ./traefik.sh`

To Download Traefik's binaries and use locally.

Using a load balancer in front of your instances makes the entire cluster more relieved. This example is using HTTP only.

![log example](https://github.com/MichelDiz/ItisTimetoReproduce/raw/master/img/cap1.png)

Note above in the log, that with each new call it changes servers.

---
#### Use:

> `sh ./start.sh`

To start some script created for testing purposes.

# About the Reproduce directories

## Reproduce 001

Attempt to reproduce a issue with Regex. It has been found that there is a issue with Regex in versions prior to 1.1.0 that have already been fixed in Master branch.

You need to:

1 - install Dgraph locally.

2 - Run `start.sh`.

## Reproduce 002

It is an attempt to verify the effectiveness of Traefik's load balancing via HTTP/1/2. I obtained positive results. However, I was not able to properly work load balancing via GRPC. It works, but it doesn't balances.

You need to:

1 - install Dgraph locally with multiple Alphas.

2 - install and config Traefik.

3 - Run `mutations.sh`.

## Reproduce 003

This is a proof of GRPC load balancing operation on NGINX.

It works, but I'm not sure if the load balancing is well balanced. It sends calls to all Alphas listed in `upstream grpcservers`. But I noticed that two (or three) instances seem to get more calls (However all instances receive calls). Because the memory and processing are bigger in them. This does not happen in Traefik.

You need to:

1 - install Dgraph locally with multiple Alphas.

2 - install and config NGINX.

3 - install and run the grpc_client.

## Links

<http://discuss.dgraph.io/>

<http://docs.dgraph.io/>

<http://tour.dgraph.io/>
