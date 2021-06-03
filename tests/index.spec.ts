import { generateReport } from "../index";

test("should pass", () => {
  var results = generateReport();
  expect(JSON.stringify(results)).toBe(
    JSON.stringify({
      branch: ["5c5d86fbd5c001080f5764f2"],
      pos: ["5c5d86fcd5c001080f576518", "5c5d86fcd5c001080f576519"],
    })
  );
});
