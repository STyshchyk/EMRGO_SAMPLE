import { FC, useRef, useState } from "react";

import { Button, DownloadIcon, Modal, PrinterIcon, ShareIcon } from "@emrgo-frontend/shared-ui";

import * as Styles from "./ClientTermsModal.styles";
import { IClientTermsModalProps } from "./ClientTermsModal.types";

export const ClientTermsModal: FC<IClientTermsModalProps> = ({
  isOpen,
  onDownload,
  onPrint,
  onShare,
  onAccept,
  onReject,
}) => {
  const ref = useRef(null);
  const [isClosable, setClosable] = useState(false);
  const onScroll = () => {
    if (ref.current) {
      const { scrollTop, scrollHeight, clientHeight } = ref.current;
      if (scrollTop + clientHeight === scrollHeight) {
        setClosable(true);
      }
    }
  };
  return (
    <Modal isOpen={isOpen} width={678} variant="darkened">
      <Styles.Wrapper>
        <Styles.Title>Client Terms</Styles.Title>
        <Styles.Subtitle>Please accept our platform terms to proceed.</Styles.Subtitle>
        <Styles.Content
          ref={ref}
          onScroll={() => {
            onScroll();
          }}
        >
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque consequat ipsum quis
            nibh feugiat, at pretium ante feugiat. Sed auctor lacus magna, vel congue lacus lacinia
            sed. Sed sem turpis, commodo non lectus ut, aliquam dapibus urna. Etiam sit amet gravida
            nibh. Aenean ultrices convallis sem ut faucibus. Nam tristique sapien vitae nunc
            tincidunt tristique. Phasellus aliquam auctor ornare. Aenean sed auctor nunc. Quisque
            sit amet metus tristique velit imperdiet congue. Vivamus ac turpis sit amet leo tempor
            tincidunt nec non ex. Mauris eleifend quis sem id finibus. Donec ornare volutpat ligula
            ac egestas. Nullam non felis vitae nibh molestie semper. Cras ac nunc nec sem commodo
            sagittis.
          </p>

          <p>
            Sed placerat leo at est vestibulum, eu egestas ligula facilisis. Pellentesque sed tortor
            ornare, porttitor risus a, iaculis enim. Nullam nec viverra arcu, in commodo velit.
            Maecenas elementum tellus at felis laoreet mollis. Pellentesque sit amet pulvinar diam.
            Aenean vestibulum, erat a imperdiet condimentum, felis urna tristique ipsum, vitae
            efficitur elit lacus vitae ipsum. Suspendisse auctor mi dapibus sodales rhoncus. Nunc
            euismod erat ut turpis elementum, sed semper elit pellentesque. Etiam dapibus nulla vel
            aliquam consequat. Phasellus luctus lacus hendrerit dictum pretium. Integer quis maximus
            est. Sed vitae libero pharetra, ultricies tortor in, commodo urna. Donec mollis eget
            nisl eu auctor. Duis sed lobortis nulla, sed placerat urna. Sed volutpat, lectus eu
            ornare commodo, dolor risus auctor tellus, et lacinia orci nulla non ante. Pellentesque
            habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas.
          </p>

          <p>
            Curabitur blandit eros ac neque tincidunt, eget pulvinar dolor accumsan. Integer eget
            mollis lacus, sit amet bibendum risus. Maecenas semper volutpat justo et suscipit. Donec
            scelerisque bibendum hendrerit. Nulla nec sapien eu augue rhoncus dictum sit amet in
            erat. Curabitur vitae augue ac magna congue consequat. Quisque fringilla nisi ligula,
            vel placerat ex tempor vel. In hac habitasse platea dictumst. Morbi eleifend mollis
            dolor id consequat.
          </p>
          <p>
            Curabitur blandit eros ac neque tincidunt, eget pulvinar dolor accumsan. Integer eget
            mollis lacus, sit amet bibendum risus. Maecenas semper volutpat justo et suscipit. Donec
            scelerisque bibendum hendrerit. Nulla nec sapien eu augue rhoncus dictum sit amet in
            erat. Curabitur vitae augue ac magna congue consequat. Quisque fringilla nisi ligula,
            vel placerat ex tempor vel. In hac habitasse platea dictumst. Morbi eleifend mollis
            dolor id consequat.
          </p>
        </Styles.Content>

        <Styles.Footer>
          <Styles.IconButton onClick={onDownload}>
            <DownloadIcon />
          </Styles.IconButton>
          <Styles.IconButton onClick={onPrint}>
            <PrinterIcon />
          </Styles.IconButton>
          <Styles.IconButton onClick={onShare}>
            <ShareIcon />
          </Styles.IconButton>

          <Styles.Spacer />
          <Button onClick={onReject} variant="secondary" disabled={!isClosable}>
            I do not accept
          </Button>
          <Button onClick={onAccept} variant="primary" disabled={!isClosable}>
            I accept
          </Button>
        </Styles.Footer>
      </Styles.Wrapper>
    </Modal>
  );
};
