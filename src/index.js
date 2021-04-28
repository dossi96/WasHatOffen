import React from 'react';
import ReactDOM from 'react-dom';

import Icon from '@mdi/react'
import { mdiAccount, mdiMapSearchOutline } from '@mdi/js'

import './index.css';

// Import agsMap
import {agsMap} from './agsMap.js'


// Import Victory
import { VictoryChart, VictoryGroup, VictoryBar } from 'victory'
import { BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';


class App extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      zip: "",
      ags: "",
      searched: false,
      apiFetchCompleted: false,

      // API Fetched 
      apiFetched_District_Day: false,
      apiFetched_District_Month_Cases: false,
      apiFetched_District_Month_Recovered: false,
      apiFetched_District_Month_Deaths: false,
      apiFetched_District_Month_Incidence: false,

      apiFetched_Germany_Day: false,
      apiFetched_Germany_Month: false,

      // API Error
      apiError_District_Day: null,
      apiError_District_Month_Cases: null,
      apiError_District_Month_Recovered: null,
      apiError_District_Month_Deaths: null,
      apiError_District_Month_Incidence: null,
      
      apiError_Germany_Day: null,
      apiError_Germany_Month: null,

      // API Answer
      data_District_Day: null,
      data_District_Month_Cases: null,
      data_District_Month_Recovered: null,
      data_District_Month_Deaths: null,
      data_District_Month_Incidence: null,

      data_Germany_Day: null,
      data_Germany_Month: null,


      dataMeta: null,
    };

    this.handleChangeZipCode = this.handleChangeZipCode.bind(this);
    this.handleSearchButton = this.handleSearchButton.bind(this);
  }

  handleChangeZipCode(e) {
    var code = e.target.value;
    this.setState({zip: code});

    this.setState({searched: false});
  }

  handleSearchButton() {
    this.setState({searched: true});

    var ags = agsMap["agsData"][this.state.zip]["ags"]
    this.setState({ags: ags})

    this.fetchApi(ags);
  }

  fetchApi(ags) {
    // District Day
    fetch("https://api.corona-zahlen.org/districts/" + ags)
    .then(res => res.json())
    .then(
      (result) => {
        this.setState({
          apiFetched_District_Day: true,
          data_District_Day: result.data,
          dataMeta: result.meta,
        });
      },
      (error) => {
        this.setState({
          apiFetched_District_Day: true,
          apiError_District_Day: error,
        });
      }
    )

    // District Month Cases
    fetch("https://api.corona-zahlen.org/districts/"+ags+"/history/cases/30")
    .then(res => res.json())
    .then(
      (result) => {
        this.setState({
          apiFetched_District_Month_Cases: true,
          data_District_Month_Cases: result.data,
        });
      },
      (error) => {
        this.setState({
          apiFetched_District_Month_Cases: true,
          apiError_District_Month_Cases: error,
        });
      }
    )

    // District Month Recovered
    fetch("https://api.corona-zahlen.org/districts/"+ags+"/history/recovered/30")
    .then(res => res.json())
    .then(
      (result) => {
        this.setState({
          apiFetched_District_Month_Recovered: true,
          data_District_Month_Recovered: result.data,
        });
      },
      (error) => {
        this.setState({
          apiFetched_District_Month_Recovered: true,
          apiError_District_Month_Recovered: error,
        });
      }
    )

    // District Month Deaths
    fetch("https://api.corona-zahlen.org/districts/"+ags+"/history/deaths/30")
    .then(res => res.json())
    .then(
      (result) => {
        this.setState({
          apiFetched_District_Month_Deaths: true,
          data_District_Month_Deaths: result.data,
        });
      },
      (error) => {
        this.setState({
          apiFetched_District_Month_Deaths: true,
          apiError_District_Month_Deaths: error,
        });
      }
    )

    // District Month Incidence
    fetch("https://api.corona-zahlen.org/districts/"+ags+"/history/incidence/30")
    .then(res => res.json())
    .then(
      (result) => {
        this.setState({
          apiFetched_District_Month_Incidence: true,
          data_District_Month_Incidence: result.data,
        });
      },
      (error) => {
        this.setState({
          apiFetched_District_Month_Incidence: true,
          apiError_District_Month_Incidence: error,
        });
      }
    )


    // End Fetch
    this.setState({apiFetchCompleted: true})
  }


  render() {
    return (
      <div>
        <div className="mainContainer">
          <div className="logoContainer"></div>
          <div className="searchContainer">
            <p className= "mainHeader">Erhalte alle Corona Daten für deine Region auf einen Klick</p>
            <div className="inputWrapper">
              <div className="inputContainer">
              <input className="searchbar" placeholder="PLZ" type="number" value={this.state.zip} onChange={(e) => this.handleChangeZipCode(e)}></input>
              <button className="searchbar" onClick={this.handleSearchButton}>
                <Icon path={mdiMapSearchOutline} size={1} color={"var(--background)"}/>
                </button>
              </div>
            </div>
          </div>

          <p>apiFetched: {this.state.apiFetched_District_Day.toString()}</p>
          <p>apiError: {this.state.apiError_District_Day != null ? this.state.apiError_District_Day.toString() : "false"}</p>
          {
            this.state.searched ? 
            <p>User searched for {this.state.zip}; City: {agsMap["agsData"][this.state.zip]["ort"]}; AGS: {agsMap["agsData"][this.state.zip]["ags"]}</p>
            :
            null
          }
          {
            (this.state.apiFetched && this.state.apiError == null) ? 
              <p>Aktive Fälle in {this.state.data_District_Day[this.state.ags]["name"]}: {this.state.data_District_Day[this.state.ags]["cases"]}</p>
              // console.log(this.state.ags)
            :
            null
          }

        </div>
        {
          this.state.apiFetchCompleted ?
          <MainContent 
            districtName = {agsMap["agsData"][this.state.zip]["ort"]}
            districtDay = {this.state.data_District_Day != null ? this.state.data_District_Day[this.state.ags] : null}
            districtMonthCases = {this.state.data_District_Month_Cases != null ? this.state.data_District_Month_Cases[this.state.ags]["history"] : null}
            districtMonthRecovered = {this.state.data_District_Month_Recovered != null ? this.state.data_District_Month_Recovered[this.state.ags]["history"] : null}
            districtMonthDeaths = {this.state.data_District_Month_Deaths != null ? this.state.data_District_Month_Deaths[this.state.ags]["history"] : null}
            districtMonthIncidence = {this.state.data_District_Month_Incidence != null ? this.state.data_District_Month_Incidence[this.state.ags]["history"] : null}
          />

          :
          null
        }

      </div>
    )
  }
}



class MainContent extends React.Component {
  constructor(props){
    super(props);
    this.state = {}
  }

  render() {
    return (
      <div className="mainContentWrapper">
        {this.props.districtDay != null ?
          <DistrictDay districtName={this.props.districtName} data={this.props.districtDay}/>
          :
          null
        }
        {this.props.districtMonthCases != null && this.props.districtMonthRecovered != null && this.props.districtMonthDeaths != null && this.props.districtMonthIncidence?
          <DistrictMonth districtName={this.props.districtName} cases = {this.props.districtMonthCases} recovered = {this.props.districtMonthRecovered} deaths = {this.props.districtMonthDeaths} incidence = {this.props.districtMonthIncidence}/>
          :
          null
        }
      </div>
    )
  }
}


class DistrictDay extends React.Component {
  constructor(props){
    super(props);
    this.state = {}
  }

  render() {
    return (
      <div className="contentContainer">
        <p className="districtDayHeader">Übersicht der heutigen Zahlen für: {this.props.districtName}</p>
        <p className="districtDay">Fälle: {this.props.data["cases"]}</p>
        <p className="districtDay">Genesen: {this.props.data["recovered"]}</p>
        <p className="districtDay">Todesfälle: {this.props.data["deaths"]}</p>
        <p className="districtDay">Fälle pro 100.000: {this.props.data["casesPer100k"]}</p>
        <p className="districtDay">7-Tage Inzidenz: {this.props.data["weekIncidence"]}</p>
      </div>
    )
  }
}

class DistrictMonth extends React.Component {
  constructor(props){
    super(props);
    this.state = {}
  }

  componentDidMount() {
    var data = []

    this.props.cases.map((d, index) => {
      var element = {}

      var dateDay = this.props.cases[index]["date"].substring(8,10);
      var dateMonth = this.props.cases[index]["date"].substring(5,7);
      var dateYear = this.props.cases[index]["date"].substring(2,4);
      var dateCorrected = dateDay + "." + dateMonth + "." + dateYear;
      element["name"] = dateCorrected;
      element["cases"] = this.props.cases[index]["cases"];
      element["recovered"] = this.props.recovered[index]["recovered"];
      element["deaths"] = this.props.deaths[index]["deaths"];

      data.push(element);
    })


    this.setState({data: data})
  }

  render() {
    return (
      <div className="contentContainer">
        <p className="districtDayHeader">Statistiken</p>

        <div className="plotWrapper">
          <div className="plotContainer">
            <ResponsiveContainer width="100%" height="100%">
            <BarChart
                width={"100%"}
                height={"100%"}
                data={this.state.data}
                // margin={{
                //   top: 5,
                //   right: 30,
                //   left: 20,
                //   bottom: 5,
                // }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" style={{fontFamily: "var(--mainFont)"}}/>
                <YAxis domain={[0,'dataMax']} style={{fontFamily: "var(--mainFont)"}}/>
                <Tooltip style={{fontFamily: "var(--mainFont)"}}/>
                <Legend style={{fontFamily: "var(--mainFont)"}}/>
                <Bar dataKey="cases" fill="#465973" />
                <Bar dataKey="recovered" fill="#6181b0" />
                <Bar dataKey="deaths" fill="#202936" />
              </BarChart>
            </ResponsiveContainer>
          </div>

        </div>










        {/* {
          this.props.cases.map((d) => {
            return <p>Fälle: {d["cases"]}, Datum: {d["date"]}</p>
          })
        } */}
        {/* {console.log(this.props.cases)}
        {console.log(this.props.recovered)}
        {console.log(this.props.deaths)}
        {console.log(this.props.incidence)} */}
      </div>
    )
  }
}




ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);
