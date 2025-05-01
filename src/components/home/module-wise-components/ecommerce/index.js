import { Grid } from "@mui/material";
import useGetNewArrivalStores from "api-manage/hooks/react-query/store/useGetNewArrivalStores";
import { useGetVisitAgain } from "api-manage/hooks/react-query/useGetVisitAgain";
import Brands from "components/home/brands";
import PaidAds from "components/home/paid-ads";
import { getModuleId } from "helper-functions/getModuleId";
import { getToken } from "helper-functions/getToken";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { IsSmallScreen } from "utils/CommonValues";
import useGetOtherBanners from "../../../../api-manage/hooks/react-query/useGetOtherBanners";
import CustomContainer from "../../../container";
import OrderDetailsModal from "../../../order-details-modal/OrderDetailsModal";
import BestReviewedItems from "../../best-reviewed-items";
import FeaturedCategories from "../../featured-categories";
import LoveItem from "../../love-item";
import PopularItemsNearby from "../../popular-items-nearby";
import RunningCampaigns from "../../running-campaigns";
import SpecialFoodOffers from "../../special-food-offers";
import Stores from "../../stores";
import VisitAgain from "../../visit-again";
import FeaturedStores from "../pharmacy/featured-stores";
import PharmacyStaticBanners from "../pharmacy/pharmacy-banners/PharmacyStaticBanners";
import CampaignBanners from "./CampaignBanners";
import FeaturedCategoriesWithFilter from "./FeaturedCategoriesWithFilter";
import NewArrivals from "./NewArrivals";
import SinglePoster from "./SinglePoster";
import TopOffersNearMe from "components/home/top-offers-nearme";

const Shop = ({ configData }) => {
  const menus = ["All", "Beauty", "Bread & Juice", "Drinks", "Milks"];
  const { orderDetailsModalOpen } = useSelector((state) => state.utilsData);
  const [storeData, setStoreData] = React.useState([]);
  const [isVisited, setIsVisited] = useState(false);
  const token = getToken();
  const { data, refetch, isLoading } = useGetOtherBanners();
  const {
    data: visitedStores,
    refetch: refetchVisitAgain,
    isFetching,
  } = useGetVisitAgain();
  const {
    data: newStore,
    refetch: newStoreRefetch,
    isFetching: newIsFetching,
  } = useGetNewArrivalStores({
    type: "all",
  });
  useEffect(() => {
    const fetchData = async () => {
      try {
        await refetch();
        if (token) {
          await refetchVisitAgain();
        }
        newStoreRefetch();
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [token]);

  useEffect(() => {
    if (visitedStores?.length > 0 || newStore?.stores?.length > 0) {
      if (visitedStores?.length > 0 && visitedStores) {
        setStoreData(visitedStores);
        setIsVisited(true);
      } else {
        if (newStore?.stores) {
          setStoreData(newStore?.stores);
        }
      }
    }
  }, [visitedStores, newStore?.stores, getModuleId()]);

  return (
    <Grid container gap={1}>
      <Grid item xs={12} sx={{ marginTop: { xs: "-10px", sm: "10px" } }}>
        <CustomContainer>
          <FeaturedCategories configData={configData} />
        </CustomContainer>
      </Grid>
      <Grid item xs={12}>
        <CustomContainer>
          <PharmacyStaticBanners />
        </CustomContainer>
      </Grid>
      <Grid item xs={12}>
        {IsSmallScreen() ? (
          <VisitAgain
            configData={configData}
            visitedStores={storeData}
            isVisited={isVisited}
            isFetching={newIsFetching || isFetching}
          />
        ) : (
          <CustomContainer>
            <VisitAgain
              configData={configData}
              visitedStores={storeData}
              isVisited={isVisited}
              isFetching={isFetching || newIsFetching}
            />
          </CustomContainer>
        )}
      </Grid>
      <Grid item xs={12}>
        <CustomContainer>
          <PaidAds />
        </CustomContainer>
      </Grid>
      <Grid item xs={12}>
        <CustomContainer>
          <PopularItemsNearby
            title="Most Popular Products"
            subTitle="We provide best quality & valuable products around the world"
          />
        </CustomContainer>
      </Grid>
      <Grid item xs={12}>
        <CustomContainer>
          <TopOffersNearMe title="Top offers near me" />
        </CustomContainer>
      </Grid>
      <Grid item xs={12}>
        <CustomContainer>
          <CampaignBanners />
        </CustomContainer>
      </Grid>
      <Grid item xs={12}>
        <CustomContainer>
          <SpecialFoodOffers />
        </CustomContainer>
      </Grid>
      <Grid item xs={12}>
        <CustomContainer>
          <FeaturedStores title="Popular Store" configData={configData} />
        </CustomContainer>
      </Grid>
      <Grid item xs={12}>
        <CustomContainer>
            <BestReviewedItems
                menus={menus}
                title="Best Reviewed Items"
                bannerIsLoading={isLoading}
                url={`${data?.promotional_banner_url}/${data?.best_reviewed_section_banner}`}
            />
        </CustomContainer>
      </Grid>
      <Grid item xs={12}>
        <CustomContainer>
          <NewArrivals bannerData={data} />
        </CustomContainer>
      </Grid>
      <Grid item xs={12}>
        <CustomContainer>
          <RunningCampaigns />
        </CustomContainer>
      </Grid>
      <Grid item xs={12}>
        <CustomContainer>
          <LoveItem />
        </CustomContainer>
      </Grid>
      <Grid item xs={12}>
        <CustomContainer>
          <FeaturedCategoriesWithFilter title="Featured Categories" />
        </CustomContainer>
      </Grid>
      <Grid item xs={12}>
        <CustomContainer>
          <Brands />
        </CustomContainer>
      </Grid>
      <Grid item xs={12}>
        <CustomContainer>
          <SinglePoster bannerData={data} />
        </CustomContainer>
      </Grid>
      <Grid item xs={12}>
        <CustomContainer>
          <Stores />
        </CustomContainer>
      </Grid>
      {orderDetailsModalOpen && !token && (
        <OrderDetailsModal orderDetailsModalOpen={orderDetailsModalOpen} />
      )}
    </Grid>
  );
};

Shop.propTypes = {};

export default Shop;
