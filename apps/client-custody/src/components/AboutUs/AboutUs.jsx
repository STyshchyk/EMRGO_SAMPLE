import CloseIcon from "@mui/icons-material/Close";

import * as Styles from "./AboutUs.styles";

const AboutUs = ({ onClose }) => (
  <Styles.Container>
    <Styles.Header>
      <Styles.Title>About Custody</Styles.Title>
      <Styles.CloseButton onClick={onClose}>
        <CloseIcon sx={{ color: "white" }} />
      </Styles.CloseButton>
    </Styles.Header>
    <Styles.Content>
      <Styles.Text>
        We are a capital markets group focused on the emerging private markets. With our deep market
        knowledge and fintech innovation, we unlock opportunities missed by the incumbents.
      </Styles.Text>
      <Styles.Features>
        <Styles.Feature>
          <Styles.FeatureIcon></Styles.FeatureIcon>
          Discover opportunities
        </Styles.Feature>
        <Styles.Feature>
          <Styles.FeatureIcon></Styles.FeatureIcon>
          Communicate with our sales team
        </Styles.Feature>
        <Styles.Feature>
          <Styles.FeatureIcon></Styles.FeatureIcon>
          Execute trades
        </Styles.Feature>
        <Styles.Feature>
          <Styles.FeatureIcon></Styles.FeatureIcon>
          Custody your securities
        </Styles.Feature>
      </Styles.Features>
      <Styles.Text>
        We are transparent with our fees. We only charge a placement fee to the Issuers, we do not
        charge you the Investor. We only charge you a very competitive Custody fee upon Execution.
      </Styles.Text>
    </Styles.Content>
  </Styles.Container>
);
export default AboutUs;
