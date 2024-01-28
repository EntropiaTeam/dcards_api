## Description

Printible API, based on NestJS framework.

Includes:

- Swagger (under /api/docs)
- Coverage report

## Installation

```bash
$ npm install
```

## Running the app

```bash
To start Printible API in VSCode debug + watch mode: press F5

# development
$ npm run start

# watch mode
$ npm run start:dev

# debug mode
$ npm run start:debug

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

### Run load tests

```bash
npm run load-test
```

> Note: for the visualization test results before running load tests make sure that you have installed next libs on your laptop:

- **install k6** [link to k6 installation guide](https://k6.io/docs/getting-started/installation)

- **download and install Grafana** [link to Grafana installation docs](https://grafana.com/docs/grafana/latest/installation/)

- **download and install InfluxDB** [link to influxdb installation docs](https://portal.influxdata.com/downloads/)

> Note: run **influxd** application if you are using Windows OS.
> By default, InfluxDB server runs on port 8086 and Grafana server runs on port 3000.
> Running the load tests script, it exports data to InfluxDB and fullCycle-sum.json file that is generated to the './src/test/load-tests directory.
>
> - head over to <http://localhost:3000> and create a data source choosing InfluxDB.
> - to import data go to Main menu -> Dashboards -> Import
> - type in the dashboard id field to import this dashboard - 2587.

## License

Nest is [MIT licensed](LICENSE).

## Emoji support

Project use noto-emoji provided by Google.

SVG's are avialible under

https://github.com/googlefonts/noto-emoji/tree/master/svg for general emoji

and

https://github.com/googlefonts/noto-emoji/tree/master/third_party/region-flags/svg for flags

Emoji named in format unicodeName.svg or unicodeName1_unicodeName2_unicodeName3.svg for complex emoji.

Flags images named with regional flags letters, for example US.svg.

Emoji must be pulled from google noto-emoji repo and be manually updated in this project to support new emoji.

Some flags in repo are symlinks to another flags, they need to be replaced by linked images after updating of the repo.
