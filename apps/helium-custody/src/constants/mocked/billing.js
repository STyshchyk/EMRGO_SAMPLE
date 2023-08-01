export const rateCartStatuses = [
  {
    name: "Amended - Approval Requried",
    nameAr: "Amended - Approval Requried",
    id: "0a9a809c-9c8b-44f7-94bc-592284526291",
    key: "approve",
  },
  { name: "Active", nameAr: "Active", id: "d45e0b7f-7a45-4b0f-aada-9f4a77686617", key: "active" },
  {
    name: "Superseded",
    nameAr: "Superseded",
    id: "42c3a0ad-f621-42d7-830c-5395507d99f9",
    key: "superseded",
  },
];

export const billingPeriods = [
  { name: "None", nameAr: "None", id: "" },
  { name: "Monthly", nameAr: "Monthly", id: "2e0dd992-3b2f-4b64-bace-576c774f511b" },
];

export const rateCards = [
  {
    start_date: "2021-07-16T00:00:00Z",
    end_date: {
      Time: "2023-10-11T00:00:00Z",
      Valid: true,
    },
    version: 0,
    created_at: "2023-01-06T08:16:03.607507Z",
    updated_at: "2023-01-06T08:16:03.607507Z",
    created_by: "creator",
    approved_by: {
      String: "",
      Valid: false,
    },
    min_charge: "827847",
    billing_period_id: "de42f53f-cc65-43c8-8d76-ccdbe01b0c6b",
    id: "43eff995-25c4-4451-820e-59155047fbeb",
    status_id: "d45e0b7f-7a45-4b0f-aada-9f4a77686617",
    updated_by: {
      String: "",
      Valid: false,
    },
    original_id: "00000000-0000-0000-0000-000000000000",
    entity_id: "a567b262-3e56-4912-b025-2bafc4983d3c",
    status: {
      String: "Active",
      Valid: true,
    },
    billing_period: {
      String: "Monthly",
      Valid: true,
    },
    entity: {
      String: "Investor A",
      Valid: true,
    },
  },
  {
    start_date: "2021-07-16T00:00:00Z",
    end_date: {
      Time: "2023-10-11T00:00:00Z",
      Valid: true,
    },
    version: 0,
    created_at: "2023-01-06T08:16:03.607507Z",
    updated_at: "2023-01-06T08:16:03.607507Z",
    created_by: "creator",
    approved_by: {
      String: "",
      Valid: false,
    },
    min_charge: "100",
    billing_period_id: "de42f53f-cc65-43c8-8d76-ccdbe01b0c6b",
    id: "43eff995-25c4-4451-820e-59155047fbeb",
    status_id: "42c3a0ad-f621-42d7-830c-5395507d99f9",
    updated_by: {
      String: "",
      Valid: false,
    },
    original_id: "00000000-0000-0000-0000-000000000000",
    entity_id: "a567b262-3e56-4912-b025-2bafc4983d3c",
    status: {
      String: "Superseded",
      Valid: true,
    },
    billing_period: {
      String: "Monthly",
      Valid: true,
    },
    entity: {
      String: "Investor A",
      Valid: true,
    },
  },
  {
    start_date: "2021-07-16T00:00:00Z",
    end_date: {
      Time: "2023-10-11T00:00:00Z",
      Valid: true,
    },
    version: 0,
    created_at: "2023-01-06T08:16:03.607507Z",
    updated_at: "2023-01-06T08:16:03.607507Z",
    created_by: "creator",
    approved_by: {
      String: "",
      Valid: false,
    },
    min_charge: "100",
    billing_period_id: "de42f53f-cc65-43c8-8d76-ccdbe01b0c6b",
    id: "43eff995-25c4-4451-820e-59155047fbeb",
    status_id: "0a9a809c-9c8b-44f7-94bc-592284526291",
    updated_by: {
      String: "",
      Valid: false,
    },
    original_id: "00000000-0000-0000-0000-000000000000",
    entity_id: "5a881a40-3ea3-436f-b6a9-70ff3888a1fb",
    status: {
      String: "Amended - Approval Requried",
      Valid: true,
    },
    billing_period: {
      String: "Monthly",
      Valid: true,
    },
    entity: {
      String: "Investor B",
      Valid: true,
    },
  },
];

export const trxCharge = [
  {
    charge: "0.25",
    id: "e49caaea-ca69-49c9-9ef5-9ec6492b029e",
    transaction_type_id: "5d84e01d-a5e4-413b-88d7-5490f6066a45",
    client_rate_card_id: "43eff995-25c4-4451-820e-59155047fbeb",
    security_country_icsd_id: "00000000-0000-0000-0000-000000000000",
    asset_type_id: "523e3559-5904-479c-beff-2be1ebf745b9",
    is_active: true,
    updated_at: "2023-01-06T08:49:52.241917Z",
    created_at: "2023-01-06T08:49:52.241917Z",
    transaction_type_name: {
      String: "FX",
      Valid: true,
    },
    security_type_name: {
      String: "USD",
      Valid: true,
    },
    security_country_icsd_name: {
      String: "Nil",
      Valid: true,
    },
  },
  {
    charge: "0.75",
    id: "88f3da82-07c1-4567-b94a-0c5b136ea9ad",
    transaction_type_id: "25d8dc5b-527f-410a-9433-d58dd43efd47",
    client_rate_card_id: "43eff995-25c4-4451-820e-59155047fbeb",
    security_country_icsd_id: "70360578-a553-49fe-a078-a2b8911e36dc",
    asset_type_id: "e4878493-ed91-4661-9741-f402e97b4586",
    is_active: true,
    updated_at: "2023-01-06T08:50:00.908613Z",
    created_at: "2023-01-06T08:50:00.908613Z",
    transaction_type_name: {
      String: "Settlement",
      Valid: true,
    },
    security_type_name: {
      String: "Fixed Income",
      Valid: true,
    },
    security_country_icsd_name: {
      String: "United States of America",
      Valid: true,
    },
  },
];

export const mockedInvoices = [
  {
    reference: "invoice ref",
    date: "2023-02-08T09:59:13.200979Z",
    amount: "0",
    created_at: "2023-02-08T09:59:13.200979Z",
    updated_at: "2023-02-08T09:59:13.200979Z",
    created_by: "xxx",
    approved_by: {
      String: "",
      Valid: false,
    },
    entity_id: "f8a20f8f-59ee-4af1-b991-2b1c9ebc805c",
    id: "92d5a2c6-7378-42e3-addb-faf8dc36142b",
    client_rate_card_id: "f0a66395-4579-4466-9fe9-6eb7314d4435",
    payment_status_id: "5a53c225-823c-4cd5-9fce-a75aaa1cf77d",
    status_id: "bfe4d55a-04b7-47de-b3dc-bd3307a9fb84",
    min_charge: "10",
    invoice_status: {
      String: "Open",
      Valid: true,
    },
    payment_status: {
      String: "Outstanding",
      Valid: true,
    },
  },
  {
    reference: "invoice ref",
    date: "2023-02-08T09:59:13.200979Z",
    amount: "0",
    created_at: "2023-02-08T09:59:13.200979Z",
    updated_at: "2023-02-08T09:59:13.200979Z",
    created_by: "xxx",
    approved_by: {
      String: "",
      Valid: false,
    },
    entity_id: "f8a20f8f-59ee-4af1-b991-2b1c9ebc805c",
    id: "92d5a2c6-7378-42e3-addb-faf8dc36142c",
    client_rate_card_id: "f0a66395-4579-4466-9fe9-6eb7314d4435",
    payment_status_id: "5a53c225-823c-4cd5-9fce-a75aaa1cf77d",
    status_id: "cff68f45-cc1f-490d-9d33-a163ea573fd2",
    min_charge: "10",
    invoice_status: {
      String: "Closed",
      Valid: true,
    },
    payment_status: {
      String: "Outstanding",
      Valid: true,
    },
  },
  {
    reference: "invoice ref",
    date: "2023-02-08T09:59:13.200979Z",
    amount: "0",
    created_at: "2023-02-08T09:59:13.200979Z",
    updated_at: "2023-02-08T09:59:13.200979Z",
    created_by: "xxx",
    approved_by: {
      String: "",
      Valid: false,
    },
    entity_id: "f8a20f8f-59ee-4af1-b991-2b1c9ebc805c",
    id: "92d5a2c6-7378-42e3-addb-faf8dc36142d",
    client_rate_card_id: "f0a66395-4579-4466-9fe9-6eb7314d4435",
    payment_status_id: "5a53c225-823c-4cd5-9fce-a75aaa1cf77d",
    status_id: "50075da9-fbbf-4dfd-b1fb-3714b5b57580",
    min_charge: "10",
    invoice_status: {
      String: "Amended - Approval Required",
      Valid: true,
    },
    payment_status: {
      String: "Outstanding",
      Valid: true,
    },
  },
];

export const mockedSingleInvoice = {
  safe_keeping_item: null,
  transaction_items: null,
  payment_holiday: [
    {
      id: "3e7d163c-0425-4260-a04e-5dd68e8c17b5",
      holiday_ref: {
        String: "",
        Valid: false,
      },
      invoice_narrative: {
        String: "",
        Valid: false,
      },
      client_rate_card_id: "9f848da4-eb20-4ed0-b796-d7624b53cf42",
      entity_id: "a5f3581a-992d-4b3c-993b-c7d225b564d0",
      created_at: "2023-02-09T08:19:52.196502Z",
      updated_at: "2023-02-09T08:19:52.196502Z",
      invoice_id: "e382b77f-e779-44d4-a081-b0fd0a6febe8",
      is_active: true,
      start_date: "2023-02-09T00:00:00Z",
      end_date: "2023-03-09T00:00:00Z",
    },
  ],
  pocket_expenses: null,
  invoice: {
    reference: "invoice ref",
    date: "2023-02-09T08:19:50.058986Z",
    amount: "0",
    created_at: "2023-02-09T08:19:50.058986Z",
    updated_at: "2023-02-09T08:19:50.058986Z",
    created_by: "xxx",
    approved_by: {
      String: "",
      Valid: false,
    },
    entity_id: "a5f3581a-992d-4b3c-993b-c7d225b564d0",
    id: "e382b77f-e779-44d4-a081-b0fd0a6febe8",
    client_rate_card_id: "9f848da4-eb20-4ed0-b796-d7624b53cf42",
    payment_status_id: "5a53c225-823c-4cd5-9fce-a75aaa1cf77d",
    status_id: "bfe4d55a-04b7-47de-b3dc-bd3307a9fb84",
    min_charge: "100",
    status: {
      String: "Open",
      Valid: true,
    },
    payment_status: {
      String: "Outstanding",
      Valid: true,
    },
  },
};
