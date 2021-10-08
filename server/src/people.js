export const people = process.env.PEOPLE
  ? JSON.parse(process.env.PEOPLE).people
  : [
      { name: "JD", team: "" },
      { name: "Turk", team: "" },
    ];
