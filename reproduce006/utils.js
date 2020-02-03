const fs = require("fs");
const exec = require("child_process").exec;
const { spawn } = require("child_process");

const { execSync } = require("child_process");

const runcmd = (cmd, args) => {
  let resp;
  try {
    let output = execSync(cmd).toString();
    resp = JSON.parse(output);
  } catch (error) {
    error.status;
    error.message;
    error.stderr;
    error.stdout;
  }

  return resp;
};

const liveload = fileLocation => {
  let fileLocation_in = !fileLocation ? "./all.json" : fileLocation;
  var command = `dgraph live -f ${fileLocation_in}`;
  return runcmd(command);
};

const curlMutations = (fileLocation, ContentType, addr) => {
  let fileLocation_in = !fileLocation ? "@./all.json" : fileLocation;
  let addr_in = !addr ? "http://localhost:8080/mutate?commitNow=true" : addr;
  let ContentType_in = !ContentType ? "application/json" : ContentType;
  var command = `curl -sSL  --data-binary '${fileLocation_in}' -X POST -H 'Content-Type: ${ContentType_in}' ${addr_in}`;

  runcmd(command)["data"];
};

const curlUpsertBlock = (fileLocation, ContentType, addr, raw) => {
  let fileLocation_in = !fileLocation ? "@./all.json" : fileLocation;
  let addr_in = !addr ? "http://localhost:8080/mutate?commitNow=true" : addr;
  let ContentType_in = !ContentType ? "application/rdf" : ContentType;
  var command = raw
    ? `curl -sSL -d '${JSON.stringify(
        fileLocation_in
      )}' -X POST -H 'Content-Type: ${ContentType_in}' ${addr_in}`
    : `curl -sSL --data-binary $'${fileLocation_in}' -X POST -H 'Content-Type: ${ContentType_in}' ${addr_in}`;
  let respo = runcmd(command);
  console.log("fileLocation_in =>", JSON.stringify(fileLocation_in));
  console.log("michel", JSON.stringify(respo));
  return respo;
};

const curlQueries = (fileLocation, ContentType, addr, raw) => {
  let fileLocation_in = !fileLocation
    ? "@./defaults/queryCount.graphql"
    : fileLocation;
  let addr_in = !addr ? "http://localhost:8080/query" : addr;
  let ContentType_in = !ContentType ? "application/graphql+-" : ContentType;

  var command = raw
    ? `curl -sSL -d '${fileLocation_in}' -X POST -H "Content-Type: ${ContentType_in}" ${addr_in}`
    : `curl -sSL --data-binary $'${fileLocation_in}' -X POST -H "Content-Type: ${ContentType_in}" ${addr_in}`;

  return runcmd(command)["data"];
};

const curlSetSchema = (fileLocation, raw, addr) => {
  let fileLocation_in = !fileLocation
    ? "@./defaults/default.schema"
    : fileLocation;
  let addr_in = !addr ? "http://localhost:8080/alter" : addr;

  var command = raw
    ? `curl -sSL ${addr_in} -X POST -d '${fileLocation_in}'`
    : `curl -sSL ${addr_in} -X POST --data-binary $'${fileLocation_in}'`;

  return runcmd(command);
};

const jsonReader = function(filePath) {
  try {
    const data = fs.readFileSync(filePath);
    const pdata = JSON.parse(data);
    return pdata;
  } catch (err) {
    console.error(err);
  }
};

const findUnique = function(filePath) {
  const data = jsonReader(filePath).filter(e => e.type === "relationship");
  const _data = data.filter(e => e.properties).map(e => e.label);
  const _dataNoProps = data.filter(e => !e.properties).map(e => e.label);

  const props = data
    .filter((e, index) => e.properties)
    .map(e => {
      return Object.keys(e.properties);
    });

  const reduceprops = Object.values(
    props.reduce((a, c) => {
      a[c] = c;
      return a;
    }, {})
  );
  let uniquesprops = [];
  reduceprops.forEach(e => uniquesprops.push(...e));

  //uniquesprops = uniquesprops.map((e, i) => `${i}_${e} as ${e}`);

  const uniques = Object.values(
    _data.reduce((a, c) => {
      a[c] = c;
      return a;
    }, {})
  );
  const uniquesNoProps = Object.values(
    _dataNoProps.reduce((a, c) => {
      a[c] = c;
      return a;
    }, {})
  );
  return {
    uniquesLB: uniques,
    uniquesLB_NoProps: uniquesNoProps,
    properties: uniquesprops
  };
};
const makeDgraphType = function(filePath) {
  const data = jsonReader(filePath);
  let root = data.map(e => {
    return Object.keys(e);
  });
  let properties = data
    .filter(e => e.properties)
    .map(e => {
      return Object.keys(e.properties);
    });

  const rootTypes = Object.values(
    root.reduce((a, c) => {
      a[c] = c;
      return a;
    }, {})
  );
  const propertiesTypes = Object.values(
    properties.reduce((a, c) => {
      a[c] = c;
      return a;
    }, {})
  );
  let colectTypes = [...rootTypes, ...propertiesTypes];
  let gtTypes = [];
  colectTypes.forEach((e, i) => {
    gtTypes.push(...e);
  });
  return (finalTypes = Object.values(
    gtTypes.reduce((a, c) => {
      a[c] = c;
      return a;
    }, {})
  ));
};

module.exports = {
  curlQueries,
  curlUpsertBlock,
  curlMutations,
  liveload,
  curlSetSchema,
  findUnique,
  makeDgraphType
};
