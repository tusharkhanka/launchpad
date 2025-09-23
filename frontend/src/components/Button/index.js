import React, { forwardRef } from "react";

import PropTypes from "prop-types";
import { makeStyles, Button as MUIButton } from "@material-ui/core";
import CircularProgress from "@material-ui/core/CircularProgress";
import Tooltip from "@material-ui/core/Tooltip";
import IconButton from "@material-ui/core/IconButton";
import clsx from "clsx";

// Icons
import EditIcon from "@material-ui/icons/EditOutlined";
import ViewIcon from "@material-ui/icons/VisibilityOutlined";
import ApproveIcon from "@material-ui/icons/ThumbUpOutlined";
import CloseIcon from "@material-ui/icons/ArchiveOutlined";
import AddIcon from "@material-ui/icons/AddOutlined";
import SettleIcon from "@material-ui/icons/AssignmentTurnedInOutlined";
import ExpireIcon from "@material-ui/icons/TimerOffOutlined";
import DeleteIcon from "@material-ui/icons/DeleteOutlineOutlined";
import InfoIcon from "@material-ui/icons/InfoOutlined";
import ExpandIcon from "@material-ui/icons/ExpandMore";
import CollapseIcon from "@material-ui/icons/ExpandLessOutlined";
import CopyIcon from "@material-ui/icons/FileCopyOutlined";
import SwapHorizIcon from "@material-ui/icons/SwapHoriz";
import BlockIcon from "@material-ui/icons/Block";
import RejectIcon from "@material-ui/icons/ThumbDownOutlined";
import SuspendIcon from "@material-ui/icons/PauseCircleFilled";
import ScoreIcon from "@material-ui/icons/Score";
import CrossIcon from "@material-ui/icons/Close";
import MonetizationOnIcon from "@material-ui/icons/MonetizationOn";
import AssignmentIcon from "@material-ui/icons/Assignment";
import Twitter from "@material-ui/icons/Twitter";
import SendIcon from "@material-ui/icons/Send";
import DoneAllIcon from "@material-ui/icons/DoneAll";

const useStyles = makeStyles(() => ({
  blackButton: {
    backgroundColor: "black",
    color: "white",
    "&:hover": {
      backgroundColor: "#333",
    },
    "&.Mui-disabled": {
      backgroundColor: "#555 !important",
      color: "lightgrey !important",
      opacity: 1,
    },
  },
  blackButtonOutlined: {
    border: "1px solid black",
    color: "black",
    "&:hover": {
      backgroundColor: "#333",
      color: "white",
    },
    "&.Mui-disabled": {
      backgroundColor: "#555 !important",
      color: "lightgrey !important",
      opacity: 1,
    },
  },
}));

export const Button = forwardRef(
  (
    { children, type, fullWidth, disabled, loading, icon, onClick, color, variant, size, className, style, ...props },
    ref
  ) => {
    const classes = useStyles();
    return (
      <MUIButton
        variant={variant}
        color={color}
        type={type}
        disabled={disabled}
        startIcon={icon}
        fullWidth={fullWidth}
        onClick={onClick}
        size={size}
        className={clsx(className, variant === "outlined" ? classes.blackButtonOutlined : classes.blackButton)}
        style={style}
        ref={ref}
        {...props}
      >
        {loading ? <CircularProgress style={{ color: "white" }} size={24} /> : children}
      </MUIButton>
    );
  }
);

Button.propTypes = {
  children: PropTypes.node,
  type: PropTypes.string,
  fullWidth: PropTypes.bool,
  disabled: PropTypes.bool,
  loading: PropTypes.bool,
  icon: PropTypes.element,
  onClick: PropTypes.func,
  color: PropTypes.string,
  variant: PropTypes.string,
  size: PropTypes.string,
  className: PropTypes.string,
  style: PropTypes.object,
};

Button.defaultProps = {
  color: "primary",
  variant: "contained",
};

export const ActionButton = ({ icon, tooltip, tooltipTitle, onClick, action, disabled, className, style }) => {
  if (["edit"].includes(action)) {
    icon = <EditIcon />;
  }

  if (["view"].includes(action)) {
    icon = <ViewIcon />;
  }

  if (["approve"].includes(action)) {
    icon = <ApproveIcon />;
  }

  if (["close"].includes(action)) {
    icon = <CloseIcon />;
  }

  if (["add"].includes(action)) {
    icon = <AddIcon />;
  }

  if (["settle"].includes(action)) {
    icon = <SettleIcon />;
  }

  if (["expire"].includes(action)) {
    icon = <ExpireIcon />;
  }

  if (["delete"].includes(action)) {
    icon = <DeleteIcon />;
  }

  if (["info"].includes(action)) {
    icon = <InfoIcon />;
  }

  if (["expand"].includes(action)) {
    icon = <ExpandIcon />;
  }

  if (["collapse"].includes(action)) {
    icon = <CollapseIcon />;
  }

  if (["duplicate"].includes(action)) {
    icon = <CopyIcon />;
  }

  if (["reverse-settle"].includes(action)) {
    icon = <SwapHorizIcon />;
  }

  if (["cancel-events"].includes(action)) {
    icon = <BlockIcon />;
  }

  if (["reject"].includes(action)) {
    icon = <RejectIcon />;
  }

  if (["suspend"].includes(action)) {
    icon = <SuspendIcon />;
  }

  if (["score"].includes(action)) {
    icon = <ScoreIcon />;
  }

  if (["dismiss"].includes(action)) {
    icon = <CrossIcon />;
  }

//   if (["clickup-active"].includes(action)) {
//     icon = <ClickupActive />;
//   }

//   if (["clickup-disabled"].includes(action)) {
//     icon = <ClickupDisabled />;
//   }

  if (["monetization-icon"].includes(action)) {
    icon = <MonetizationOnIcon />;
  }

  if (["assignment-icon"].includes(action)) {
    icon = <AssignmentIcon />;
  }

  if (["publish"].includes(action)) {
    icon = <SendIcon />;
  }

  if (["twitter"].includes(action)) {
    icon = <Twitter />;
  }

  if (["check"].includes(action)) {
    icon = <DoneAllIcon />;
  }

  if (tooltip) {
    return (
      <Tooltip title={tooltipTitle}>
        <span>
          <IconButton className={className} style={style} onClick={onClick} disabled={disabled}>
            {icon}
          </IconButton>
        </span>
      </Tooltip>
    );
  }

  return (
    <IconButton className={className} style={style} onClick={onClick} disabled={disabled}>
      {icon}
    </IconButton>
  );
};

ActionButton.propTypes = {
  icon: PropTypes.element,
  tooltip: PropTypes.bool,
  tooltipTitle: PropTypes.string,
  onClick: PropTypes.func,
  action: PropTypes.string,
  disabled: PropTypes.bool,
};

ActionButton.defaultProps = {
  disabled: false,
};
