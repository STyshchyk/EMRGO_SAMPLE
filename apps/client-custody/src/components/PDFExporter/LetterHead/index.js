import { Text, View, Image, Link } from '@react-pdf/renderer';
import styles from './style';

const LetterHead = () => (
  <View>
    <View style={styles.content}>
      <View style={[styles.block_half]}>
        <View style={[styles.logo]}>
          <View style={[styles.logo_wrapper]}>
            <Image style={styles.logo_W} src="/export/emrgo_logo.png" />
          </View>
        </View>
      </View>
      {/* <View style={[styles.block_half]}>
        <View style={styles.details_wrapper}>
          <Text style={styles.letterhead_text}>Dubai, Saudi Arabia, London</Text>
          <Image style={styles.letterhead_icon} src="/export/marker.png" />
        </View>
        <View style={styles.details_wrapper}>
          <Link style={styles.letterhead_text} src="https://wethaq.capital/">
            https://wethaq.capital/
          </Link>
          <Image style={styles.letterhead_icon} src="/export/globe.png" />
        </View>
        <View style={styles.details_wrapper}>
          <Link style={styles.letterhead_text} src="mailto:info@wethaq.capital">
            info@wethaq.capital
          </Link>
          <Image style={styles.letterhead_icon} src="/export/email.png" />
        </View>
        <View style={styles.details_wrapper}>
          <Link style={styles.letterhead_text} src="https://twitter.com/wethaqcapital/">
            https://twitter.com/wethaqcapital/
          </Link>
          <Image style={styles.letterhead_icon} src="/export/twitter.png" />
        </View>
      </View> */}
    </View>
    <View style={styles.divider_wrapper}>
      <View style={styles.divider}></View>
    </View>
  </View>
);

export default LetterHead;
