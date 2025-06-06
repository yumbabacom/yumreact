import { Grid, Typography, alpha, useTheme, Paper } from "@mui/material";
import LinearProgress, {
	linearProgressClasses,
} from "@mui/material/LinearProgress";
import { styled } from "@mui/material/styles";

import { Box, Stack } from "@mui/system";
import { t } from "i18next";
import React, { useEffect, useState } from "react";

import SimpleBar from "simplebar-react";
import "simplebar/dist/simplebar.min.css";
import useGetStoreReviews from "api-manage/hooks/react-query/review/useGetStoreReviews";
import {
	getDateFormat,
	getNumberWithConvertedDecimalPoint,
} from "utils/CustomFunctions";
import CustomRatings from "components/search/CustomRatings";

import CustomImageContainer from "components/CustomImageContainer";
import DotSpin from "components/DotSpin";
import { CustomStackFullWidth } from "styled-components/CustomStyles.style";
import { ReadMore } from "components/store-details/ReadMore";

import { useRouter } from "next/router";

import { useWishListDelete } from "api-manage/hooks/react-query/wish-list/useWishListDelete";
import useGetProviderReviews from "../../rental-api-manage/hooks/react-query/provider/useGetProviderReview";

const BorderLinearProgress = styled(LinearProgress)(({ theme }) => ({
	height: 8,
	borderRadius: 5,
	[`&.${linearProgressClasses.colorPrimary}`]: {
		backgroundColor:
			theme.palette.grey[theme.palette.mode === "light" ? 200 : 800],
	},
	[`& .${linearProgressClasses.bar}`]: {
		borderRadius: 5,
		backgroundColor: theme.palette.primary.main,
	},
}));
export const StyledSimpleBar = styled(SimpleBar)(({ theme }) => ({
	maxHeight: "60vh",
	"& .simplebar-track.simplebar-vertical": {
		right: "-20px !important",
	},
}));
const RentalCarReviewModal = ({
	product_avg_rating,
	rating_count,
	reviews_comments_count,
	id,
	restaurantDetails,
	configData,
}) => {
	const [review_count, setReview_Count] = useState({});
	const theme = useTheme();
	const router = useRouter();

	const { data, refetch, isLoading } = useGetProviderReviews(id);


	useEffect(() => {
		refetch();
	}, []);

	const getPercentOfNumber = (percentRate) => {
		const total = restaurantDetails?.ratings.reduce(
			(sum, current) => sum + current,
			0
		);
		return percentRate ? ((percentRate / total) * 100).toFixed(1) : 0;
	};

	return (
		<Paper
			sx={{
				position: "relative",
				width: { xs: "350px", sm: "450px", md: "750px" },
				p: "15px",
			}}
		>
			<CustomStackFullWidth
				sx={{
					padding: {
						xs: ".5rem",
						sm: "1rem",
						md: "1.2rem",
					},
				}}
			>
				<StyledSimpleBar>
					<CustomStackFullWidth
						backgroundColor={alpha(theme.palette.neutral[400], 0.1)}
						padding="2rem"
						borderRadius="8px"
						color={theme.palette.text.primary}
						// margin=".5rem"
					>
						<Grid container gap={{ xs: 2, md: 0 }}>
							<Grid item xs={12} sm={12} md={6}>
								<Stack>
									<Typography
										component="span"
										fontSize="50px"
										color={theme.palette.primary.main}
										fontWeight="500"
									>
										{getNumberWithConvertedDecimalPoint(
											product_avg_rating,
											1
										)}
										<Typography
											component="span"
											fontSize="35px"
											color={theme.palette.primary.deep}
											fontWeight="500"
										>
											/5
										</Typography>
									</Typography>
									<CustomRatings
										readOnly
										ratingValue={product_avg_rating}
									/>
									<Stack
										direction="row"
										spacing={1}
										marginTop=".8rem"
									>
										<Typography
											fontSize="13px"
											color={theme.palette.neutral[600]}
											backgroundColor={alpha(
												theme.palette.neutral[500],
												0.2
											)}
											padding="2px 6px"
											borderRadius="4px"
										>
											{rating_count} {t("Ratings")}
										</Typography>
										<Typography
											fontSize="13px"
											color={theme.palette.neutral[600]}
											backgroundColor={alpha(
												theme.palette.neutral[500],
												0.2
											)}
											padding="2px 6px"
											borderRadius="4px"
										>
											{reviews_comments_count}{" "}
											{t("Reviews")}
										</Typography>
									</Stack>
								</Stack>
							</Grid>
							<Grid item xs={12} sm={12} md={6}>
								<Stack gap={1.5}>
									<Stack
										direction="row"
										alignItems="center"
										spacing={1}
									>
										<Typography fontSize="14px">
											5
										</Typography>
										<Box flexGrow={1}>
											<BorderLinearProgress
												variant="determinate"
												value={getPercentOfNumber(
													restaurantDetails
														?.ratings[0]
												)}
											/>
										</Box>
										<Typography
											fontSize="14px"
											color={theme.palette.neutral[600]}
										>
											{getPercentOfNumber(
												restaurantDetails?.ratings[0]
											)}
											%
										</Typography>
									</Stack>
									<Stack
										direction="row"
										alignItems="center"
										spacing={1}
									>
										<Typography fontSize="14px">
											4
										</Typography>
										<Box flexGrow={1}>
											<BorderLinearProgress
												variant="determinate"
												value={getPercentOfNumber(
													restaurantDetails
														?.ratings[1]
												)}
											/>
										</Box>
										<Typography
											fontSize="14px"
											color={theme.palette.neutral[600]}
										>
											{getPercentOfNumber(
												restaurantDetails?.ratings[1]
											)}
											%
										</Typography>
									</Stack>
									<Stack
										direction="row"
										alignItems="center"
										spacing={1}
									>
										<Typography fontSize="14px">
											3
										</Typography>
										<Box flexGrow={1}>
											<BorderLinearProgress
												variant="determinate"
												value={getPercentOfNumber(
													restaurantDetails
														?.ratings[2]
												)}
											/>
										</Box>
										<Typography
											fontSize="14px"
											color={theme.palette.neutral[600]}
										>
											{getPercentOfNumber(
												restaurantDetails?.ratings[2]
											)}
											%
										</Typography>
									</Stack>
									<Stack
										direction="row"
										alignItems="center"
										spacing={1}
									>
										<Typography fontSize="14px">
											2
										</Typography>
										<Box flexGrow={1}>
											<BorderLinearProgress
												variant="determinate"
												value={getPercentOfNumber(
													restaurantDetails
														?.ratings[3]
												)}
											/>
										</Box>
										<Typography
											fontSize="14px"
											color={theme.palette.neutral[600]}
										>
											{getPercentOfNumber(
												restaurantDetails?.ratings[3]
											)}
											%
										</Typography>
									</Stack>
									<Stack
										direction="row"
										alignItems="center"
										spacing={1}
									>
										<Typography fontSize="14px">
											1
										</Typography>
										<Box flexGrow={1}>
											<BorderLinearProgress
												variant="determinate"
												value={getPercentOfNumber(
													restaurantDetails
														?.ratings[4]
												)}
											/>
										</Box>
										<Typography
											fontSize="14px"
											color={theme.palette.neutral[600]}
										>
											{getPercentOfNumber(
												restaurantDetails?.ratings[4]
											)}
											%
										</Typography>
									</Stack>
								</Stack>
							</Grid>
						</Grid>
					</CustomStackFullWidth>

					{data?.reviews &&
						data?.reviews?.map((review) => (
							<Grid
								container
								key={review?.id}
								padding="10px"
								spacing={2}
								justifyContent="space-between"
							>
								<Grid item xs={8} sm={8} md={9.5}>
									<Stack gap={0.4} justifyContent="flex-end">
										<Typography
											fontSize="14px"
											fontWeight="500"
											color={theme.palette.text.primary}
										>
											{review?.customer_name}
										</Typography>
										<CustomRatings
											readOnly
											ratingValue={review.rating}
											fontSize={"1.2rem"}
										/>
										<Typography
											fontSize="12px"
											fontWeight="400"
											color="text.secondary"
										>
											{getDateFormat(review.created_at)}
										</Typography>
										<ReadMore
											color={theme.palette.neutral[600]}
											limits="160"
										>
											{review?.comment}
										</ReadMore>
									</Stack>
								</Grid>
								<Grid item xs={4} sm={4} md={2.5}>
									<Stack
										justifyContent="center"
										spacing={0.5}
										sx={{ cursor: "pointer" }}
										onClick={() =>
											handleClick(review?.item)
										}
									>
										<Stack
											padding="7px"
											borderRadius="8px"
											sx={{
												border: ".8px solid",
												borderColor: (theme) =>
													theme.palette.neutral[300],
											}}
										>
											<CustomImageContainer
												src={review.vehicle_image_full_url												}
												objectFit="cover"
												height="74px"
												borderRadius="8px"
											/>
										</Stack>
										<Typography
											textAlign="center"
											color={theme.palette.neutral[600]}
											fontSize="10px"
											fontWeight="400"
										>
											{review.item_name}
										</Typography>
									</Stack>
								</Grid>
								{review.reply ? (
									<Grid item xs={12}>
										<Box
											sx={{
												background:
													theme.palette.neutral[300],
												padding: "13px",
												borderRadius: "9px",
											}}
										>
											<Stack
												direction="row"
												justifyContent="space-between"
												alignItems="center"
											>
												<Typography
													fontSize="12px"
													fontWeight="500"
													color={
														theme.palette.text
															.primary
													}
												>
													{restaurantDetails?.name}
												</Typography>
												<Typography
													fontSize="10px"
													fontWeight="400"
													color="text.secondary"
												>
													{getDateFormat(
														review.updated_at
													)}
												</Typography>
											</Stack>
											<Stack mt="5px">
												<ReadMore
													color={
														theme.palette.text
															.secondary
													}
													limits="160"
												>
													{review.reply}
												</ReadMore>
											</Stack>
										</Box>
									</Grid>
								) : (
									""
								)}
							</Grid>
						))}
					{isLoading && (
						<Stack marginTop="2rem">
							<DotSpin />
						</Stack>
					)}
				</StyledSimpleBar>
			</CustomStackFullWidth>
		</Paper>
	);
};

export default RentalCarReviewModal;