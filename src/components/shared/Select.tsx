import React, { forwardRef, useRef, useState } from "react";
import styled from "styled-components";
import useOutsideAlerter from "../../hooks/useOutsideAlerter";
import { BaseInput } from "./Input";

type SelectValue = {
  key: string;
  title: string;
};

interface SelectProps {
  list: SelectValue[];

  defaultValue?: string;
  value?: string;

  inputClass?: string;
  parentClass?: string;

  isSelectOnly?: boolean;
  iconSrc?: string;

  onSelect: (value: SelectValue) => void;
  onSearch: (value: string) => void;
}
export const Select = forwardRef<HTMLInputElement, SelectProps>(
  (
    {
      list,
      onSelect,
      onSearch,
      inputClass,
      parentClass,
      value,
      defaultValue,
      iconSrc,
      isSelectOnly = false,
    },
    ref,
  ) => {
    const [showList, setShowList] = useState(false);
    const addressListRef = useRef<HTMLDivElement>(null);
    const [currentValue, setCurrentValue] = useState<SelectValue | null>(null);

    const [inputTextValue, setInputTextValue] = useState("");

    useOutsideAlerter([addressListRef], () => {
      setShowList(false);
    });

    return (
      <InnerWrapper className={"flex " + parentClass}>
        {iconSrc && <img src={iconSrc} />}
        <FileAddress>
          <BaseInput
            readOnly={isSelectOnly}
            ref={ref}
            type={"text"}
            className={"flex-grow " + inputClass}
            value={value || inputTextValue}
            defaultValue={defaultValue}
            onClick={() => setShowList(true)}
            onChange={(e) => {
              setShowList(true);
              setInputTextValue(e.target.value);
              onSearch(e.target.value);
            }}
          />
          {!!(showList && list.length) && (
            <FileAddressList ref={addressListRef}>
              {list?.map((v) => (
                <FileAddressItem
                  key={v.key}
                  onClick={() => {
                    setCurrentValue(v);
                    setInputTextValue(v.title);
                    onSelect(v);

                    setShowList(false);
                  }}
                >
                  {v.title}
                </FileAddressItem>
              ))}
            </FileAddressList>
          )}
        </FileAddress>
      </InnerWrapper>
    );
  },
);

const InnerWrapper = styled.div`
  box-shadow: ${({ theme }) => theme.insetPixelatedBorder};
  width: 100%;
  padding: 2px;
  height: 100%;
  background: #fff;
`;

const FileAddressItem = styled.div`
  padding-inline: 4px;

  &:hover {
    background: ${({ theme }) => theme.windowTopBarBackgroundPrimary};
    color: #fff;
  }
`;

const FileAddress = styled.div`
  position: relative;
  margin-left: 4px;
  flex-grow: 1;
`;

const FileAddressList = styled.div`
  width: 100%;
  position: absolute;
  background: #fff;
  border: 1px solid #000;
`;
