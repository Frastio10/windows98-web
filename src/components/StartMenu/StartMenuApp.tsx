import { useState } from "react"
import styled from "styled-components"
import { AppType } from "../../configs"
import { useStartMenu } from "../../hooks/zustand/useStartMenu"
import { useWindowState } from "../../hooks/zustand/useWindowState"

export interface App {
  title: string
  icon: string
  appName: AppType
  isDisabled: boolean
}

interface StartMenuAppProps extends App {
  children?: App[]
}

export const StartMenuApp = ({
  title,
  icon,
  appName,
  isDisabled,
  children,
}: StartMenuAppProps) => {
  const { openWindow } = useWindowState()
  const { changeStartMenu } = useStartMenu()
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)

  return (
    <Wrapper
      className={isDisabled ? 'disabled' : ''}
      onClick={() => {
        if (!isDisabled && !children?.length) {
          openWindow(appName)
          changeStartMenu(false)
        }
      }}
      onMouseOut={() => {
        setIsDropdownOpen(false)
      }}
      onMouseOver={() => {
        setIsDropdownOpen(true)
      }}>
      <img src={icon} alt={title} width={30} height={30} />
      {isDisabled ?
        <Text className="title" style={{ color: 'grey', textShadow: '1px 1px #fff' }}>{title}</Text> :
        <Text className="title"><u>{title.charAt(0)}</u>{title.slice(1, title.length)}</Text>
      }
      {
        children?.length &&
        <span
          style={isDisabled ? { color: 'grey', textShadow: '1px 1px #fff' } : {}}
          className="arrow">▸</span>
      }

      {
        isDropdownOpen && children?.length && !isDisabled && (
          <Dropdown>
            {children.map(v => (
              <DropdownItem onClick={() => {
                openWindow(v.appName)
                changeStartMenu(false)
              }}>
                <img src={v.icon} alt={v.title} width={16} height={16} />
                <span>{v.title}</span>
              </DropdownItem>
            ))}
          </Dropdown>
        )
      }
    </Wrapper>
  )
}

const DropdownItem = styled.div`
  display: flex; 
  align-items: center;

  &:not(.disabled):hover, &:not(.disabled):active {
    background: navy;
    color: #fff;
  }
`

const Dropdown = styled.div`
  position: absolute;
  right: -140px;
  top: 0;
  background: ${({ theme }) => theme.elementDefaultBackground};
  border: 2px outset #fff;
  box-shadow: 1px 1px #000;
  display: flex;
  flex-direction: column;
  width: 140px;

  span {
      font-size: 12px;
  }


  
`

const Text = styled.span`
  font-size: 12px;
  margin-left: 12px;
`

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  position: relative;
  padding: 1px 0;

  &.disabled {
    pointer-events: none;
  }

  &:not(.disabled):hover, &:not(.disabled):active {
    background: navy;

    .title, .arrow {
      color: #fff;
    }
  }

  .arrow {
    margin: 0 4px 0 auto;
    font-size: 12px;
  } 
`
