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
  font-size: ${FONT.SIZE.L};
  border-radius: 15px;
`;

const StyledSecondaryButton = styled(Button.Secondary)`
  margin-bottom: 8px;
  font-size: ${FONT.SIZE.L};
  border-radius: 15px;
`;
const StyledBorderedButton = styled(Button.Bordered)`
  margin-bottom: 8px;
  font-size: ${FONT.SIZE.L};
  border-radius: 15px;
`;

const StyledGraph = styled(Graph)`
  flex: 1 0 auto;
  margin-bottom: 8px;
`;
const StyledButtonGroup = styled.div`
  margin 20px;
  padding 0 16px 48px;
  flex-shrink: 0;
  display: flex;
  justify-content: space-between;
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
    height: 900,
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
      gravity: -4000,
    },
  };

  return (
    <StyledWrapper className="App-header">
      {nodes.length > 0 && (
        <StyledGraph
          id="graph-id" // id is mandatory, if no id is defined rd3g will throw an error
          data={data}
          config={config}
        />
      )}
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
    </StyledWrapper>
  );
};

export default App;
