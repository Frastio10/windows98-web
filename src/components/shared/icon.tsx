import { icon, iconSize } from "../../utils";

interface IconProps {
  name: string;
  index: number;
  [key: string]: any;
}

type IconSize = "small" | "medium" | "big";

interface IconSizeProps {
  iconKey: string;
  size: IconSize;
  [key: string]: any;
}

export const Icon = ({ name, index, ...rest }: IconProps) => {
  return <img src={icon(name, index)} {...rest} />;
};

export const IconSize = ({ iconKey, size, ...rest }: IconSizeProps) => {
  return <img src={iconSize(iconKey, size)} {...rest} />;
};
