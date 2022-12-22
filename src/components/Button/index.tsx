import { LoadingButtonProps } from "@mui/lab";
import { StyledButton } from "./Button.styles";

interface Props extends LoadingButtonProps {}

const Button = ({ children, ...props }: Props) => {
  return <StyledButton {...props}>{children}</StyledButton>;
};

export default Button;
