import React, { useEffect, useRef, useState } from "react";
import {
  alpha,
  Autocomplete,
  InputAdornment,
  Paper,
  TextField,
} from "@mui/material";

import RecentAddresses from "../../../components/global/RecentAddress";
import MapModal from "components/Map/MapModal";

const RentalSearchLocation = (props) => {
  const {
    HandleChangeForSearch,
    predictions,
    handleChange,
    label,
    onFocus,
    value,
    endIcon,
    pickLocationFormAddress,

    height = "45px",
    width = 350,
    result,
    getCurrentLocation,
    // isSetCurrentLocation,
    fromHome,
    setOpenMap,focusedField

  } = props;

  const [dropdownOpen, setDropdownOpen] = useState(false);

  const timeoutRef = useRef(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const handleMouseDownRecentAddresses = (event, value) => {
    event.stopPropagation();
    if (value?.isCurrent === "current") {
      // isSetCurrentLocation?.(true);
      getCurrentLocation?.(value);
    } else {
      if (value) {
        pickLocationFormAddress?.(value);
        setDropdownOpen(false);
      }
    }
  };

  let recentlyAddress = undefined;
  if (typeof window !== "undefined") {
    recentlyAddress = JSON.parse(localStorage.getItem("destination_location"));
  }

  return (
    <Autocomplete
      fullWidth
      disabled={result === false}
      defaultValue={value?.description || []}
      value={value || []}
      options={predictions || []} // Handle empty predictions gracefully
      getOptionLabel={(option) => option.description || ""}
      onChange={(event, selectedValue) => handleChange(event, selectedValue)}
      isOptionEqualToValue={(option, selectedValue) =>
        option.description === selectedValue?.description
      }
      clearOnBlur={false}
      open={dropdownOpen} // Control dropdown state
      onOpen={() => setDropdownOpen(true)} // Open dropdown
      onClose={(event, reason) => {
        if (value?.description) {
          setDropdownOpen(false);
        }
      }}
      sx={{ width: width, maxWidth: "100%" }}
      PaperComponent={(props) => (
        <>
          {!value?.description && focusedField==="destination" ? (
            <div>
              <RecentAddresses
                pickLocationFormAddress={pickLocationFormAddress}
                handleMouseDownRecentAddresses={handleMouseDownRecentAddresses}
                recentlyAddress={recentlyAddress}
                fromHome={fromHome}
                setOpenMap={setOpenMap}
              />
            </div>
          ) : (
            <Paper
              sx={{
                borderRadius: "0 0 4px 4px",
              }}
              {...props}
            />
          )}
        </>
      )}
      renderInput={(params) => (
        <TextField
          {...params}
          onFocus={onFocus}
          label={label}
          placeholder={label}
          onChange={(event) => HandleChangeForSearch(event)}
          onBlur={() => {
            timeoutRef.current = setTimeout(() => {
              setDropdownOpen(false);
            }, 300);
          }}
          sx={{
            "& .MuiOutlinedInput-root": {
              height: height,
              padding: "5.5px 4px 7.5px 6px",
              paddingRight: "10px !important",
              "& fieldset": {
                border: `1px solid  ${theme=>theme.palette.neutral[300]}`,
              },
              "&:hover fieldset": {
                borderColor: "#888",
              },
              "&.Mui-focused fieldset": {
                border: "1px solid",
                borderColor: (theme) => alpha(theme.palette.primary.main, 0.4),
              },
            },
            "& .MuiInputLabel-root": {
              padding: "0 4px",
              transform: "translate(14px, -6px) scale(0.75)",
            },
          }}
          InputProps={{
            ...params.InputProps,
            endAdornment: endIcon ? (
              <InputAdornment position="end">{endIcon}</InputAdornment>
            ) : null, // Render the endIcon if provided
          }}
          InputLabelProps={{
            shrink: true,
          }}
        />
      )}
    />
  );
};

export default RentalSearchLocation;
