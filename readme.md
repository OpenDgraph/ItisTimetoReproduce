# Reproduce it

Here you gonna find some personal tests related to Dgraph. And issues on discuss or Dgraph's Github repo.

# What to do

#### Use:

>`sh ./dgraph.sh`

To Download Dgraph's binaries and use locally with a single instance.

>`sh ./dgraph.sh --multiple`

To Download Dgraph's binaries and use locally with multiple instances.

>>> If you want to go back to a single instance or vice versa, you need to delete the files from Dgraph, leaving only the binaries.

> `sh ./dgraph.sh`

To Download Dgraph's binaries and use locally.

> `sh ./traefik.sh`

To Download Traefik's binaries and use locally.

Using a load balancer in front of your instances makes the entire cluster more relieved. This example is using HTTP only.

![log example](https://github.com/MichelDiz/ItisTimetoReproduce/raw/master/img/cap1.png)

Note above in the log, that with each new call it changes servers.

> `sh ./start.sh`

To start some script created for testing purposes.

## Links

<http://discuss.dgraph.io/>

<http://docs.dgraph.io/>

<http://tour.dgraph.io/>
