import { Box, Button, Stack, Typography } from "@mui/material";
import { alpha } from "@mui/system";
import CustomImageContainer from "components/CustomImageContainer";
import React from "react";
import { CustomStackFullWidth } from "styled-components/CustomStyles.style";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { t } from "i18next";
import { getAmountWithSign, getDiscountedAmount } from "helper-functions/CardHelpers";
import ReportProblemIcon from "@mui/icons-material/ReportProblem";
import usePostLocationUpdate from "components/home/module-wise-components/rental/rental-api-manage/hooks/react-query/confirm-booking/usePostLocationUpdate";
import { useMutation } from "react-query";
import useDeleteMultipleItem from "components/home/module-wise-components/rental/rental-api-manage/hooks/react-query/confirm-booking/useDeleteMultipleItem";
import { onErrorResponse } from "api-manage/api-error-response/ErrorResponses";
import { setCartList } from "redux/slices/cart";
import { toast } from "react-hot-toast";
import { useDispatch } from "react-redux";
import { LoadingButton } from "@mui/lab";
import { bookingConfirm } from "../global/search/searchHepler";
import { getGuestId, getToken } from "helper-functions/getToken";
import { mainPrice } from "../utils/bookingHepler";
const TripVehicleList = ({
  cartLists,
  ids,
  onCloseModal,
  updateCartObject,
  card,
  confirmMutate,
 
 
}) => {
  
  const dispatch = useDispatch();
  const { mutate: userDataUpdateMutate, isLoading: userDataIsLoading } =
    usePostLocationUpdate();
  const { mutate, isLoading } = useDeleteMultipleItem();

  const tempUpdateCartObject = {userId: updateCartObject?.userId,
    pickup_location: updateCartObject?.locations?.pickup,
    destination_location: updateCartObject?.locations?.destination,
    rental_type: updateCartObject?.tripType,
    estimated_hours: updateCartObject?.durationValue,
    pickup_time: updateCartObject?.dateValue,
    destination_time: Math.floor(
      updateCartObject?.data?.rows?.[0]?.elements[0]?.duration?.value / (60 * 60)
    ),
    distance: updateCartObject?.data?.rows?.[0]?.elements[0]?.distance?.value / 1000,
    guest_id: getToken() ? null : getGuestId()
   }

  const removeAndAdd = () => {
    if(card){
      mutate(ids, {
        onSuccess: (data) => {
          userDataUpdateMutate(tempUpdateCartObject, {
          onSuccess: (res) => {

            bookingConfirm({
              ...updateCartObject,
              confirmMutate,
              dispatch,
              setCartList,
              toast,
              handleClose: onCloseModal,
              onErrorResponse,
            });
            // dispatch(setCartList(res));
            // toast.success("confirm booking successfully!");
            // onCloseModal?.();
          },
          onError: onErrorResponse,
        });
      },
      onError: onErrorResponse,
    });
    }else{
      mutate(ids, {
        onSuccess: (data) => {
          userDataUpdateMutate(updateCartObject, {
          onSuccess: (res) => {
            dispatch(setCartList(res));
            toast.success("updated successfully!");
            onCloseModal?.();
          },
          onError: onErrorResponse,
        });
      },
      onError: onErrorResponse,
    });
  }
  };

  return (
    <>
      {" "}
      <CustomStackFullWidth sx={{ maxWidth: "462px" }}>
        <Box sx={{ maxHeight: '30vh', overflowY: 'auto' }}>
          {cartLists?.map((item) => (
            <Vehicle key={item?.id} item={item} ids={ids} cartList={cartLists} />
          ))}
        </Box>
        <Box sx={{ textAlign: "center" }}>
          <Typography
            sx={{
              fontSize: "14px",
              fontWeight: "400",
              color: (theme) => theme.palette.neutral[400],
              mt: "30px",
            }}
          >

            {t(`One of the vehicles in your list doesnt have a ${cartLists?.user_data?.trip_type !== "distance" ? "distance wise" : "hourly"} trip.
            If you proceed with a ${cartLists?.user_data?.trip_type !== "distance" ? "distance wise" : "hourly"}  trip this vehicle will be
            removed.`)}
            
          </Typography>
        </Box>
        <Stack
          direction={{xs:"column",md:"row"}}  
          spacing={2}
          justifyContent="center"
          sx={{ mt: "40px" }}
        >
          <Button
            onClick={onCloseModal}
            variant="contained"
            sx={{
              borderRadius: "10px",
              fontSize: "16px",
              py: "16px",
              width: "100%",
              "&:hover": {
                background: (theme) => alpha(theme.palette.neutral[400], 0.5),
              },
              color: "red",
              backgroundColor: "rgba(0, 0, 0, 0.05)",
            }}
          >
            {t("Cancel")}
          </Button>
          <LoadingButton
            onClick={removeAndAdd}
            variant="contained"
            sx={{
              borderRadius: "10px",
              width: "100%",
              py: "16px",
              fontSize: "16px",
            }}
            loading={userDataIsLoading}
          >
            {t("Remove & Continue")}
          </LoadingButton>
        </Stack>
      </CustomStackFullWidth>
    </>
  );
};

export default TripVehicleList;

const Vehicle = ({ item, ids,cartList }) => {
  const isNotMatchItem = () => {
    return ids.includes(item?.id);
  };
  
  return (
    <>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "start",
          backgroundColor: (theme) => alpha(theme.palette.neutral[200], 0.3),
          borderRadius: "5px",
          p: "15px",
          mb: "15px",
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "start",
            alignItems: "start",
            gap: "10px",
          }}
        >
          <CustomImageContainer
            src={item?.vehicle?.images_full_url[0]}
            width="60px"
            height="60px"
            borderRadius="5px"
          />
          <Box>
            <Typography sx={{ fontWeight: "500", fontSize: "14px" }}>
              {item?.vehicle?.name}
            </Typography>
            <Box sx={{ mt: "4px" }}>
              {item?.vehicle?.trip_hourly === 1 && (
                <Stack
                  direction="row"
                  justifyContent="start"
                  alignItems={{xs:"start",md:"center"}}
                  sx={{ gap: "5px" }}
                >
                  <Typography
                    sx={{
                      color: (theme) => theme.palette.neutral[500],
                      fontSize: "12px",
                      fontWeight: "400",
                    }}
                  >
                    {t("Hourly")}:
                  </Typography>
                  <Typography
                  component="span"
                    variant="body2"
                    sx={{
                      fontSize: "12px",
                      fontWeight: "600",
                      color: (theme) => theme.palette.neutral[500],
                    }}
                  >
                    
                    {item?.vehicle?.discount_price > 0 ||
         item?.vehicle?.provider?.discount?.discount > 0 ?<Typography
         component="span"
         sx={{
           color: (theme) => theme.palette.neutral[400],
           textDecoration: "line-through",
           fontSize: "10px",
           fontWeight: "500",
         }}
       >
         {getAmountWithSign(item?.vehicle?.hourly_price)}
       </Typography> : null}
                    {" "}
                    {getAmountWithSign(
            getDiscountedAmount(
              item?.vehicle?.hourly_price,
              item?.vehicle?.discount_price,
              item?.vehicle?.discount_type,
              item?.provider?.discount,
             1
            )
          )}{" "}
                    
                  </Typography>
                </Stack>
              )}

              {item?.vehicle?.trip_distance === 1 && (
                <Stack
                  direction="row"
                  justifyContent="start"
                  alignItems="center"
                  sx={{ gap: "5px" }}
                >
                  <Typography
                    sx={{
                      color: (theme) => theme.palette.neutral[500],
                      fontSize: "12px",
                      fontWeight: "400",
                    }}
                  >
                    {t("Distance")}:
                  </Typography>
                  <Typography
                  component="span"
                    variant="body2"
                    sx={{
                      fontSize: "12px",
                      fontWeight: "600",
                      color: (theme) => theme.palette.neutral[500],
                    }}
                  >
                    
                    {item?.vehicle?.discount_price > 0 ||
         item?.vehicle?.provider?.discount?.discount > 0 ?<Typography
         component="span"
         sx={{
           color: (theme) => theme.palette.neutral[400],
           textDecoration: "line-through",
           fontSize: "10px",
           fontWeight: "500",
         }}
       >
         {getAmountWithSign(item?.vehicle?.distance_price)}
       </Typography> : null}
                    {" "}
                    {getAmountWithSign(
            getDiscountedAmount(
              item?.vehicle?.distance_price,
              item?.vehicle?.discount_price,
              item?.vehicle?.discount_type,
              item?.provider?.discount,
              1
            )
          )}{" "}
                    
                  </Typography>
                </Stack>
              )}
            </Box>
          </Box>
        </Box>
        {isNotMatchItem() ? (
          <ReportProblemIcon
            sx={{ color: (theme) => theme.palette.error.main }}
          />
        ) : (
          <CheckCircleIcon
            sx={{ color: (theme) => theme.palette.primary.main }}
          />
        )}
      </Box>
    </>
  );
};
