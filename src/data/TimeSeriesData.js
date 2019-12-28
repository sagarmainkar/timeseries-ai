import DataFrame from "dataframe-js";

export class Configuration {
  constructor() {
    this.n_lags = null;
    this.n_epochs = null;
    this._timeID = null;
    this._depVar = null;
    this._indVars = [];
  }

  get lags() {
    return this.n_lags;
  }

  get epochs() {
    return this.n_epochs;
  }

  get timeID() {
    return this._timeID;
  }

  get depVar() {
    return this._depVar;
  }

  get indVars() {
    return this._indVars;
  }

  set lags(lags) {
    this.n_lags = lags;
  }

  set epochs(epochs) {
    this.n_epochs = epochs;
  }

  set timeID(timeID) {
    this._timeID = timeID;
  }

  set depVar(depVar) {
    this._depVar = depVar;
  }

  set indVars(indVars) {
    this._indVars = indVars;
  }
}

export class Data {
  constructor() {
    this._config = new Configuration();
  }

  get config() {
    return this._config;
  }

  set config(config) {
    this._config = config;
  }
}

let _tsData_instance = null;

export default class TimeSeriesData {
  constructor() {
    if (!_tsData_instance) {
      _tsData_instance = this;
    }
    this.df = null;
    this.data = null;
    this.x = null;
    this.y = null;
    return _tsData_instance;
  }

  async loadData(
    url = "https://raw.githubusercontent.com/plotly/datasets/master/finance-charts-apple.csv"
  ) {
    const df = await DataFrame.fromCSV(url);

    this.data = df;
  }

  getColumns() {
    return this.data.listColumns();
  }

  prepareData(timeID, depVar) {
    let self = this;
    return new Promise(resolve => {
      console.debug(`[TimeSeriesData.js] prepareDate data:${self.data}`);
      self.x = self.data
        .select(timeID)
        .toArray()
        .map(item => new Date(Date.parse(item)));

      self.y = self.data
        .select(depVar)
        .toArray()
        .map(item => parseFloat(item));

      resolve({ X: self.x, y: self.y });
    });
  }

  getDataFrame() {
    return this.data;
  }

  getData_X() {
    return this.x;
  }

  getData_Y() {
    return this.y;
  }
}
