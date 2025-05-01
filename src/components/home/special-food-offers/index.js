import { alpha, Button, Skeleton } from "@mui/material";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import Slider from "react-slick";
import useGetDiscountedItems from "../../../api-manage/hooks/react-query/product-details/useGetDiscountedItems";
import { getLanguage } from "helper-functions/getLanguage";
import { getModuleId } from "helper-functions/getModuleId";
import {
  CustomBoxFullWidth,
  CustomStackFullWidth,
} from "styled-components/CustomStyles.style";
import ProductCard from "../../cards/ProductCard";
import { RTL } from "../../rtl";
import SpecialOfferCardShimmer from "../../Shimmer/SpecialOfferCardSimmer";
import H2 from "../../typographies/H2";
import { NextFood, PrevFood } from "../best-reviewed-items/SliderSettings";
import { HomeComponentsWrapper } from "../HomePageComponents";

const SpecialFoodOffers = ({ title }) => {
  const { t } = useTranslation();
  const params = {
    offset: 1,
    limit: 15,
  };

  const { data, refetch, isLoading, isFetching } =
    useGetDiscountedItems(params);
  const [isHover, setIsHover] = useState(false);
  const lanDirection = getLanguage() ? getLanguage() : "ltr";

  useEffect(() => {
    refetch();
  }, []);

  const settings = {
    dots: false,
    infinite: data?.products?.length > 5,
    slidesToShow: isLoading ? 1 : 5,
    cssEase: "ease-in-out",
    autoplay: true,
    speed: 800,
    autoplaySpeed: 4000,
    variableHeight: true,
    prevArrow: isHover && <PrevFood displayNoneOnMobile />,
    nextArrow: isHover && <NextFood displayNoneOnMobile />,
    responsive: [
      {
        breakpoint: 1200,
        settings: {
          slidesToShow: 4,
          slidesToScroll: 1,
          infinite: data?.products?.length > 4,
        },
      },
      {
        breakpoint: 992,
        settings: {
          slidesToShow: 3.5,
          infinite: data?.products?.length > 3,
        },
      },
      {
        breakpoint: 821,
        settings: {
          slidesToShow: 3.2,
          infinite: data?.products?.length > 3,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 3,
          infinite: data?.products?.length > 3,
        },
      },
      {
        breakpoint: 576,
        settings: {
          slidesToShow: 2,
          infinite: data?.products?.length > 2,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1.8,
          infinite: data?.products?.length > 1,
        },
      },
      {
        breakpoint: 360,
        settings: {
          slidesToShow: 1.5,
          infinite: data?.products?.length > 1,
        },
      },
    ],
  };

  return (
    <>
      {data?.products?.length > 0 && (
        <HomeComponentsWrapper
          onMouseEnter={() => setIsHover(true)}
          onMouseLeave={() => setIsHover(false)}
          sx={{
            cursor: "pointer",
            ".slick-slide": {
              padding: "0 5px",
            },
          }}
        >
          <CustomStackFullWidth
            alignItems="center"
            justyfyContent="center"
            mb="10px"
            spacing={1}
            onMouseEnter={() => setIsHover(true)}
            onMouseLeave={() => setIsHover(false)}
          >
            <CustomStackFullWidth
              alignItems="center"
              justifyContent="space-between"
              direction="row"
            >
              {isFetching ? (
                <Skeleton variant="text" width="110px" />
              ) : (
                <H2 text={title ? title : t("Special Offer")} component="h2" />
              )}
              {isFetching ? (
                <Skeleton width="100px" variant="80px" />
              ) : (
                <Link
                  href={{
                    pathname: "/home",
                    query: {
                      search: "special-offer",
                      module_id: getModuleId(),
                      data_type: "discounted",
                    },
                  }}
                >
                  <Button
                    variant="text"
                    sx={{
                      transition: "all ease 0.5s",
                      textTransform: "capitalize",
                      "&:hover": {
                        letterSpacing: "0.03em",
                      },
                    }}
                  >
                    {t("View all")}
                  </Button>
                </Link>
              )}
            </CustomStackFullWidth>
            <RTL direction={lanDirection}>
              <CustomBoxFullWidth
                sx={{
                  paddingTop: { xs: "0px", sm: "0px" },
                  padding: { xs: "10px", md: "20px" },
                  backgroundColor: (theme) =>
                    alpha(theme.palette.neutral[400], 0.1),
                }}
              >
                <>
                  {isFetching ? (
                    <Slider {...settings}>
                      {[...Array(5)].map((item, index) => {
                        return <SpecialOfferCardShimmer key={index} />;
                      })}
                    </Slider>
                  ) : (
                    <Slider {...settings}>
                      {data?.products?.map((item, index) => {
                        return (
                          <ProductCard
                            key={index}
                            item={item}
                            specialCard="true"
                          />
                        );
                      })}
                    </Slider>
                  )}
                </>
              </CustomBoxFullWidth>
            </RTL>
          </CustomStackFullWidth>
        </HomeComponentsWrapper>
      )}
    </>
  );
};

export default SpecialFoodOffers;
