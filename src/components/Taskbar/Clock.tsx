import styled from "styled-components";
import { useSystem } from "../../hooks/os";
import System from "../../libs/system";
import { LongDivider } from "../shared/Dividers";

export const Clock = () => {
  const { changeMute, isMuted } = useSystem();
  const d = new Date();

  const onMute = () => {
    changeMute();
  };
  return (
    <Wrapper>
      <LongDivider />
      <InnerWrapper>
        <img
          src={
            isMuted
              ? "/assets/images/loudspeaker_muted-small.png"
              : "/assets/images/loudspeaker_unmuted-small.png"
          }
          onClick={onMute}
        />
        <span>
          {d.toLocaleString("en-US", {
            hour: "numeric",
            minute: "numeric",
            hour12: true,
          })}
        </span>
      </InnerWrapper>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  display: flex;
  align-items: center;
`;

const InnerWrapper = styled.div`
  display: flex;
  align-items: center;
  border: 2px inset #fff;
  width: 80px;
  gap: 6px;
  padding: 0 2px;

  span {
    font-size: 12px;
  }
`;
