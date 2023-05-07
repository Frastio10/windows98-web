import styled from "styled-components"
import { apps } from "../../configs"
import { useWindowState } from "../../hooks/zustand/useWindowState"

export const Tasks = () => {

  const { activeWindows } = useWindowState()
  return (
    <Wrapper>
      <Inner>
        {
          activeWindows.map(v => (
            <Task>
              <img src={apps[v.name].minimizedLogo} />
              <span>{v.name} {v.windowId}</span>
            </Task>
          ))
        }
      </Inner>
    </Wrapper>
  )
}

const Wrapper = styled.div`
  width: 100%;
  height:100%;
  padding-right: 5px;
  display: flex;
  align-items: center;
`

const Inner = styled.div`
  height: 80%;
  display: flex;
  align-items: center;
  gap: 3px;
`

const Task = styled.div`
  border: 2px outset #fff;
  font-size: 12px;
  box-shadow: 1px 1px #000;
  height: 100%;
  display: flex;
  align-items: center;
  padding: 0 2px;

  img {
    width: 14px;
    margin-right: 5px;
  }

`
