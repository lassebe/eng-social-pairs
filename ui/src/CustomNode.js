import styled from "styled-components";
import { FONT } from "@farewill/ui/tokens";
import { images } from "./images";
const Frame = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 200px;
  height: 200px;
  background: #20cacc;
  border-radius: 50%;
`;

const Image = styled.img`
  padding: 8px;
  width: 75px;
  height: 75px;
`;

const NameTag = styled.div`
    width: 150px;
    height: 45px;
    background #ffdf4e;
    font-size: ${FONT.SIZE.XL};
    font-weight: ${FONT.WEIGHT.BOLD};
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
