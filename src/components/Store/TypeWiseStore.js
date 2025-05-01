import React, { useEffect, useState } from "react";
import { CustomPaperBigCard } from "../../styled-components/CustomStyles.style";
import H1 from "../typographies/H1";
import StoreList from "./StoreList";
import useGetTypeWiseStore from "../../api-manage/hooks/react-query/typewise-store/useGetTypeWiseStore";
import { useRouter } from "next/router";
import useGetPopularStore, {
  useGetPopularStoreWithoutInfiniteScroll,
} from "../../api-manage/hooks/react-query/store/useGetPopularStore";
import { Box } from "@mui/system";
import Shimmer from "../home/stores-with-filter/Shimmer";
import useGetTopOffers from "api-manage/hooks/react-query/product-details/useGetTopOffers";
import useScrollToTop from "api-manage/hooks/custom-hooks/useScrollToTop";
import { getCurrentModuleType } from "helper-functions/getCurrentModuleType";

const TypeWiseStore = ({ storeType, title }) => {
  useScrollToTop();
  const [type, setType] = useState("all");
  const { data, refetch, isLoading } = useGetTypeWiseStore(storeType, type);
  const [sortby, setSortby] = useState('')
  const [searchKey, setSearchKey] = useState('')
  const {
    data: nearByData,
    refetch: nearbyRefetch,
    isLoading: nearMeLoading,
  } = useGetTopOffers(sortby,searchKey,type);
  const queryKey = "navbar-stores";
  const router = useRouter();
  const {
    data: popularData,
    refetch: popularRefetch,
    isLoading: popularIsLoading,
  } = useGetPopularStoreWithoutInfiniteScroll({ queryKey, type });
  useEffect(() => {
    if (storeType === "latest") {
      refetch();
    } else if (storeType === "top_offer_near_me") {
      nearbyRefetch();
    } else {
      if(getCurrentModuleType() === "rental"){
        refetch()
      }else{
        popularRefetch();
      }
    }
  }, [type,sortby,searchKey]);

  const renderShimmer = () => (
    <Box marginTop="40px">
      <Shimmer count="10" />
    </Box>
  );
  const renderStoreList = (itemsData) => (
    <StoreList
      storeType={storeType}
      type={type}
      setType={setType}
      data={itemsData}
      sortby={sortby}
      setSortby={setSortby}
      searchKey={searchKey}
      setSearchKey={setSearchKey}
    />
  );

  const handleStoreList = () => {
    if (storeType === "latest" || getCurrentModuleType() === "rental") {
      if (isLoading) {
        return <>{renderShimmer()}</>;
      } else {
        if (data?.stores?.length > 0) {
          return <>{renderStoreList(data?.stores)}</>;
        }
      }
    } else if (storeType === "top_offer_near_me") {
      if (nearMeLoading) {
        return <>{renderShimmer()}</>;
      } else {
        return <>{renderStoreList(nearByData?.stores)}</>;
      }
    } else {
      if (popularIsLoading) {
        return <>{renderShimmer()}</>;
      } else {
        if (popularData?.stores?.length > 0) {
          return <>{renderStoreList(popularData?.stores)}</>;
        }
      }
    }
  };

  return (
    <>
      <CustomPaperBigCard minHeight="50vh">
        <H1 text={title} textAlign="left" />
        {handleStoreList()}
      </CustomPaperBigCard>
    </>
  );
};

export default TypeWiseStore;
