import { Skeleton, Stack, useMediaQuery, useTheme } from "@mui/material";
import { useGetRecommendProductsForHome } from "api-manage/hooks/react-query/useGetRecommendProductsForHome";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import Slider from "react-slick";
import { setYouWillLoveItems } from "redux/slices/storedData";
import "slick-carousel/slick/slick-theme.css";
import "slick-carousel/slick/slick.css";
import {
  CustomStackFullWidth,
  SliderCustom,
} from "styled-components/CustomStyles.style";
import ProductCard from "../../cards/ProductCard";
import ProductCardSimmer from "../../Shimmer/ProductCardSimmer";
import H2 from "../../typographies/H2";
import { HomeComponentsWrapper } from "../HomePageComponents";
import { loveItemSettings } from "./loveItemSettings";
import Menus from "./Menus";

const LoveItem = (props) => {
  const [menu, setMenu] = useState([]);
  const [selectedMenuIndex, setSelectedMenuIndex] = useState(0);
  const [filteredData, setFilteredData] = useState([]);
  const [reRender, setReRender] = useState(false);
  const { t } = useTranslation();
  const theme = useTheme();
  const isSmall = useMediaQuery(theme.breakpoints.down("md"));
  const params = {
    offset: 1,
    limit: 15,
  };
  const { data, refetch, isLoading, isFetched } =
    useGetRecommendProductsForHome(params);
  useEffect(() => {
    refetch();
  }, []);
  const { youWillLoveItems } = useSelector((state) => state.storedData);
  const dispatch = useDispatch();
  const getCategoryIds = () => {
    const categoryIds = [];
    if (youWillLoveItems && youWillLoveItems?.products) {
      youWillLoveItems?.products?.forEach((product) => {
        if (product.category_ids) {
          product?.category_ids?.forEach((categoryId) => {
            categoryIds?.push(categoryId);
          });
        }
      });
    }
    return categoryIds;
  };
  const uniqueCategories = [
    ...new Set(getCategoryIds()?.map((item) => JSON.stringify(item))),
  ].map(JSON.parse);

  useEffect(() => {
    if (youWillLoveItems?.products?.length === 0) {
      refetch();
    }
  }, [youWillLoveItems]);

  useEffect(() => {
    if (data) {
      dispatch(setYouWillLoveItems(data));
    }
  }, [data]);
  useEffect(() => {
    if (data?.total_size > 0) {
      setMenu(["Recommended", ...uniqueCategories?.map((item) => item.name)]);
      setFilteredData(setYouWillLoveItems.products);
    }
  }, [setYouWillLoveItems.products]);

  useEffect(() => {
    if (selectedMenuIndex == 0) {
      setFilteredData(youWillLoveItems?.products);
      setReRender(true);
    } else {
      const categoryWiseData = youWillLoveItems?.products?.filter((item) => {
        return item?.category_ids?.some((categoryId) => {
          return uniqueCategories[selectedMenuIndex - 1]?.id === categoryId?.id;
        });
      });

      setFilteredData(categoryWiseData);
      setReRender(true);
    }
  }, [selectedMenuIndex]);

  return (
    <>
      {!isFetched || data?.items?.length > 0 ? (<HomeComponentsWrapper>
        <CustomStackFullWidth
            alignItems="center"
            justyfyContent="center"
            mt="30px"
            spacing={1}
        >
          <CustomStackFullWidth
              alignItems="center"
              justifyContent="space-between"
              direction="row"
          >
            {!isFetched ? (
                <Skeleton variant="text" width="110px" />
            ) : (
                <>
                  {data?.items?.length > 0 && (
                      <H2 text="Item That You’ll Love" component="h2" />
                  )}
                </>
            )}
            <Stack maxWidth="960px" width={isSmall ? "initial" : "100%"}>
              {data?.items?.length ? (
                  <>
                    {menu?.length > 0 && (
                        <Menus
                            selectedMenuIndex={selectedMenuIndex}
                            setSelectedMenuIndex={setSelectedMenuIndex}
                            menus={menu}
                        />
                    )}
                  </>
              ) : null}
            </Stack>
          </CustomStackFullWidth>
          <CustomStackFullWidth>
            {!isFetched ? (
                <SliderCustom nopadding="true">
                  <Slider {...loveItemSettings}>
                    {[...Array(5)].map((_, index) => {
                      return <ProductCardSimmer key={index} />;
                    })}
                  </Slider>
                </SliderCustom>
            ) : (
                <SliderCustom nopadding="true">
                  <Slider {...loveItemSettings}>
                    {data?.items?.map((item, index) => {
                      return (
                          <ProductCard
                              key={item?.id}
                              cardType="vertical-type"
                              loveItem="true"
                              cardFor="vertical"
                              item={item}
                          />
                      );
                    })}
                  </Slider>
                </SliderCustom>
            )}
          </CustomStackFullWidth>
        </CustomStackFullWidth>
      </HomeComponentsWrapper>) : null}
    </>
  );
};

LoveItem.propTypes = {};

export default LoveItem;
