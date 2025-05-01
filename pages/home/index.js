import CssBaseline from "@mui/material/CssBaseline";
import Router from "next/router";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setConfigData } from "redux/slices/configData";
import MainLayout from "../../src/components/layout/MainLayout";
import ModuleWiseLayout from "../../src/components/module-wise-layout";
import ZoneGuard from "../../src/components/route-guard/ZoneGuard";
import SEO from "../../src/components/seo";
import { useGetConfigData } from "../../src/api-manage/hooks/useGetConfigData";
import useGetLandingPage from "../../src/api-manage/hooks/react-query/useGetLandingPage";
import { setLandingPageData } from "../../src/redux/slices/configData";

const Home = () => {
	const dispatch = useDispatch();
	const { data: dataConfig, refetch: configRefetch } = useGetConfigData();
	const { data: dataLanding, refetch: refetchLanding } = useGetLandingPage();

	const { landingPageData, configData } = useSelector(
		(state) => state.configData
	);

	useEffect(() => {
		if (!configData) {
			configRefetch();
		}
	}, [configData]);

	useEffect(() => {
		if (!landingPageData) {
			refetchLanding();
		}
	}, [landingPageData]);

	useEffect(() => {
		if (dataLanding) {
			dispatch(setLandingPageData(dataLanding));
		}
	}, [dataLanding]);
	useEffect(() => {
		if (dataConfig) {
			if (dataConfig.length === 0) {
				Router.push("/404");
			} else if (dataConfig?.maintenance_mode) {
				Router.push("/maintainance");
			} else {
				dispatch(setConfigData(dataConfig));
			}
		}
	}, [dataConfig]);
	useEffect(() => {
		if (dataConfig) {
			dispatch(setConfigData(dataConfig));
		}
	}, [dataConfig]);

	return (
		<>
			<CssBaseline />
			{configData && (
				<SEO
					title="Home"
					image={configData?.fav_icon_full_url}
					businessName={configData?.business_name}
					configData={configData}
				/>
			)}

			<MainLayout
				configData={configData}
				landingPageData={landingPageData}
			>
				<ModuleWiseLayout
					configData={configData}
					landingPageData={landingPageData}
				/>
			</MainLayout>
		</>
	);
};

export default Home;

Home.getLayout = (page) => <ZoneGuard>{page}</ZoneGuard>;
