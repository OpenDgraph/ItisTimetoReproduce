const dgraph = require("dgraph-js");
const grpc = require("grpc");

// Create a client stub.
function newClientStub() {
    return new dgraph.DgraphClientStub("localhost:9001", grpc.credentials.createInsecure());
}

// Create a client.
function newClient(clientStub) {
    return new dgraph.DgraphClient(clientStub);
}


// Set schema.
async function setSchema(dgraphClient) {
    const schema = `
        name: string @index(exact) .
        age: int .
        married: bool .
        loc: geo .
        dob: datetime .
        friend: [uid] @reverse .
    `;
    const op = new dgraph.Operation();
    op.setSchema(schema);
    await dgraphClient.alter(op);
}

// Create data using JSON.
async function createData(dgraphClient) {
    // Create a new transaction.
    const txn = dgraphClient.newTxn();
    try {
        // Create data.
        const p = {
            uid: "_:alice",
            name: "Alice",
            age: 26,
            married: true,
            loc: {
                type: "Point",
                coordinates: [1.1, 2],
            },
            dob: new Date(1980, 1, 1, 23, 0, 0, 0),
            friend: [
                {
                    name: "Bob",
                    age: 24,
                },
                {
                    name: "Charlie",
                    age: 29,
                }
            ],
            school: [
                {
                    name: "Crown Public School",
                }
            ]
        };

        // Run mutation.
        const mu = new dgraph.Mutation();
        mu.setSetJson(p);
        const response = await txn.mutate(mu);

        // Commit transaction.
        await txn.commit();

        console.log(`Created person named "Alice" with uid = ${response.getUidsMap().get("alice")}\n`);

        console.log("All created nodes (map from blank node names to uids):");
        response.getUidsMap().forEach((uid, key) => console.log(`${key} => ${uid}`));
        console.log();
    } finally {
        // Clean up. Calling this after txn.commit() is a no-op
        // and hence safe.
        await txn.discard();
    }
}

async function main() {
    const dgraphClientStub = newClientStub();
    const dgraphClient = newClient(dgraphClientStub);
    
    await createData(dgraphClient);
    // Close the client stub.
    dgraphClientStub.close();
}

async function set_Schema() {
    const dgraphClientStub = newClientStub();
    const dgraphClient = newClient(dgraphClientStub);

    await setSchema(dgraphClient);

    dgraphClientStub.close();
}

var hereWeGo = setInterval(async function () {
    var limit = 5;
    while (limit--) {
        main();
    }
}, 100);


set_Schema().then(() => hereWeGo);