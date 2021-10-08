import { useState } from "react";
import { Graph } from "react-d3-graph";
import styled from "styled-components";

import { Button } from "@farewill/ui";
import { FONT } from "@farewill/ui/tokens";

import { CustomNode } from "./CustomNode";
import { useInterval } from "./useInterval";

const StyledWrapper = styled.div`
  background-color: #f9f6f1;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
`;

const StyledPrimaryButton = styled(Button.Primary)`
  margin-bottom: 8px;
  font-size: ${FONT.SIZE.M};
  background-color: #ffdf4e;
  border-radius: 15px;
`;
const StyledSecondaryButton = styled(Button)`
  margin-bottom: 8px;
  font-size: ${FONT.SIZE.M};
  text-decoration: underline;
  border-radius: 15px;
`;
const StyledBorderedButton = styled(Button.Bordered)`
  margin-bottom: 8px;
  font-size: ${FONT.SIZE.M};
  border-radius: 15px;
`;

const StyledButtonGroup = styled.div`
  margin-bottom: 20px;
  padding: 24px 48px 0;
  flex-shrink: 0;
  display: flex;
  justify-content: space-around;
`;

const StyledGraphWrapper = styled.div`
  display: flex;
  justify-content: center;
`;

const objectsEqual = (o1, o2) =>
  typeof o1 === "object" && Object.keys(o1).length > 0
    ? Object.keys(o1).length === Object.keys(o2).length &&
      Object.keys(o1).every((p) => objectsEqual(o1[p], o2[p]))
    : o1 === o2;

const arraysEqual = (a1, a2) =>
  a1.length === a2.length && a1.every((o, idx) => objectsEqual(o, a2[idx]));

const App = () => {
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const [showRemaining, setShowRemaining] = useState(false);

  useInterval(() => {
    const url = showRemaining ? "api/?remaining=true" : "/api";
    fetch(url)
      .then((res) => res.json())
      .then(
        (result) => {
          if (!arraysEqual(result.nodes, nodes)) {
            setNodes(result.nodes);
          }
          if (!arraysEqual(result.edges, edges)) {
            setEdges(result.edges);
          }
        },
        (error) => {
          console.error("oops", error);
        }
      );
  }, 1500);

  const data = {
    nodes,
    links: edges,
  };

  // the graph configuration, you only need to pass down properties
  // that you want to override, otherwise default ones will be used
  const config = {
    width: 1400,
    height: 800,
    nodeHighlightBehavior: true,
    linkHighlightBehavior: true,
    node: {
      color: "",
      size: {
        width: 2000,
        height: 2000,
      },
      symbolType: "diamond",
      highlightStrokeColor: "red",
      renderLabel: false,
      viewGenerator: (node) => <CustomNode person={node} />,
    },
    link: {
      highlightColor: "#ffdf4e",
      color: "#DEDBDD",
      strokeWidth: 16,
    },
    d3: {
      gravity: -1000,
    },
  };

  return (
    <StyledWrapper className="App-header">
      <StyledButtonGroup>
        <StyledPrimaryButton
          wide
          onClick={async () => {
            await fetch(`/api/nextPairs`);
          }}
        >
          Next pairs
        </StyledPrimaryButton>
        <StyledSecondaryButton
          wide
          onClick={async () => {
            await fetch(`/api/reset`);
          }}
        >
          Reset
        </StyledSecondaryButton>

        <StyledBorderedButton
          wide
          onClick={async () => {
            setShowRemaining(!showRemaining);
          }}
        >
          {showRemaining ? `Show current pairs` : `Show possible pairs`}
        </StyledBorderedButton>
      </StyledButtonGroup>
      <StyledGraphWrapper>
        {nodes.length > 0 && (
          <Graph
            id="graph-id" // id is mandatory, if no id is defined rd3g will throw an error
            data={data}
            config={config}
          />
        )}
      </StyledGraphWrapper>
    </StyledWrapper>
  );
};

export default App;
