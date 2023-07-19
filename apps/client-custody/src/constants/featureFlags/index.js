/* eslint-disable import/prefer-default-export */

// FEATURE FLAG NAMING CONVENTION: [FEATURE_TOGGLE_CATEGORY_NAME]_[FEATURE_NAME]_[CREATION_DATE] (Must be upper-cased)
// ACCEPTABLE FEATURE TOGGLE CATEGORY NAMES: RELEASE, PERMISSION, OPS, EXPERIMENT
// FOR FUTURE REFERENCE: https://martinfowler.com/articles/feature-toggles.html

export default {
  bulletinBoardFeature: 'EXPERIMENT_BULLETIN_BOARD_FEATURE_15_06_2021',
  intlSecTradeSettlementWorkflow: 'PERMISSION_INTL_SEC_TRADE_SETTLEMENT_WORKFLOW_23_03_2022',
  reconciliationFeature: 'EXPERIMENT_RECONCILIATION_FEATURE_16_12_2021',
};
