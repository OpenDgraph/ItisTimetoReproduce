#!/bin/bash

# Create an array to hold PIDs
declare -a pids

# Start dgraph zeros
dgraph zero --my=localhost:5080 --rebalance_interval "0m10s" --replicas 3 --raft "idx=1" -w "zero1/zw" &
pids+=($!)
dgraph zero -o 1 --my=localhost:5081 --rebalance_interval "0m10s" --replicas 3 --peer localhost:5080 --raft "idx=2" -w "zero2/zw" &
pids+=($!)
dgraph zero -o 2 --my=localhost:5082 --rebalance_interval "0m10s" --replicas 3 --peer localhost:5080 --raft "idx=3" -w "zero3/zw" &
pids+=($!)

# Wait for dgraph zeros to start
sleep 10

# Download the required files
if [ ! -f 1million.rdf.gz ]; then
    wget https://github.com/dgraph-io/benchmarks/raw/master/data/1million.rdf.gz
    wget https://raw.githubusercontent.com/dgraph-io/benchmarks/master/data/1million.schema
fi

# Run dgraph bulk load
dgraph bulk -f ./1million.rdf.gz -s ./1million.schema --map_shards=1 --reduce_shards=1 --http localhost:8000 --zero=localhost:5080

# Copy the bulk load output to the dgraph1/p directory
mkdir -p ./dgraph1/p
mkdir -p ./dgraph2/p
mkdir -p ./dgraph3/p

cp -r ./out/0/p/* ./dgraph1/p/
cp -r ./out/0/p/* ./dgraph2/p/
cp -r ./out/0/p/* ./dgraph3/p/

sleep 10

# Start the first dgraph alpha
dgraph alpha --my=localhost:7080 --zero=localhost:5080 --security whitelist=0.0.0.0/0 --raft "snapshot-after-duration=1m;snapshot-after-entries=100" --tmp ./dgraph1/t -p ./dgraph1/p -w ./dgraph1/w &
pids+=($!)

# Wait for the first alpha to start
sleep 10

# Start the remaining dgraph alphas
dgraph alpha --my=localhost:7081 --zero=localhost:5080 --security whitelist=0.0.0.0/0 --raft "snapshot-after-duration=1m;snapshot-after-entries=100" --tmp ./dgraph2/t -p ./dgraph2/p -w ./dgraph2/w -o 1  &
pids+=($!)
dgraph alpha --my=localhost:7082 --zero=localhost:5080 --security whitelist=0.0.0.0/0 --raft "snapshot-after-duration=1m;snapshot-after-entries=100" --tmp ./dgraph3/t -p ./dgraph3/p -w ./dgraph3/w -o 2 &
pids+=($!)

# Trap the termination signal (SIGTERM) and kill the processes
trap "echo 'Stopping processes...'; kill ${pids[*]}" SIGTERM


# Wait for all processes to finish
for pid in ${pids[*]}; do
    wait $pid
done

# Clean up the files
echo "Cleaning up files..."
rm -rf dgraph1 dgraph2 dgraph3 out p tmp w zero1 zero2 zero3 zw t
