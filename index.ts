import * as reportsRepository from "./reportsRepository";
import mongodb from "mongodb";

const ObjectID = mongodb.ObjectID;

var branchCollection = [
  { _id: "5c5d86fbd5c001080f5764f2", name: "Branch 1" },
  { _id: "5c5d86fbd5c001080f5764f3", name: "Branch 2" },
  { _id: "5c5d86fbd5c001080f5764f4", name: "Branch 3" },
  { _id: "5c5d86fbd5c001080f5764f5", name: "Branch 4" },
];
var posCollection = [
  { _id: "5c5d86fcd5c001080f576518", name: "POS 1" },
  { _id: "5c5d86fcd5c001080f576519", name: "POS 2" },
];

const mapToObjectId = (array: any) => array.map((id: any) => new ObjectID(id));

const getReducer = (filter: any) => (accumulator: any, report: any) => {
  if (accumulator.indexOf(report[filter]) === -1) {
    accumulator.push(report[filter]);
  }
  return accumulator;
};

export function generateReport() {
  let existingReports = reportsRepository.getReports();

  let results: any = {
    branch: mapToObjectId(existingReports.reduce(getReducer("branch_id"), [])),
    pos: mapToObjectId(existingReports.reduce(getReducer("pos_id"), [])),
  };

  let branches = branchCollection.filter(function (branch: any) {
    return (
      results.branch.findIndex(function (branchResult: any) {
        return branchResult.toString() === branch._id;
      }) !== -1
    );
  });
  let pos = posCollection.filter(function (pos: any) {
    return (
      results.pos.findIndex(function (posResult: any) {
        return posResult.toString() === pos._id;
      }) !== -1
    );
  });

  let instances: any = {
    branch: branches,
    pos: pos,
  };

  const mappedResults: any = {};

  ["branch", "pos"].some((prop) => {
    const filterArrayLength = results[prop].length;
    const resultsArrayLength = instances[prop].length;

    if (filterArrayLength > resultsArrayLength) {
      const foundIds: any[] = [];
      instances[prop].forEach((item: any) => foundIds.push(String(item._id)));
      results[prop].forEach((id: any) => {
        if (foundIds.indexOf(String(id)) === -1) {
          console.log(`Missing ${prop}_id ${id}`);
        }
      });
    }

    mappedResults[prop] = {};
    results[prop].forEach((record: any) => {
      mappedResults[prop][record._id] = record;
    });
  });

  return results;
}

console.log(generateReport());
