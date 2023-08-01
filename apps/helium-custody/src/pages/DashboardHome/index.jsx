import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";

import Grid from "@mui/material/Grid";
import { reverse } from "named-urls";
import PropTypes from "prop-types";

import Bulletin from "../../components/Bulletin";
import Button from "../../components/Button";
import MinorNavigation from "../../components/MinorNavigation";
import routes from "../../constants/routes";
import useWethaqAPIParams from "../../hooks/useWethaqAPIParams";
import * as bulletinActionCreators from "../../redux/actionCreators/bulletins";
import * as authSelectors from "../../redux/selectors/auth";
import * as bulletinSelectors from "../../redux/selectors/bulletin";
import style from "./style.module.scss";

const PageTitle = ({ title }) => <h2 className={style.title}>{title}</h2>;

PageTitle.propTypes = {
  title: PropTypes.string.isRequired,
};

const DashboardHome = () => {
  const { t } = useTranslation(["translation", "bulletin", "administration", "kyc"]);
  const dispatch = useDispatch();
  // const navigate = useNavigate();

  const [showCreateBulletinModal, setCreateBulletinModal] = useState(false);

  // selectors
  const currentEntityGroup = useSelector(authSelectors.selectCurrentEntityGroup);
  const currentListOfACLs = useSelector(authSelectors.selectCurrentListOfAcls);
  const bulletinTypeDropdown = useSelector(bulletinSelectors.selectBulletinTypeDropdowns);
  // const bulletins = JSON.parse(JSON.stringify(useSelector(bulletinSelectors.selectBulletins))); // What the hell?
  const bulletins = useSelector(bulletinSelectors.selectBulletins);

  const filesUploaded = useSelector(bulletinSelectors.selectFilesUploaded);
  const filesUploadInProgress = useSelector(bulletinSelectors.selectFilesUploadInProgress);
  const isLoading = useSelector(bulletinSelectors.selectIsLoading);
  const currentBulletinDocument = useSelector(bulletinSelectors.selectCurrentBulletinDocument);
  console.log(
    "🚀 ~ file: index.jsx:43 ~ DashboardHome ~ currentBulletinDocument:",
    currentBulletinDocument
  );

  const currentEntityGroupID = currentEntityGroup?.id;
  const hasBulletinsManageACL = currentListOfACLs.includes("Bulletins/Manage");

  useWethaqAPIParams({
    currentGroupId: currentEntityGroupID,
  });

  useEffect(() => {
    const fetchBulletins = (payload) =>
      dispatch(bulletinActionCreators.doFetchBulletinData(payload));
    fetchBulletins();

    const fetchDropdowns = (payload) =>
      dispatch(bulletinActionCreators.doDropdownReadRequest(payload));
    fetchDropdowns({ options: ["homepageItemType", "country"] });
  }, [dispatch]);

  const handleFileUpload = (params) => {
    const { files, keyName } = params;
    const payload = {
      requestPayload: {
        originalFileName: files[0]?.name,
        contentType: "application/pdf",
      },
      file: files[0],
      keyName,
    };

    dispatch(bulletinActionCreators.doUploadBulletinFile(payload));
  };

  const createBulletin = (payload) => {
    dispatch(bulletinActionCreators.doCreateBulletin(payload));
  };

  const deleteBulletin = (payload) => {
    dispatch(bulletinActionCreators.doDeleteBulletin(payload));
  };

  const fetchBulletinDocument = (payload) => {
    dispatch(bulletinActionCreators.doFetchBulletinDocument(payload));
  };

  const updateBulletin = (payload) => {
    dispatch(bulletinActionCreators.doUpdateBulletin(payload));
  };

  const ROUTES = [
    {
      link: reverse(routes.dashboard.home),
      text: "Minor Navigation.Home.Home",
      disabled: false,
    },
  ];

  return (
    <div data-testid="dashboard-home">
      <Grid container justifyContent="space-between">
        <MinorNavigation routes={ROUTES} />
        {hasBulletinsManageACL ? (
          <div>
            <Button
              color="secondary"
              variant="contained"
              size="small"
              onClick={() => setCreateBulletinModal(true)}
            >
              {t(`New Bulletin +`)}
            </Button>
          </div>
        ) : null}
      </Grid>
      <Bulletin
        bulletins={bulletins}
        showCreateBulletinModal={showCreateBulletinModal}
        setCreateBulletinModal={setCreateBulletinModal}
        bulletinTypeDropdown={bulletinTypeDropdown}
        handleFileUpload={handleFileUpload}
        filesUploaded={filesUploaded}
        filesUploadInProgress={filesUploadInProgress}
        createBulletin={createBulletin}
        deleteBulletin={deleteBulletin}
        fetchBulletinDocument={fetchBulletinDocument}
        isLoading={isLoading}
        currentBulletinDocument={currentBulletinDocument}
        updateBulletin={updateBulletin}
      />
    </div>
  );
};

export default DashboardHome;
