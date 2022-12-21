import { Container, Label, StyledTextField } from "./Input.styles";

import { StandardTextFieldProps } from "@mui/material";

interface Props extends StandardTextFieldProps {}

export const Input = ({ label, ...props }: Props) => {
  return (
    <Container>
      <Label>{label}</Label>
      <StyledTextField {...props} />
    </Container>
  );
};
