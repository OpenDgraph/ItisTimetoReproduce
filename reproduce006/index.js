const {
  curlSetSchema,
  makeDgraphType,
  migrateProps,
  relationProps,
  writeFile
} = require("./utils");

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

const migP = migrateProps(args.JSON);
const relP = relationProps(args.JSON);

let treatd_dat = [...migP, ...relP];

const main = () => {
  writeFile(treatd_dat);
};

main();
