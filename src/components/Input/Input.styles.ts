import { TextField } from "@mui/material";
import styled from "@emotion/styled";

export const StyledTextField = styled(TextField)`
  .MuiInputBase-root {
    width: 280px;
    height: 40px;
    border-radius: 8px;
  }
`;

export const Label = styled.label`
  font-size: 15px;
  font-weight: 800;
`;

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
`;
