import React from "react";

export default function SectionDivier({ ...rest }) {
  return (
    <hr
      {...rest}
      style={{
        borderTop: "1px solid white",
        boxShadow: "0px -1px 0px #808080",
        margin: "6px 0",
      }}
    />
  );
}
