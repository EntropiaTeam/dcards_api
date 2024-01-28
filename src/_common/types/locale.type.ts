enum Locales {
  EnCA = 'en-CA',
  FrCA = 'fr-CA',
  EnUS = 'en-US'
}

type Locale = Locales.EnCA | Locales.FrCA | Locales.EnUS;

export { Locale, Locales };
