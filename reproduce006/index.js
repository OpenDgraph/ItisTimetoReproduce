const {
  curlQueries,
  curlUpsertBlock,
  curlMutations,
  liveload,
  curlSetSchema,
  findUnique,
  makeDgraphType
} = require("./utils");
const {
  relationshipsTemplate,
  countRelationships
} = require("./templates/templating");

const runLive = filePath => {
  let queryCount = curlQueries("@./defaults/queryCount.graphql");
  queryCount.nodes[0].count === 0 && queryCount.nodesWithT[0].count === 0
    ? (curlSetSchema("@./defaults/default.schema"),
      liveload(filePath), //"./g01.json"
      console.log(
        "Live load",
        queryCount,
        queryCount.nodes[0].count === 0 && queryCount.nodesWithT[0].count === 0
      ))
    : console.log("No load");
  if (!queryCount) {
    console.log("!!queryCount >>>No load");
    curlSetSchema("@./defaults/default.schema");
    liveload();
  }

  return true;
};

const upsertNodes = nodes => {
  console.log("==========> upsertNodes");
  let upsertNodes = curlUpsertBlock("@./defaults/upsertNodes.graphql");
  console.log("upsertNodes.data", upsertNodes.data);
};

const upsertRelationships = nodes => {
  console.log("==========> upsertRelationships");
  let upsertReverseProps = curlUpsertBlock(
    "@./defaults/upsertReverseProps.graphql"
  );
  console.log("upsertReverseProps", upsertReverseProps.data);
};

const ships = () => {
  let queryCount = curlQueries("@./defaults/queryCount.graphql");
  !!queryCount && queryCount.nodes[0].count > 0
    ? (upsertNodes(), upsertRelationships())
    : null;
  return true;
};

const upsertMigrateNodes = nodes => {
  console.log("==========> upsertMigrateNodes");
  let nodeCount = nodes[0].count;
  let nodeCount2 = nodes[0].count;
  console.log("to be cleaned", nodeCount2);
  let cleaned = 0;
  let nodesDone = 0;
  while (nodeCount > 0) {
    curlUpsertBlock("@./defaults/bulkUpsert0.graphql");
    nodeCount--;
    nodesDone++;
  }
  console.log("nodesDone", nodesDone);
  while (nodeCount2 > 0) {
    curlUpsertBlock("@./defaults/cleanBulkUpsert0.graphql");
    cleaned++;
    nodeCount2--;
  }
  console.log("cleaned", cleaned);
};

const migrate = filePath => {
  let queryCount = curlQueries("@./defaults/queryCheckMigration.graphql");
  queryCount.nodes[0].count > 0 ? upsertMigrateNodes(queryCount.nodes) : null;
  console.log(queryCount);
  upsertMigrateRelationships(filePath);
  //! queryCount.relationships[0].count > 0 ? upsertMigrateRelationships() : null;
};

const upsertMigrateRelationships = filePath => {
  let uniques = findUnique(filePath);

  uniques.uniquesLB.forEach(label => {
    let _unique = findUnique(filePath);
    let queryForCount = countRelationships(label);

    let count_in = curlQueries(
      JSON.stringify(queryForCount),
      "application/json",
      false,
      true
    )["relationships"][0].count;

    // console.log("Relationships count =", count_in);
    // let setUpsert = relationshipsTemplate(
    //   label,
    //   _unique.properties,
    //   _unique.varProps,
    //   _unique.sumProps
    // );
    // console.log(setUpsert);
    while (count_in > 0) {
      console.log(uniques);
      let setUpsert = relationshipsTemplate(label, _unique.properties);
      curlUpsertBlock(setUpsert, "application/json", false, true);
      // console.log(setUpsert);
      //console.log(JSON.stringify(setUpsert));
      count_in--;
    }
  });
  // uniques.uniquesLB_NoProps.forEach(label => {
  //   let queryForCount = countRelationships(label);

  //   let count_in = curlQueries(
  //     JSON.stringify(queryForCount),
  //     "application/json",
  //     false,
  //     true
  //   )["relationships"][0].count;

  //   console.log("Relationships count =", count_in);

  //   while (count_in > 0) {
  //     let setUpsert = relationshipsTemplate(label);
  //     curlUpsertBlock(setUpsert, "application/json", false, true);
  //     // console.log(setUpsert);
  //     //console.log(JSON.stringify(setUpsert));
  //     count_in--;
  //   }
  // });

  // let upsertNodes = curlUpsertBlock("@./defaults/upsertNodes.graphql");
  //console.log(JSON.stringify(setUpsert));
};

const typesystem = filePath => {
  let preds = makeDgraphType(filePath);

  let types = `
type node {
  ${preds.join("\r\n         ")}
}
type relationship {
  ${preds.join("\r\n         ")}
}`;

  curlSetSchema(types, true);
};

const args = process.argv.slice(2).reduce((acc, arg, cur, arr) => {
  if (arg.match(/^--/)) {
    acc[arg.substring(2)] = true;
    acc["_lastkey"] = arg.substring(2);
  } else if (arg.match(/^-[^-]/)) {
    for (key of arg.substring(1).split("")) {
      acc[key] = true;
      acc["_lastkey"] = key;
    }
  } else if (acc["_lastkey"]) {
    acc[acc["_lastkey"]] = arg;
    delete acc["_lastkey"];
  } else acc[arg] = true;
  if (cur == arr.length - 1) delete acc["_lastkey"];
  return acc;
}, {});
console.log("args2", args.JSON);

const main = () => {
  runLive(args.JSON);
  typesystem(args.JSON);
  ships();
  migrate(args.JSON);
};

main();
