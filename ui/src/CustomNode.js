import styled from "styled-components";
import { FONT } from "@farewill/ui/tokens";
import placeholder from "./placeholder.png";

const Frame = styled.div`
  background-image: radial-gradient(
    50% 50% at 50% 50%,
    rgba(251, 230, 141, 90) 0%,
    rgba(255, 231, 232, 0) 100%
  );
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 200px;
  height: 200px;
  border-radius: 50%;
`;

const Image = styled.img`
  padding: 8px;
  width: 75px;
  height: 75px;
  border-radius: 75px;
`;

const NameTag = styled.div`
  width: 150px;
  height: 45px;
  font-size: ${FONT.SIZE.L};
  color: #808080;
  text-align: center;
  padding-bottom: 8px;
`;

export const CustomNode = ({ person }) => {
  return (
    <Frame>
      <Image alt="icon" src={person.image || placeholder} />
      <NameTag>{person.id}</NameTag>
    </Frame>
  );
};
