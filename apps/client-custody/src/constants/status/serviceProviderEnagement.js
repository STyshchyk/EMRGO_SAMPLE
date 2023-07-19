export default {
  Requested: 1,
  Uploaded: 2,
  Generating: 3,
  Sent: 4,
  Signed: 5,
  CounterSigned: 6,
};

export const statusTextMap = {
  Requested: 'Engagement Requested',
  Uploaded: 'Engagement Letter Uploaded',
  Generating: 'Generating Letter for Signature',
  Sent: 'Sent for Signature',
  Signed: 'Signed',
  CounterSigned: 'Engaged',
};
