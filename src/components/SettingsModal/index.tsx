import { Popover, Typography } from "@mui/material";

import React from "react";

interface Props {
  open: Element | null;
  onClose: () => void;
}

const SettingsModal = ({ open, onClose }: Props) => {
  return (
    <Popover
      open={!!open}
      anchorEl={open}
      onClose={onClose}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "left",
      }}
    >
      <Typography sx={{ p: 2 }}>The content of the Popover.</Typography>
    </Popover>
  );
};

export default SettingsModal;
