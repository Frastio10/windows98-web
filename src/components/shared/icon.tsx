import { icon } from "../../utils";

interface IconProps {
  name: string;
  index: number;
  [key: string]: any;
}
export const Icon = ({ name, index, ...rest }: IconProps) => {
  return <img src={icon(name, index)} {...rest} />;
};
