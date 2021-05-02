import React from 'react';
import ReactDOM from 'react-dom';

import Icon from '@mdi/react'
import { mdiAccount, mdiMapSearchOutline } from '@mdi/js'

import './index.css';

// Import agsMap
import {agsMap} from './agsMap.js'


// Import Victory
import { VictoryChart, VictoryGroup, VictoryBar } from 'victory'
import { BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, ReferenceLine } from 'recharts';


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
      apiFetched_Germany_History_Cases: false,
      apiFetched_Germany_History_Recovered: false,
      apiFetched_Germany_History_Deaths: false,
      apiFetched_Germany_History_Incidence: false,

      // API Error
      apiError_District_Day: null,
      apiError_District_Month_Cases: null,
      apiError_District_Month_Recovered: null,
      apiError_District_Month_Deaths: null,
      apiError_District_Month_Incidence: null,
      
      apiError_Germany_Day: null,
      apiError_Germany_History_Cases: null,
      apiError_Germany_History_Recovered: null,
      apiError_Germany_History_Deaths: null,
      apiError_Germany_History_Incidence: null,

      // API Answer
      data_District_Day: null,
      data_District_Month_Cases: null,
      data_District_Month_Recovered: null,
      data_District_Month_Deaths: null,
      data_District_Month_Incidence: null,

      data_Germany_Day: null,
      data_Germany_History_Cases: null,
      data_Germany_History_Recovered: null,
      data_Germany_History_Deaths: null,
      data_Germany_History_Incidence: null,


      dataMeta: null,

      // User Selection
      scope: "district",
      days: 30
    };

    this.handleChangeZipCode = this.handleChangeZipCode.bind(this);
    this.handleSearchButton = this.handleSearchButton.bind(this);

    this.handleScopeToggle = this.handleScopeToggle.bind(this);
    this.handleDaysToggle = this.handleDaysToggle.bind(this);
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

  handleScopeToggle() {
    if (this.state.scope == "district") {
      this.setState({scope: "country"});
    }
    else {
      this.setState({scope: "district"})
    }
  }

  handleDaysToggle() {
    var currentDaysValue = this.state.days;
    
    if (currentDaysValue == 7) {
      this.setState({days: 30});
    }
    else if (currentDaysValue == 30) {
      this.setState({days: 365});
    }
    else {
      this.setState({days: 7});
    }
  }

  // fetchApi(ags) {
  //   // District Day
  //   fetch("https://api.corona-zahlen.org/districts/" + ags)
  //   .then(res => res.json())
  //   .then(
  //     (result) => {
  //       this.setState({
  //         apiFetched_District_Day: true,
  //         data_District_Day: result.data,
  //         dataMeta: result.meta,
  //       });
  //     },
  //     (error) => {
  //       this.setState({
  //         apiFetched_District_Day: true,
  //         apiError_District_Day: error,
  //       });
  //     }
  //   )

  //   // District Month Cases
  //   fetch("https://api.corona-zahlen.org/districts/"+ags+"/history/cases/365")
  //   .then(res => res.json())
  //   .then(
  //     (result) => {
  //       this.setState({
  //         apiFetched_District_Month_Cases: true,
  //         data_District_Month_Cases: result.data,
  //       });
  //     },
  //     (error) => {
  //       this.setState({
  //         apiFetched_District_Month_Cases: true,
  //         apiError_District_Month_Cases: error,
  //       });
  //     }
  //   )

  //   // District Month Recovered
  //   fetch("https://api.corona-zahlen.org/districts/"+ags+"/history/recovered/365")
  //   .then(res => res.json())
  //   .then(
  //     (result) => {
  //       this.setState({
  //         apiFetched_District_Month_Recovered: true,
  //         data_District_Month_Recovered: result.data,
  //       });
  //     },
  //     (error) => {
  //       this.setState({
  //         apiFetched_District_Month_Recovered: true,
  //         apiError_District_Month_Recovered: error,
  //       });
  //     }
  //   )

  //   // District Month Deaths
  //   fetch("https://api.corona-zahlen.org/districts/"+ags+"/history/deaths/365")
  //   .then(res => res.json())
  //   .then(
  //     (result) => {
  //       this.setState({
  //         apiFetched_District_Month_Deaths: true,
  //         data_District_Month_Deaths: result.data,
  //       });
  //     },
  //     (error) => {
  //       this.setState({
  //         apiFetched_District_Month_Deaths: true,
  //         apiError_District_Month_Deaths: error,
  //       });
  //     }
  //   )

  //   // District Month Incidence
  //   fetch("https://api.corona-zahlen.org/districts/"+ags+"/history/incidence/365")
  //   .then(res => res.json())
  //   .then(
  //     (result) => {
  //       this.setState({
  //         apiFetched_District_Month_Incidence: true,
  //         data_District_Month_Incidence: result.data,
  //       });
  //     },
  //     (error) => {
  //       this.setState({
  //         apiFetched_District_Month_Incidence: true,
  //         apiError_District_Month_Incidence: error,
  //       });
  //     }
  //   )


  //   // Germany Cases
  //   fetch("https://api.corona-zahlen.org/germany/history/cases/365")
  //   .then(res => res.json())
  //   .then(
  //     (result) => {
  //       this.setState({
  //         apiFetched_Germany_History_Cases: true,
  //         data_Germany_History_Cases: result.data,
  //       });
  //     },
  //     (error) => {
  //       this.setState({
  //         apiFetched_Germany_History_Cases: true,
  //         apiError_Germany_History_Cases: error,
  //       });
  //     }
  //   )

  //   // Germany Recovered
  //   fetch("https://api.corona-zahlen.org/germany/history/recovered/365")
  //   .then(res => res.json())
  //   .then(
  //     (result) => {
  //       this.setState({
  //         apiFetched_Germany_History_Recovered: true,
  //         data_District_Germany_History_Recovered: result.data,
  //       });
  //     },
  //     (error) => {
  //       this.setState({
  //         apiFetched_Germany_History_Recovered: true,
  //         apiError_Germany_History_Recovered: error,
  //       });
  //     }
  //   )

  //   // Germany Deaths
  //   fetch("https://api.corona-zahlen.org/germany/history/deaths/365")
  //   .then(res => res.json())
  //   .then(
  //     (result) => {
  //       this.setState({
  //         apiFetched_Germany_History_Deaths: true,
  //         data_Germany_History_Deaths: result.data,
  //       });
  //     },
  //     (error) => {
  //       this.setState({
  //         apiFetched_Germany_History_Deaths: true,
  //         apiError_Germany_History_Deaths: error,
  //       });
  //     }
  //   )

  //   // Germany Incidence
  //   fetch("https://api.corona-zahlen.org/germany/history/incidence/365")
  //   .then(res => res.json())
  //   .then(
  //     (result) => {
  //       this.setState({
  //         apiFetched_Germany_History_Incidence: true,
  //         data_Germany_History_Incidence: result.data,
  //       });
  //     },
  //     (error) => {
  //       this.setState({
  //         apiFetched_Germany_History_Incidence: true,
  //         apiError_Germany_History_Incidence: error,
  //       });
  //     }
  //   )


  //   // End Fetch
  //   this.setState({apiFetchCompleted: true})
  // }

  fetchApi = async (ags) => {
    // District Day
    await fetch("https://api.corona-zahlen.org/districts/" + ags)
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
    await fetch("https://api.corona-zahlen.org/districts/"+ags+"/history/cases/365")
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
    await fetch("https://api.corona-zahlen.org/districts/"+ags+"/history/recovered/365")
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
    await fetch("https://api.corona-zahlen.org/districts/"+ags+"/history/deaths/365")
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
    await fetch("https://api.corona-zahlen.org/districts/"+ags+"/history/incidence/365")
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


    // Germany Day
    await fetch("https://api.corona-zahlen.org/germany/")
    .then(res => res.json())
    .then(
      (result) => {
        this.setState({
          apiFetched_Germany_Day: true,
          data_Germany_Day: result,
          dataMeta: result.meta,
        });
      },
      (error) => {
        this.setState({
          apiFetched_Germany_Day: true,
          apiError_Germany_Day: error,
        });
      }
    )
      

    // Germany Cases
    await fetch("https://api.corona-zahlen.org/germany/history/cases/365")
    .then(res => res.json())
    .then(
      (result) => {
        this.setState({
          apiFetched_Germany_History_Cases: true,
          data_Germany_History_Cases: result.data,
        });
      },
      (error) => {
        this.setState({
          apiFetched_Germany_History_Cases: true,
          apiError_Germany_History_Cases: error,
        });
      }
    )


    // Germany Recovered
    await fetch("https://api.corona-zahlen.org/germany/history/recovered/365")
    .then(res => res.json())
    .then(
      (result) => {
        this.setState({
          apiFetched_Germany_History_Recovered: true,
          data_Germany_History_Recovered: result.data,
        });
      },
      (error) => {
        this.setState({
          apiFetched_Germany_History_Recovered: true,
          apiError_Germany_History_Recovered: error,
        });
      }
    )


    // Germany Deaths
    await fetch("https://api.corona-zahlen.org/germany/history/deaths/365")
    .then(res => res.json())
    .then(
      (result) => {
        this.setState({
          apiFetched_Germany_History_Deaths: true,
          data_Germany_History_Deaths: result.data,
        });
      },
      (error) => {
        this.setState({
          apiFetched_Germany_History_Deaths: true,
          apiError_Germany_History_Deaths: error,
        });
      }
    )



    // Germany Incidence
    await fetch("https://api.corona-zahlen.org/germany/history/incidence/365")
    .then(res => res.json())
    .then(
      (result) => {
        this.setState({
          apiFetched_Germany_History_Incidence: true,
          data_Germany_History_Incidence: result.data,
        });
      },
      (error) => {
        this.setState({
          apiFetched_Germany_History_Incidence: true,
          apiError_Germany_History_Incidence: error,
        });
      }
    )


    // Vaccinations Day
    await fetch("https://api.corona-zahlen.org/vaccinations")
    .then(res => res.json())
    .then(
      (result) => {
        this.setState({
          apiFetched_Vaccinations_Day: true,
          data_Vaccinations_Day: result.data,
        });
      },
      (error) => {
        this.setState({
          apiFetched_Vaccinations_Day: true,
          apiError_Vaccinations_Day: error,
        });
      }
    )

    // Vaccinations History
    await fetch("https://api.corona-zahlen.org/vaccinations/history")
    .then(res => res.json())
    .then(
      (result) => {
        this.setState({
          apiFetched_Vaccinations_History: true,
          data_Vaccinations_History: result.data.history,
        });
      },
      (error) => {
        this.setState({
          apiFetched_Vaccinations_History: true,
          apiError_Vaccinations_History: error,
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
        </div>
        {
          this.state.apiFetchCompleted && this.state.scope == "district" ?
            <MainContent 
              districtName = {agsMap["agsData"][this.state.zip]["ort"]}
              districtDay = {this.state.data_District_Day[this.state.ags]}
              districtDay = {this.state.data_District_Day[this.state.ags]}
              districtMonthCases = {this.state.data_District_Month_Cases[this.state.ags]["history"]}
              districtMonthRecovered = {this.state.data_District_Month_Recovered[this.state.ags]["history"]}
              districtMonthDeaths = {this.state.data_District_Month_Deaths[this.state.ags]["history"]}
              districtMonthIncidence = {this.state.data_District_Month_Incidence[this.state.ags]["history"]}
              vaccinationsDay = {this.state.data_Vaccinations_Day != null ? this.state.data_Vaccinations_Day : null}
              vaccinationsHistory = {this.state.data_Vaccinations_History != null ? this.state.data_Vaccinations_History : null}

              scope = {this.state.scope}
              days = {this.state.days}
              handleScopeToggle = {this.handleScopeToggle}
              handleDaysToggle = {this.handleDaysToggle} 
            />
          :
          null
        }
        {
          this.state.apiFetchCompleted && this.state.scope == "country"?
            <MainContent 
              districtName = {agsMap["agsData"][this.state.zip]["ort"]}
              districtDay = {this.state.data_Germany_Day != null ? this.state.data_Germany_Day : null}
              districtMonthCases = {this.state.data_Germany_History_Cases != null ? this.state.data_Germany_History_Cases : null}
              districtMonthRecovered = {this.state.data_Germany_History_Recovered != null ? this.state.data_Germany_History_Recovered : null}
              districtMonthDeaths = {this.state.data_Germany_History_Deaths != null ? this.state.data_Germany_History_Deaths : null}
              districtMonthIncidence = {this.state.data_Germany_History_Incidence != null ? this.state.data_Germany_History_Incidence : null}
              vaccinationsDay = {this.state.data_Vaccinations_Day != null ? this.state.data_Vaccinations_Day : null}
              vaccinationsHistory = {this.state.data_Vaccinations_History != null ? this.state.data_Vaccinations_History : null}

              scope = {this.state.scope}
              days = {this.state.days}
              handleScopeToggle = {this.handleScopeToggle}
              handleDaysToggle = {this.handleDaysToggle} 
            />
          :
          console.log(this.state.data_Germany_Day)
        }

      </div>
    )
  }
}



class MainContent extends React.Component {
  constructor(props){
    super(props);
    this.state = {}

    this.handleScopeToggle = this.handleScopeToggle.bind(this);
    this.handleDaysToggle = this.handleDaysToggle.bind(this);
  }

  handleScopeToggle() {
    this.props.handleScopeToggle();
  }

  handleDaysToggle() {
    this.props.handleDaysToggle();
  }

  render() {
    return (
      <div className="mainContentWrapper">
        {this.props.districtDay != null ?
          <DistrictDay scope = {this.props.scope} handleScopeToggle={this.handleScopeToggle} districtName={this.props.districtName} data={this.props.districtDay}/>
          :
          null
        }
        {this.props.districtMonthCases != null && this.props.districtMonthRecovered != null && this.props.districtMonthDeaths != null && this.props.districtMonthIncidence != null && this.props.districtDay != null ?
          <DistrictMonth 
            districtName={this.props.districtName} 
            dataDay={this.props.districtDay} 
            scope = {this.props.scope} 
            handleScopeToggle={this.handleScopeToggle} 
            days = {this.props.days} 
            handleDaysToggle={this.handleDaysToggle} 
            cases = {this.props.districtMonthCases} 
            recovered = {this.props.districtMonthRecovered} 
            deaths = {this.props.districtMonthDeaths} 
            incidence = {this.props.districtMonthIncidence}
            vaccinationsDay = {this.props.vaccinationsDay}
            vaccinationsHistory = {this.props.vaccinationsHistory}/>
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

    this.handleScopeToggle = this.handleScopeToggle.bind(this);
  }

  handleScopeToggle() {
    this.props.handleScopeToggle();
  }

  render() {
    return (
      <div className="contentContainer">
        <p className="districtDayHeader">Übersicht der heutigen Zahlen für <button className="toggleButton" onClick={this.handleScopeToggle}>{this.props.scope == "district" ? this.props.districtName : "Deuschland"}</button></p>
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

    this.handleScopeToggle = this.handleScopeToggle.bind(this);
    this.handleDaysToggle = this.handleDaysToggle.bind(this);
  }

  // componentDidMount() {
  //   // Per Day Statistics
  //   var data = []

  //   this.props.cases.map((d, index) => {
  //     var element = {}

  //     var dateDay = this.props.cases[index]["date"].substring(8,10);
  //     var dateMonth = this.props.cases[index]["date"].substring(5,7);
  //     var dateYear = this.props.cases[index]["date"].substring(2,4);
  //     var dateCorrected = dateDay + "." + dateMonth + "." + dateYear;
  //     element["datum"] = dateCorrected;
  //     element["Neue Fälle"] = this.props.cases[index]["cases"];
  //     element["Genesene Personen"] = this.props.recovered[index]["recovered"];
  //     element["Todesfälle"] = this.props.deaths[index]["deaths"];

  //     data.push(element);
  //   })
  //   this.setState({data: data})


  //   // Cumulativ Statistics
  //   var dataCumulative = []
  //   var totalCases = this.props.dataDay["cases"];
  //   var totalRecovered = this.props.dataDay["recovered"];
  //   var totalDeaths = this.props.dataDay["deaths"];
  //   var arrayLength = this.props.cases.length - 1;

  //   this.props.cases.map((d, index) => {
  //     var element = {}

  //     var dateDay = this.props.cases[this.props.cases.length - 1 - index]["date"].substring(8,10);
  //     var dateMonth = this.props.cases[this.props.cases.length - 1 - index]["date"].substring(5,7);
  //     var dateYear = this.props.cases[this.props.cases.length - 1 - index]["date"].substring(2,4);
  //     var dateCorrected = dateDay + "." + dateMonth + "." + dateYear;

  //     element["datum"] = dateCorrected;

  //     element["Fälle"] = totalCases;
  //     totalCases -= this.props.cases[arrayLength - index]["cases"];

  //     element["Genesene Personen"] = totalRecovered;
  //     totalRecovered -= this.props.recovered[arrayLength - index]["recovered"];

  //     element["Todesfälle"] = totalDeaths;
  //     totalDeaths -= this.props.deaths[arrayLength - index]["deaths"];

  //     dataCumulative.push(element)
  //   })

  //   dataCumulative = dataCumulative.reverse();
    
    
  //   this.setState({dataCumulative: dataCumulative})
  // }
  componentDidMount() {
    this.updateData(this.props.days)
  }

  componentDidUpdate(prevProps) {
    if(prevProps.days !== this.props.days) {
      this.updateData(this.props.days)
    }
  }

  updateData(days) {
    // Per Day Statistics
    var data = []
    var cases = this.props.cases.slice(-1* days);
    var recovered = this.props.recovered.slice(-1* days);
    var deaths = this.props.deaths.slice(-1* days);
    var incidence = this.props.incidence.slice(-1* days);
    cases.map((d, index) => {
      var element = {}

      var dateDay = cases[index]["date"].substring(8,10);
      var dateMonth = cases[index]["date"].substring(5,7);
      var dateYear = cases[index]["date"].substring(2,4);
      var dateCorrected = dateDay + "." + dateMonth + "." + dateYear;
      element["datum"] = dateCorrected;
      element["Neue Fälle"] = cases[index]["cases"];
      element["Genesene Personen"] = recovered[index]["recovered"];
      element["Todesfälle"] = deaths[index]["deaths"];
      element["Inzidenz"] = Math.round((incidence[index]["weekIncidence"] + Number.EPSILON) * 100) / 100;


      data.push(element);
    })

    this.setState({data: data})




    // Cumulativ Statistics
    var dataCumulative = []
    var totalCases = this.props.dataDay["cases"];
    var totalRecovered = this.props.dataDay["recovered"];
    var totalDeaths = this.props.dataDay["deaths"];
    var arrayLength = cases.length - 1;

    cases.map((d, index) => {
      var element = {}

      var dateDay = cases[cases.length - 1 - index]["date"].substring(8,10);
      var dateMonth = cases[cases.length - 1 - index]["date"].substring(5,7);
      var dateYear = cases[cases.length - 1 - index]["date"].substring(2,4);
      var dateCorrected = dateDay + "." + dateMonth + "." + dateYear;

      element["datum"] = dateCorrected;

      element["Fälle"] = totalCases;
      totalCases -= cases[arrayLength - index]["cases"];

      element["Genesene Personen"] = totalRecovered;
      totalRecovered -= recovered[arrayLength - index]["recovered"];

      element["Todesfälle"] = totalDeaths;
      totalDeaths -= deaths[arrayLength - index]["deaths"];

      dataCumulative.push(element)
    })

    dataCumulative = dataCumulative.reverse();
    
    this.setState({dataCumulative: dataCumulative})
    
    
    // Vaccination Statistics
    if (this.props.scope == "country") {
      console.log(this.props.vaccinationsDay)
      var dataVaccinations = [];
      var totalFirstVaccinations = this.props.vaccinationsDay["vaccinated"];
      var totalSecondVaccinations = this.props.vaccinationsDay["secondVaccination"]["vaccinated"];

      var vacHist = this.props.vaccinationsHistory.slice(-1* days);
      var arrayLength = vacHist.length - 1;

      vacHist.map((d, index) => {
        var element = {}

        var dateDay = vacHist[arrayLength - index]["date"].substring(8,10);
        var dateMonth = vacHist[arrayLength - index]["date"].substring(5,7);
        var dateYear = vacHist[arrayLength - index]["date"].substring(2,4);
        var dateCorrected = dateDay + "." + dateMonth + "." + dateYear;
  
        element["datum"] = dateCorrected;
  
        element["Erste Impfung"] = totalFirstVaccinations;
        totalFirstVaccinations -= vacHist[arrayLength - index]["firstVaccination"];

        element["Zweite Impfung"] = totalSecondVaccinations;
        totalSecondVaccinations -= vacHist[arrayLength - index]["secondVaccination"];

        dataVaccinations.push(element);

        
      })
      dataVaccinations = dataVaccinations.reverse();
      this.setState({dataVaccinations: dataVaccinations});
    }

  }

  handleScopeToggle() {
    this.props.handleScopeToggle();
  }

  handleDaysToggle() {
    this.props.handleDaysToggle();
  }

  render() {
    const DataFormater = (number) => {
      if(number >= 1000000000){
        return (number/1000000000).toString() + 'Mil.';
      }else if(number >= 1000000){
        return (number/1000000).toString() + ' Mio.';
      }else if(number >= 1000){
        return (number/1000).toString() + ' Tsd.';
      }else{
        return number.toString();
      }
    }

    return (
      <div className="contentContainer" style={{paddingTop: "2em"}}>
        <p className="districtDayHeader">Statistiken der letzten <button className="toggleButton" onClick={this.handleDaysToggle}>{this.props.days}</button> Tage für <button className="toggleButton" onClick={this.handleScopeToggle}>{this.props.scope == "district" ? this.props.districtName : "Deuschland"}</button></p>

        {/* Per Day Statistics */}
        <p className="plotHeader" style={{paddingTop: "1em"}}>Fallzahlen pro Tag</p>
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
                <XAxis dataKey="datum" style={{fontFamily: "var(--mainFont)"}}/>
                {/* <YAxis domain={[0,dataMax => Math.pow(10, Math.ceil(Math.log10((Math.round(dataMax * 1.2 / 100)*100))))]} style={{fontFamily: "var(--mainFont)"}}/> */}
                {/* <YAxis domain={[0,dataMax => Math.ceil(dataMax * 1.2 / Math.pow(10, Math.log10(dataMax * 1.2)-1))*Math.pow(10, Math.log10(dataMax * 1.2)-1)]} style={{fontFamily: "var(--mainFont)"}}/> */}
                <YAxis domain={[0,dataMax => Math.round((dataMax * 1.2) / Math.pow(10, Math.round((Math.log(dataMax *1.2))/Math.log(10) - 1))) * Math.pow(10, Math.round((Math.log(dataMax *1.2))/Math.log(10) - 1))]} tickFormatter={DataFormater} style={{fontFamily: "var(--mainFont)"}}/>
                
                <Tooltip style={{fontFamily: "var(--mainFont)"}} formatter={(value) => {return value.toLocaleString();}}/>
                <Legend style={{fontFamily: "var(--mainFont)"}}/>
                <Bar dataKey="Neue Fälle" fill="#465973" />
                <Bar dataKey="Genesene Personen" fill="#6181b0" />
                <Bar dataKey="Todesfälle" fill="#202936" />
              </BarChart>
            </ResponsiveContainer>

          </div>
        </div>

        <div className="plotSpacerWrapper">
          <div className="plotSpacerTop"></div>
          <div className="plotSpacerBottom"></div>
        </div>

        {/* Cumulated Statistics */}
        <p className="plotHeader">Kumulierte Fallzahlen</p>
        <div className="plotWrapper">
          <div className="plotContainer">
            <ResponsiveContainer width="100%" height="100%">
            <LineChart
                width={"100%"}
                height={"100%"}
                data={this.state.dataCumulative}
                // margin={{
                //   top: 5,
                //   right: 30,
                //   left: 20,
                //   bottom: 5,
                // }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="datum" style={{fontFamily: "var(--mainFont)"}}/>
                <YAxis domain={[0,dataMax => Math.round((dataMax * 1.2) / Math.pow(10, Math.round((Math.log(dataMax *1.2))/Math.log(10) - 1))) * Math.pow(10, Math.round((Math.log(dataMax *1.2))/Math.log(10) - 1))]} tickFormatter={DataFormater} style={{fontFamily: "var(--mainFont)"}}/>
                <Tooltip style={{fontFamily: "var(--mainFont)"}} formatter={(value) => {return value.toLocaleString();}}/>
                <Legend style={{fontFamily: "var(--mainFont)"}}/>
                <Line type="monotone" dot={false} dataKey="Fälle" stroke="#465973" />
                <Line type="monotone" dot={false} dataKey="Genesene Personen" stroke="#6181b0" />
                <Line type="monotone" dot={false} dataKey="Todesfälle" stroke="#202936" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="plotSpacerWrapper">
          <div className="plotSpacerTop"></div>
          <div className="plotSpacerBottom"></div>
        </div>

        {/* Incidence */}
        <p className="plotHeader">Inzidenz</p>
        <div className="plotWrapper">
          <div className="plotContainer">
            <ResponsiveContainer width="100%" height="100%">
            <LineChart
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
                <ReferenceLine y={100} stroke="#6D7B8C" alwaysShow={true} strokeDasharray="5 5"/>
                <XAxis dataKey="datum" style={{fontFamily: "var(--mainFont)"}}/>
                <YAxis domain={[0, dataMax => (Math.round((dataMax + 100)/100) * 100)]} style={{fontFamily: "var(--mainFont)"}}/>
                <Tooltip style={{fontFamily: "var(--mainFont)"}} formatter={(value) => {return value.toLocaleString();}}/>
                <Legend style={{fontFamily: "var(--mainFont)"}}/>
                <Line type="monotone" dot={false} dataKey="Inzidenz" stroke="#465973" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>



        {/* Vaccinations */}
        {
          this.props.scope == "country" ?
            <div>
                      <div className="plotSpacerWrapper">
          <div className="plotSpacerTop"></div>
          <div className="plotSpacerBottom"></div>
        </div>
              <p className="plotHeader">Impfungen</p>

              <div className="plotWrapper">
                <div className="plotContainer">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      width={"100%"}
                      height={"100%"}
                      data={this.state.dataVaccinations}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="datum" style={{fontFamily: "var(--mainFont)"}}/>
                      <YAxis domain={[0,dataMax => Math.round((dataMax * 1.2) / Math.pow(10, Math.round((Math.log(dataMax *1.2))/Math.log(10) - 1))) * Math.pow(10, Math.round((Math.log(dataMax *1.2))/Math.log(10) - 1))]} style={{fontFamily: "var(--mainFont)"}}  tickFormatter={DataFormater}/>
                      <Tooltip style={{fontFamily: "var(--mainFont)"}} formatter={(value) => {return value.toLocaleString();}}/>
                      <Legend style={{fontFamily: "var(--mainFont)"}}/>
                      <Line type="monotone" dot={false} dataKey="Erste Impfung" stroke="#465973" />
                      <Line type="monotone" dot={false} dataKey="Zweite Impfung" stroke="#6181b0" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
            

            :
            null

        }









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
