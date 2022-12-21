import { LoadingButtonProps } from "@mui/lab";
import { StyledButton } from "./Button.styles";

interface Props extends LoadingButtonProps {}

export const Button = ({ children, ...props }: Props) => {
  return <StyledButton {...props}>{children}</StyledButton>;
};
