import path from "path";
import express from "express";
import cors from "cors";
import { people } from "./people";

const app = express();
const port = process.env.PORT || 3001;
const nodes = people.map((p) => {
  return {
    id: p.name,
    image: p.image,
  };
});

const getTeam = (name) => people.find((p) => p.name === name).team;

const personWithFewestOptions = (pairs, debug = false) => {
  if (pairs.length === 0) return "";
  const people = pairs.map((e) => e.source);

  const optionsPerPerson = people.reduce((r, n) => {
    r.set(n, (r.get(n) || 0) + 1);
    return r;
  }, new Map());
  if (debug) console.log("optionsPerPerson", optionsPerPerson);

  return [...optionsPerPerson].reduce((r, v) => (v[1] < r[1] ? v : r))[0];
};

const sameTeam = (edge) => {
  return getTeam(edge.source) === getTeam(edge.target);
};

const randomElement = (arr) => arr[Math.floor(Math.random() * arr.length)];

const totalEdges = () => {
  let edges = [];
  for (let i = 0; i < people.length; i++) {
    for (let j = 0; j < people.length; j++) {
      if (i !== j)
        edges.push({ source: people[i].name, target: people[j].name });
    }
  }
  return edges;
};

const nextPairs = (usedEdges = []) => {
  let pairings = [];
  let availablePairs = totalEdges().filter((e) => {
    const match = usedEdges.find(
      (e2) =>
        (e2.source === e.source && e2.target === e.target) ||
        (e2.source === e.target && e2.target === e.source)
    );
    return !match;
  });

  while (availablePairs.length > 0) {
    const person = personWithFewestOptions(availablePairs);
    const pairs = availablePairs.filter(
      (e) => e.source === person || e.target === person
    );

    const pairsFromDifferentTeams = pairs.filter((e) => !sameTeam(e));
    const chosen =
      pairsFromDifferentTeams.length !== 0
        ? randomElement(pairsFromDifferentTeams)
        : randomElement(pairs);

    availablePairs = availablePairs.filter(
      (e) =>
        e.source !== chosen.source &&
        e.source !== chosen.target &&
        e.target !== chosen.source &&
        e.target !== chosen.target
    );
    pairings.push(chosen);
  }
  if (pairings === []) return [];

  if (people.length % 2 !== 0) {
    const names = [...people.map((p) => p.name)];
    const unmatchedPerson = names.filter((name) => {
      return (
        pairings.filter((e) => e.source === name || e.target === name)
          .length === 0
      );
    })[0];
    const otherPair = pairings[pairings.length - 1];
    if (otherPair) {
      pairings.push({
        source: otherPair.source,
        target: unmatchedPerson,
      });
    }
  }

  return pairings;
};

const mostRecentPairs = () => {
  if (usedEdges.length === 0) return [];
  const numberOfPairs = Math.ceil(people.length / 2);
  return usedEdges.slice(-numberOfPairs);
};

const corsOptions = { origin: "http://localhost:3000" };
let usedEdges = [];

app.get("/api/", cors(corsOptions), (req, res) => {
  const remaining = req.query.remaining;
  if (!remaining) {
    res.send({ nodes, edges: mostRecentPairs() });
    return;
  }

  if (usedEdges.length === 0) {
    res.send({ nodes, edges: totalEdges() });
    return;
  }

  const diff = totalEdges().filter((e) => {
    const match = usedEdges.find(
      (e2) =>
        (e2.source === e.source && e2.target === e.target) ||
        (e2.source === e.target && e2.target === e.source)
    );
    return !match;
  });

  res.send({ nodes, edges: diff });
});

app.get("/api/nextPairs", cors(corsOptions), (_req, res) => {
  const p = nextPairs(usedEdges);
  usedEdges = [...usedEdges, ...p];
  res.send({});
});

app.get("/api/reset", cors(corsOptions), (_req, res) => {
  usedEdges = [];
  res.send({});
});

app.use(express.static(path.resolve(__dirname, "../../ui/build")));
app.get("*", (_req, res) => {
  res.sendFile(path.resolve(__dirname, "../../ui/build", "./index.html"));
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
