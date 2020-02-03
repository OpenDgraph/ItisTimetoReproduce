const relationshipsTemplate = (label, properties) => {
  let query = `{
    q(func: type("relationship"), first:1) @filter(eq(label,"${label}") AND NOT has(relationshipDone)) {
            v as uid ${properties ? `\n           props as properties ` : ``}
            start {
              ID as id
            }
            end {
              endID as id
            }
        }

            From as from(func: eq(id, val(ID) )) @filter(NOT eq(type,"relationship") AND NOT has(~start) AND NOT has(~end) AND NOT has(properties))
        
            To as to(func: eq(id, val(endID) )) @filter(NOT eq(type,"relationship") AND NOT has(~start) AND NOT has(~end) AND NOT has(properties))
          
  }`;

  let set = properties
    ? `{ "uid": "uid(From)", "${label}": [ { "uid": "uid(props)", "${label}": [{ "uid": "uid(To)" }] }]}`
    : `{ "uid": "uid(From)", "${label}": [{ "uid": "uid(To)" }] }`;

  let set2 = `{
    "uid": "uid(v)",
    "relationshipDone": "True"
}`;

  console.log(
    "return",
    JSON.stringify({
      mutations: [{ set: JSON.parse(set) }, { set: JSON.parse(set2) }]
    })
  );
  console.log(properties ? "tem properties" : "no props");
  return {
    query,
    mutations: [{ set: JSON.parse(set) }, { set: JSON.parse(set2) }]
  };
};

const countRelationships = label => {
  let query = `{
    relationships(func: eq(type,"relationship"))  @filter(eq(label,"${label}") AND NOT has(relationshipDone)) {
        count(uid)
      }
    }`;

  return { query };
};

module.exports = {
  relationshipsTemplate,
  countRelationships
};
