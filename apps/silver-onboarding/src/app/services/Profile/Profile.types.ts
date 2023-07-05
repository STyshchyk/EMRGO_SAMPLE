export interface ISettingsDocument {
  id: string,
  key: string,
  value: string
}

export interface ISettings {
  settings: ISettingsDocument[];
}
