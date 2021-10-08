import styled from "styled-components";
import { FONT } from "@farewill/ui/tokens";
import { images } from "./images";
const Frame = styled.div`
  background-image: radial-gradient(
    50% 50% at 50% 50%,
    rgba(251, 230, 141, 0.6) 0%,
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

const image = (name) => (
  <Image alt="icon" src={images[name] || images["placeholder"]} />
);

export const CustomNode = ({ person }) => {
  return (
    <Frame>
      {image(String(person.id).toLowerCase())}
      <NameTag>{person.id}</NameTag>
    </Frame>
  );
};
