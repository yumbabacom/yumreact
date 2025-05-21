import { Box, NoSsr, Stack, useMediaQuery } from "@mui/material";
import React, { useState } from "react";
import { CustomStackForLoaction } from "../NavBar.style";
import ThemeSwitches from "./ThemeSwitches";
import AddressReselect from "./address-reselect/AddressReselect";
import CustomLanguage from "./language/CustomLanguage";

import { useSelector } from "react-redux";
import CallToAdmin from "../../CallToAdmin";
import CustomContainer from "../../container";
import LogoSide from "../../logo/LogoSide";
import DrawerMenu from "./drawer-menu/DrawerMenu";

const TopNavBar = () => {
	const { configData, countryCode, language } = useSelector(
		(state) => state.configData
	);
	const [openDrawer, setOpenDrawer] = useState(false);
	let location = undefined;
	if (typeof window !== "undefined") {
		location = localStorage.getItem("location");
	}
	const isSmall = useMediaQuery("(max-width:1180px)");

	return (
		<>
			<NoSsr>
				<Box
					sx={{
						width: "100%",
						background: (theme) => theme.palette.neutral[100],
					}}
				>
					{!isSmall && (
						<CustomContainer>
							<Box
								sx={{
									display: isSmall ? "none" : "block",
									borderRadius: "0",
								}}
							>
								<Stack
									pt=".4rem"
									pb=".4rem"
									width="100%"
									height="30px"
									direction="row"
									justifyContent="space-between"
								>
									<CustomStackForLoaction direction="row">
										{location && (
											<AddressReselect
												setOpenDrawer={setOpenDrawer}
												location={location}
											/>
										)}
									</CustomStackForLoaction>
									<Stack
										direction="row"
										spacing={2}
										justifyContent="end"
										alignItems="center"
									>
										{/* New Buttons Start */}
										<Box component="a" href="#" sx={{ textDecoration: 'none' }}>
											<Box
												sx={{
													px: 2,
													py: 0.5,
													borderRadius: 1,
													bgcolor: 'primary.main',
													color: 'white',
													fontWeight: 500,
													fontSize: '14px',
													mr: 1,
													cursor: 'pointer',
													'&:hover': { bgcolor: 'primary.dark' },
												}}
											>
												Become a Vendor Owner
											</Box>
										</Box>
										<Box component="a" href="https://yumbaba.com/vendor" target="_blank" rel="noopener" sx={{ textDecoration: 'none' }}>
											<Box
												sx={{
													px: 2,
													py: 0.5,
													borderRadius: 1,
													bgcolor: 'secondary.main',
													color: 'white',
													fontWeight: 500,
													fontSize: '14px',
													mr: 1,
													cursor: 'pointer',
													'&:hover': { bgcolor: 'secondary.dark' },
												}}
											>
												Login Vendor
											</Box>
										</Box>
										<Box component="a" href="#" sx={{ textDecoration: 'none' }}>
											<Box
												sx={{
													px: 2,
													py: 0.5,
													borderRadius: 1,
													bgcolor: 'success.main',
													color: 'white',
													fontWeight: 500,
													fontSize: '14px',
													mr: 1,
													cursor: 'pointer',
													'&:hover': { bgcolor: 'success.dark' },
												}}
											>
												Become a Delivery Man
											</Box>
										</Box>
										{/* New Buttons End */}
										<ThemeSwitches />
										{configData?.phone && (<CallToAdmin configData={configData}/>)}
										<CustomLanguage
											countryCode={countryCode}
											language={language}
										/>
									</Stack>
								</Stack>
							</Box>
							{!location && (
								<Box
									sx={{
										display: {
											xs: "flex",
											md: "none",
											alignItems: "center",
											gap: "10px",
											flexDirection: "row",
											justifyContent: " space-between ",
										},
										flexGrow: 1,
									}}
								>
									<Stack
										alignItems="center"
										justifyContent="center"
									>
										<LogoSide
											width="126px"
											configData={configData}
										/>
									</Stack>
									<Stack>
										<DrawerMenu
											openDrawer={openDrawer}
											setOpenDrawer={setOpenDrawer}
										/>
									</Stack>
								</Box>
							)}
						</CustomContainer>
					)}
				</Box>
			</NoSsr>
		</>
	);
};

export default TopNavBar;
