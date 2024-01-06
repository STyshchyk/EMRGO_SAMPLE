import { FC } from "react";
import { useParams } from "react-router-dom";

import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";

import * as Styles from "./MessageContainer.styles";
import { IMessageContainerProps } from "./MessageContainer.types";

export const MessageContainer: FC<IMessageContainerProps> = ({}) => {
  const { id } = useParams();
  console.log(id);
  return (
    <Styles.MessageContainer>
      <Styles.Subject>Subject</Styles.Subject>
      <Styles.Messages>
        <Accordion>
          <AccordionSummary aria-controls="panel1a-content" id="panel1a-header">
            <div style={{ display: "flex", gap: "1rem" }}>
              <Avatar sx={{ width: 32, height: 32 }}>Ht</Avatar>
              <Typography>TestAsd</Typography>
            </div>
            <Typography variant="body2" component="span">
              2024.35.45 18.36
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse malesuada lacus
              ex, sit amet blandit leo lobortis eget.
            </Typography>
          </AccordionDetails>
        </Accordion>
      </Styles.Messages>
    </Styles.MessageContainer>
  );
};
