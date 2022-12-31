import { Container, StyledPopover } from "./SettingsModal.styles";

import React from "react";
import { Typography } from "@mui/material";

interface Props {
  open: Element | null;
  onClose: () => void;
}

const SettingsModal = ({ open, onClose }: Props) => {
  return (
    <StyledPopover
      open={!!open}
      anchorEl={open}
      onClose={onClose}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "left",
      }}
    >
      <Container>
        <Typography sx={{ p: 2 }}>The content of the Popover.</Typography>
      </Container>
    </StyledPopover>
  );
};

export default SettingsModal;
