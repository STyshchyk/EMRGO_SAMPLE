export const generateAccountOptions = (sourceAccounts) =>
  sourceAccounts.map((internalWethaqAccount) => ({
    value: {
      id: internalWethaqAccount.id,
      currencyId: internalWethaqAccount.currencyId,
      entityGroupId: internalWethaqAccount.entityGroupId,
    },
    label: internalWethaqAccount.accountNo,
  }));

export default { generateAccountOptions };
