const fs = require("fs");
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

const migrateProps = function(filePath) {
  const data = jsonReader(filePath);
  const _data = data.filter(e => e.type === "node" && e.properties);
  let treatd_dat = [];

  _data.forEach(e => {
    let myUid = `_:Node_${e.id}`;
    delete e["id"];

    let myProps = e.properties;
    delete e.properties;

    const toPush = { uid: myUid, ...e, ...myProps };

    treatd_dat.push(toPush);
  });
  return treatd_dat;
};

const relationProps = function(filePath) {
  const data = jsonReader(filePath);
  const _data = data.filter(
    //id 248 138 e.id === "0" &&
    e => e.type === "relationship" && e.properties
  );
  let treatd_dat = [];

  _data.forEach(e => {
    let startUid = `_:Node_${e.start.id}`;
    let endUid = `_:Node_${e.end.id}`;
    delete e["id"];
    delete e["type"];

    let label = e.label;
    let myEnd = e.end;

    let facets = {};

    Object.keys(e.properties).forEach(function(key, i) {
      let alocate = e.properties[key];
      if (e.properties[key] instanceof Array) {
        facets[`${label}|${key}`] = `${alocate.join(",")}`;
      } else {
        facets[`${label}|${key}`] = e.properties[key];
      }
    });

    delete e["label"];
    delete e.end.id;
    delete e.end.labels;
    delete e.properties;
    delete e.start;
    delete e.end;

    const toPush = {
      uid: startUid,
      ...e,
      [`${label}`]: [{ uid: endUid, ...myEnd, ...facets }]
    };

    treatd_dat.push(toPush);
  });
  return treatd_dat;
};
const writeFile = function(data) {
  let _data = JSON.stringify(data, null, 2);
  fs.writeFile("./output.json", _data, err => {
    if (err) throw err;
    console.log("Data written to file");
  });
};

module.exports = {
  liveload,
  curlSetSchema,
  makeDgraphType,
  migrateProps,
  relationProps,
  writeFile
};
