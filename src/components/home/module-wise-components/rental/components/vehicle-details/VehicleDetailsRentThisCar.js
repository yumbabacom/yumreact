import React, { useEffect, useState } from "react";
import RentalCardWrapper from "../global/RentalCardWrapper";
import { borderRadius, Box, display } from "@mui/system";
import {
  Button,
  ButtonBase,
  IconButton,
  Stack,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import RentWithIncrementDecrement from "../global/RentWithIncrementDecrement";
import {
  cardDiscount,
  cardTotalPrice,
  mainPrice,
} from "components/home/module-wise-components/rental/components/utils/bookingHepler";
import { useDispatch, useSelector } from "react-redux";
import { t } from "i18next";
import WarningIcon from '@mui/icons-material/Warning';
import {
  getAmountWithSign,
  getDiscountedAmount,
} from "helper-functions/CardHelpers";
import { bookingConfirm } from "components/home/module-wise-components/rental/components/global/search/searchHepler";
import { setCartList } from "redux/slices/cart";
import CloseIcon from "@mui/icons-material/Close";
import { toast } from "react-hot-toast";
import { onErrorResponse } from "api-manage/api-error-response/ErrorResponses";
import { ACTIONS } from "components/home/module-wise-components/rental/components/global/carCardState";
import useConfirmBooking from "components/home/module-wise-components/rental/rental-api-manage/hooks/react-query/confirm-booking/useConfirmBooking";
import useUpdateBookingCart from "components/home/module-wise-components/rental/rental-api-manage/hooks/react-query/confirm-booking/useUpdateBookingCart";
import {
  removeItemFromCart,
  updateCart,
} from "components/home/module-wise-components/rental/components/rental-cart/helper";
import useDeleteItemFromBooking from "components/home/module-wise-components/rental/rental-api-manage/hooks/react-query/confirm-booking/useDeleteItemFromBooking";
import dynamic from "next/dynamic";
import ProviderCheck from "../global/ProviderCheck";
import CustomModal from "components/modal";
import { LoadingButton } from "@mui/lab";
import usePostLocationUpdate from "../../rental-api-manage/hooks/react-query/confirm-booking/usePostLocationUpdate";
import { getGuestId, getToken } from "helper-functions/getToken";
import TripModalContent from "../rental-cart/TripModalContent";
import TripVehicleList from "../rental-cart/TripVehicleList";
import InfoIcon from "@mui/icons-material/Info";
const CarBookingModal = dynamic(() =>
  import(
    "components/home/module-wise-components/rental/components/global/CarBookingModal"
  )
);

const VehicleDetailsRentThisCar = ({
  shadow,
  marginTop,
  height,
  borderRadius,
  isFixed = true,
  vehicleDetails,
  typeWisePrice,
  fromSearch = true,
  userData,
  selectedPricing,
  from,
  handleClose,
  openCarBookingModal,  
  handleIncrementFromCard,
  handleDecrementFromCard ,
  addToCartHandler:addToCartHandlerFromCard,
  fullWidth
}) => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const [isVisible, setIsVisible] = useState(false);
  const [open, setOpen] = React.useState(false);
  const [distanceOrHours, setDistanceOrHours] = React.useState(0);
  const [cartItemData, setCartItemData] = useState({});
  const [openProviderCheck, setOpenProviderCheck] = useState(false);
  const [isSameOpen, setIsSameOpen] = useState(false);
  const [openTripChange, setOpenTripChange] = React.useState(false);
  const [ids, setIds] = React.useState(null);
  const [openHourDiffModal, setOpenHourDiffModal] = useState(false);
  const [updateOrAdd, setUpdateOrAdd] = useState({
    type: 'add',
    quantity: 0
  });
  const [updateCartObject, setUpdateCartObject] = React.useState({});
  const isSmall = useMediaQuery(theme.breakpoints.down("sm"));

  const rentalSearch = useSelector((state) => state?.rentalSearch?.rentalSearch);
  const { cartList } = useSelector((state) => state.cart);
  const distance =
    rentalSearch?.distanceData?.rows?.[0]?.elements[0]?.distance?.value / 1000;

  const isDifferentProvider = cartList?.carts?.some(
    (cart) => cart.provider?.id !== vehicleDetails?.provider?.id
  );

  const handleProviderCheck = (payload) => {
    setOpenProviderCheck(payload);
  };

  useEffect(() => {
    if (userData) {
      setDistanceOrHours(
        userData?.rental_type === "hourly"
          ? userData?.estimated_hours
          : userData?.distance
      );
    } else {
      if (rentalSearch) {
        setDistanceOrHours(
          rentalSearch?.tripType === "hourly"
            ? rentalSearch?.duration
            : distance
        );
      }
    }
  }, [userData, rentalSearch]);

  const { mutate: confirmMutate, isLoading: confirmIsLoading } = useConfirmBooking();
  const { mutate: updateMutate, isLoading: updateIsLoading } =
    useUpdateBookingCart();
  const { mutate: userDataUpdateMutate, isLoading: userDataIsLoading } =
    usePostLocationUpdate();
  const isProductExist = cartList?.carts?.find(
    (item) => item.vehicle?.id === vehicleDetails?.id
  );
  const { mutate } = useDeleteItemFromBooking();

  const handleIncrement = (cartItem) => {
    if(handleIncrementFromCard){
      handleIncrementFromCard(cartItem);
    }else{
      const updateQuantity = cartItem?.quantity + 1;
      if (vehicleDetails?.total_vehicles < updateQuantity) {
        toast.error(
          t(
            `You can't add more than ${vehicleDetails?.total_vehicles} quantities of this vehicle.`
          )
        );
      } else {
        if(from === "from_search"){
          if(Number(rentalSearch?.duration) === Number(cartList?.user_data?.estimated_hours)){
            updateCart(
              cartItem,
              cartList?.user_data,
              dispatch,
              setCartList,
              updateQuantity,
              updateMutate
            );
          }else{
            setUpdateOrAdd({
              type: 'update',
              quantity: updateQuantity,
              cartItem: cartItem
            });
            setOpenHourDiffModal(true);
          }
        }else{
          updateCart(
            cartItem,
            cartList?.user_data,
            dispatch,
            setCartList,
            updateQuantity,
            updateMutate
          );
        }
        
      }
    }
    
  };

  const handleDecrement = (cartItem) => {
    if(handleDecrementFromCard){
      
      handleDecrementFromCard(cartItem);
    }else{
      const updateQuantity = cartItem?.quantity - 1;
      if(from === "from_search"){
        if(Number(rentalSearch?.duration) === Number(cartList?.user_data?.estimated_hours) ){
          updateCart(
            cartItem,
            cartList?.user_data,
            dispatch,
            setCartList,
            updateQuantity,
            updateMutate
          );
        }else{
          setUpdateOrAdd({
            type: 'update',
            quantity: updateQuantity,
            cartItem: cartItem
          });
          setOpenHourDiffModal(true);
        }
      }else{
        updateCart(
          cartItem,
          cartList?.user_data,
          dispatch,
          setCartList,
          updateQuantity,
          updateMutate
          );
      }
    }
    
  };

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 200) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);


  const calculatePrice = () => {
    if (isProductExist) {
      return cardTotalPrice(
        typeWisePrice,
        distanceOrHours,
        isProductExist.quantity
      );;
    } else {
      return mainPrice(vehicleDetails, rentalSearch?.tripType);
    }
  };

  const priceWithDiscount = () => {
    if (isProductExist) {
      return  cardDiscount(
        typeWisePrice,
        distanceOrHours,
        isProductExist.quantity,
        vehicleDetails?.discount_price,
        vehicleDetails?.discount_type,
        vehicleDetails?.provider?.discount?.discount,
        vehicleDetails?.provider?.discount?.max_discount
      )
    } else {
      return getDiscountedAmount(
        mainPrice(vehicleDetails, rentalSearch?.tripType),
        vehicleDetails?.discount_price,
        vehicleDetails?.discount_type,
        vehicleDetails?.provider?.discount,
        1,
        vehicleDetails?.provider?.discount?.max_discount
      );
    }
  };

  const handleSameProvider = (bookingDetails) => {
    if(cartList?.carts?.length>0 ){
      if (rentalSearch?.tripType === cartList?.user_data?.rental_type) {
        if(cartList?.user_data?.rental_type === "hourly"){
          if ( Number(rentalSearch?.duration) === Number(cartList?.user_data?.estimated_hours)) {
            bookingConfirm({
              ...bookingDetails,
              confirmMutate,
              dispatch,
              setCartList,
              toast,
              handleClose: null,
              onErrorResponse,
            });
          }else{
            setOpenHourDiffModal(true);
          }
        }else{
          bookingConfirm({
            ...bookingDetails,
            confirmMutate,
            dispatch,
            setCartList,
            toast,
            handleClose: null,
            onErrorResponse,
          });
        }

      } else {
        setUpdateCartObject?.({
          ...bookingDetails,
          userId: cartList?.user_data?.id,
          id: vehicleDetails?.id,
        });
        setIsSameOpen?.(true);
        handleClose?.();
      }
    }else{
      bookingConfirm({
        ...bookingDetails,
        confirmMutate,
        dispatch,
        setCartList,
        toast,
        handleClose: null,
        onErrorResponse,
      });
    }
    
  };

  const handleDifferentProvider = (bookingDetails) => {
    handleProviderCheck(true);
    setCartItemData(bookingDetails);
  };
  const bookingDetails = {
    id: vehicleDetails?.id,
    locations: {
      pickup: rentalSearch?.pickup_location,
      destination: rentalSearch?.destination_location,
    },
    searchKey1: rentalSearch?.pickup_location?.location_name,
    searchKey2: rentalSearch?.destination_location?.location_name,
    tripType: rentalSearch?.tripType,
    durationValue: rentalSearch?.duration,
    dateValue: rentalSearch?.selectedDate?.$d,
    data: rentalSearch?.distanceData,
  };
  const addToCartHandler = () => {
    if(addToCartHandlerFromCard){
      addToCartHandlerFromCard()
    }else{
      if (from === "from_search") {
        if (isDifferentProvider) {
          handleDifferentProvider(bookingDetails);
        } else {
          handleSameProvider(bookingDetails);
        }
      } else {
        if (openCarBookingModal) {
          openCarBookingModal();
        } else {
          setOpen(true);
        }
      }
    }
   
  };

  const removeItemCart = (cartItem) => {
    removeItemFromCart(cartItem, mutate, dispatch, setCartList);
  };

  const handleChangePrvTripType = () => {
    const tempUpdateCartObject = {
      userId: updateCartObject?.userId,
      pickup_location: updateCartObject?.locations?.pickup,
      destination_location: updateCartObject?.locations?.destination,
      rental_type: updateCartObject?.tripType,
      estimated_hours: updateCartObject?.durationValue,
      pickup_time: updateCartObject?.dateValue,
      destination_time: Math.floor(
        updateCartObject?.data?.rows?.[0]?.elements[0]?.duration?.value /
          (60 * 60)
      ),
      distance:
        updateCartObject?.data?.rows?.[0]?.elements[0]?.distance?.value / 1000,
      guest_id: getToken() ? null : getGuestId(),
    };

    userDataUpdateMutate(tempUpdateCartObject, {
      onSuccess: (res) => {
        bookingConfirm({
          ...updateCartObject,
          confirmMutate,
          dispatch,
          setCartList,
          toast,
          handleClose: setIsSameOpen(false),
          onErrorResponse,
        });
      },
      onError: (error) => {
        if (error.response.data?.length > 0) {
          setIds?.(error.response.data);
          setUpdateCartObject?.(updateCartObject);
          setOpenTripChange?.(true);
          setIsSameOpen(false);
        } else {
          onErrorResponse(error);
        }
      },
    });
  };

  const handleHourDiffModal = (bookingDetails,updateOrAdd) => {

   if(updateOrAdd?.type === 'add'){
      bookingConfirm({
        ...bookingDetails,
        confirmMutate,
        dispatch,
        setCartList,
        toast,
        handleClose: () => setOpenHourDiffModal(false),
        onErrorResponse,
      });
    }else{
      const tempUserData = {...cartList?.user_data,
        estimated_hours: rentalSearch?.duration,
      }
      updateCart(
        updateOrAdd?.cartItem,
        tempUserData,
        dispatch,
        setCartList,
        updateOrAdd?.quantity,
        updateMutate  
      )
      setOpenHourDiffModal(false);
    }
    };

  return (
    <RentalCardWrapper
      padding="20px"
      borderRadius={borderRadius}
      sx={{
        marginTop: marginTop,
        position: isFixed && "fixed",
        bottom: isVisible ? { xs: 60, lg: 0 } : "-100px",
        left: 0,
        right: 0,
        width: "100%",
        height: height,
        display: "flex",
        justifyContent: "center",
        zIndex: 10,
        backgroundColor: (theme) => theme.palette.background.paper,
        boxShadow: shadow
          ? "0 -2px 5px rgba(0, 0, 0, 0.1)"
          : "0px 0px 7px 0px rgba(71, 71, 71, 0.07)",
        transition: "bottom 0.3s ease-in-out",
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexDirection: {xs:"column",md:"row"},
         
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: "5px" }}>
          {isProductExist ? (
            <Typography
              sx={{
                fontSize: "12px",
                fontWeight: "400",
                color: (theme) => theme.palette.neutral[500],
              }}
            >
              {t("Estimated")} (
              {selectedPricing === "hourly"
                ? `${userData?.estimated_hours || rentalSearch?.duration} hr`
                : `${userData?.distance?.toFixed(3)} km`}
              )
            </Typography>
          ) : (
            <Typography
              fontSize={"14px"}
              fontWeight={"400"}
              color={(theme) => theme.palette.neutral[500]}
            >
              {t("Start From")}
            </Typography>
          )}
          <Typography
            sx={{
              fontSize: "14px",
              textDecoration: "line-through",
              color: (theme) => theme.palette.neutral[500],
              fontWeight: "400",
            }}
          >
            {(vehicleDetails?.discount_price > 0 ||
              vehicleDetails?.provider?.discount?.discount > 0) &&
              getAmountWithSign(calculatePrice())}
          </Typography>
          <Typography
            sx={{
              fontSize: "16px",
              fontWeight: "700",
              color: (theme) => theme.palette.neutral[1000],
            }}
          >
            {getAmountWithSign(priceWithDiscount())}
          </Typography>
        </Box>
        <Box sx={{width:{xs:"100%",md:"auto"}}}>
          <RentWithIncrementDecrement
            text={isSmall ? t("Rent") : t("Rent This Car")}
            borderRadius="5px"
            fontSize="14px"
            addToCartHandler={addToCartHandler}
            isProductExist={isProductExist}
            count={isProductExist?.quantity}
            itemId={isProductExist?.id}
            quantity={isProductExist?.quantity || 1}
            handleDecrement={handleDecrement}
            updateLoading={updateIsLoading}
            removeItemCart={removeItemCart}
            handleIncrement={handleIncrement}
            fullWidth={fullWidth}
          />
        </Box>
      </Box>

      {open && (
        <CarBookingModal
          open={open}
          handleClose={() => setOpen(false)}
          id={vehicleDetails?.id}
          fromCard={cartList?.carts?.length > 0}
          selectedPricing={selectedPricing}
          isHourly={vehicleDetails?.trip_hourly}
          isDistence={vehicleDetails?.trip_distance}
          isDifferentProvider={isDifferentProvider}
          handleProviderCheck={handleProviderCheck}
          setCartItemData={setCartItemData}
          callUpdateUserData={false}
          setIsSameOpen={setIsSameOpen}
          setOpenTripChange={setOpenTripChange}
          updateCartObject={updateCartObject}
          setIds={setIds}
          setUpdateCartObject={setUpdateCartObject}
        />
      )}

      <CustomModal
        openModal={openProviderCheck}
        handleClose={() => handleProviderCheck(false)}
      >
        <IconButton
          onClick={() => handleProviderCheck(false)}
          sx={{ position: "absolute", top: 0, right: 0 }}
        >
          <CloseIcon sx={{ fontSize: "16px" }} />
        </IconButton>
        <ProviderCheck
          cartItemData={cartItemData}
          handleProviderCheck={handleProviderCheck}
          confirmMutate={confirmMutate}
          providerId={vehicleDetails?.provider?.id}
        />
      </CustomModal>

      <CustomModal
        openModal={isSameOpen}
        handleClose={() => {
          setIsSameOpen(false);
        }}
        maxWidth="380px"
      >
        <IconButton
          onClick={() => setIsSameOpen(false)}
          sx={{ position: "absolute", top: 0, right: 0 }}
        >
          <CloseIcon sx={{ fontSize: "16px" }} />
        </IconButton>
        <Stack spacing={2} p="1rem">
        <Stack direction="row" spacing={2} alignItems="center" justifyContent="center">
        <InfoIcon sx={{ fontSize: "70px" }} />
           </Stack>
        <Typography textAlign="center"  fontSize="18px" fontWeight="600" color={theme=>theme.palette.error.main}>
            {t(`Do you want to change trip type`)}
          </Typography>
          <Typography
            textAlign="center"
            
            fontSize="16px" 
            fontWeight="400"
          >
           {t(`Are you sure you,  want to switch trip type from ${cartList?.user_data?.rental_type?.replace("_", " ")} ${cartList?.user_data?.rental_type==="hourly"?"based to":""} ${updateCartObject?.tripType?.replace("_", " ")} ${updateCartObject?.tripType==="hourly"?"based":""}? `)}
          </Typography>
          <Stack direction="row" spacing={2} justifyContent="flex-end">
            <Button
              fullWidth
              variant="outlined"
              onClick={() => {
                setIsSameOpen(false);
              }}
            >
              {t("No")}
            </Button>
            <LoadingButton
              loading={userDataIsLoading}
              fullWidth
              variant="contained"
              onClick={handleChangePrvTripType}
            >
              {t("Yes")}
            </LoadingButton>
          </Stack>
        </Stack>
      </CustomModal>

      <CustomModal openModal={openTripChange}>
        <TripModalContent
          title="Trip Vehicle List"
          onCloseModal={() => {
            setOpenTripChange(false);
          }}
          content={
            <TripVehicleList
              onCloseModal={() => {
                setOpenTripChange(false);
              }}
              ids={ids}
              cartLists={cartList?.carts}
              updateCartObject={updateCartObject}
              card
              confirmMutate={confirmMutate}
              dispatch={dispatch}
            />
          }
        />
      </CustomModal>

      <CustomModal openModal={openHourDiffModal} handleClose={()=>{setOpenHourDiffModal(false)}} maxWidth="380px">
      <IconButton
          onClick={() => setOpenHourDiffModal(false)}
          sx={{ position: "absolute", top: 0, right: 0 }}
        >
          <CloseIcon sx={{ fontSize: "16px" }} />
        </IconButton>
        <Stack spacing={2} p="1rem">
        <Stack direction="row" spacing={2} alignItems="center" justifyContent="center">
           <InfoIcon sx={{ fontSize: "70px" }} />
           </Stack>
          <Typography textAlign="center"  fontSize="18px" fontWeight="600" color={theme=>theme.palette.error.main}>
            {t(`Do you want to change trip duration`)}
          </Typography>
          <Typography textAlign="center"  fontSize="16px" fontWeight="400">
            {t(`Are you sure, you want to update trip duration to ${rentalSearch?.duration} hours`)}
          </Typography>
          <Stack direction="row" spacing={2} justifyContent="flex-end">
            <Button fullWidth  variant="outlined" onClick={()=>{setOpenHourDiffModal(false)}}>
              {t("No")}
            </Button>
            <LoadingButton loading={confirmIsLoading} fullWidth variant="contained" onClick={()=>{handleHourDiffModal(bookingDetails,updateOrAdd)}}>
              {t("Yes")} 
            </LoadingButton>
          </Stack>
        </Stack>
      </CustomModal>

    </RentalCardWrapper>
  );
};

export default VehicleDetailsRentThisCar;
