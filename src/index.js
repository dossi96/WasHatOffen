import React from 'react';
import ReactDOM from 'react-dom';

import Icon from '@mdi/react'
import { mdiMapSearchOutline, mdiLoading, mdiChevronDown } from '@mdi/js'

import './index.css';

// Import agsMap
import {agsMap} from './agsMap.js'


// Import Recharts
import { BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, ReferenceLine } from 'recharts';


import {isMobile} from 'react-device-detect';


class App extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      zip: "",
      zipTMP: "",
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
      days: 30,

      // Button Demo At Home Screen
      buttonDemo: "Klick",

      // Legal Links
      showImpressum: false,
      showDatenschutz: false,

      // Check if User uses mobile device
      mobile: true,

      disableSearch: false,
      loadingData: false,
      showTimerError: false,
      showUnknownZipError: false,
      showDataError: false,
    };

    this.handleChangeZipCode = this.handleChangeZipCode.bind(this);
    this.handleSearchButton = this.handleSearchButton.bind(this);

    this.handleScopeToggle = this.handleScopeToggle.bind(this);
    this.handleDaysToggle = this.handleDaysToggle.bind(this);

    this.handleKlickBlickButton = this.handleKlickBlickButton.bind(this);
    this.handleShowImpressum = this.handleShowImpressum.bind(this);
    this.handleShowDatenschutz = this.handleShowDatenschutz.bind(this);
    this.closeLegal = this.closeLegal.bind(this);
  }

  handleChangeZipCode(e) {
    var code = e.target.value;
    this.setState({zipTMP: code});

    this.setState({searched: false, showUnknownZipError: false, showDataError: false});

    if (this.state.disableSearch) {
      this.setState({showTimerError: true})
    } 
  }

  handleSearchButton() {
    this.setState({searched: true, showDataError: false});

    this.setState({zip: this.state.zipTMP});

    if (typeof(agsMap["agsData"][this.state.zipTMP]) != 'undefined' && typeof(agsMap["agsData"][this.state.zipTMP]) != null) {
      var ags = agsMap["agsData"][this.state.zipTMP]["ags"]
      this.setState({ags: ags})
      this.fetchApi(ags);
    }

    else {
      this.setState({showUnknownZipError: true})
    }
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
      if(this.state.mobile){
        this.setState({days: 7});
      }
      else {
        this.setState({days: 365});
      }
    }
    else {
      this.setState({days: 7});
    }
  }

  handleKlickBlickButton() {
    if (this.state.buttonDemo == "Blick") {
      this.setState({buttonDemo: "Klick"})
    }
    else {
      this.setState({buttonDemo: "Blick"})
    }
    
  }

  handleShowImpressum() {
    this.setState({showImpressum: true})
  }
  handleShowDatenschutz() {
    this.setState({showDatenschutz: true})
  }
  closeLegal() {
    this.setState({showImpressum: false, showDatenschutz: false})
  }



  fetchApi = async (ags) => {
    this.setState({disableSearch: true, apiFetchCompleted: false, loadingData: true});
    var errors = [];

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
        }); errors.push("error");
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
        }); errors.push("error");
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
        }); errors.push("error");
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
        }); errors.push("error");
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
        }); errors.push("error");
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
        }); errors.push("error");
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
        }); errors.push("error");
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
        }); errors.push("error");
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
        }); errors.push("error");
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
        }); errors.push("error");
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
        }); errors.push("error");
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
      },)
      .catch(error => {
        this.setState({
          apiFetched_Vaccinations_History: true,
          apiError_Vaccinations_History: error,
        }); errors.push("error"); console.log(error);
      })
    



    // End Fetch
    if (errors.length == 0) {
      this.setState({apiFetchCompleted: true, loadingData: false})
    }

    else {
      this.setState({showDataError: true, loadingData: false});
    }



    setTimeout(function() {
      this.setState({disableSearch: false, showTimerError: false, showDataError: false})
    }.bind(this), 1000*60)

    
  }

  componentDidMount() {
    if (isMobile) {
      this.setState({days: 7});
      console.log("Mobile")
    }

    else{
      this.setState({mobile: false});
      console.log("Not Mobile")
    }
  }




  render() {
    return (


      <div>
        {
        !this.state.showImpressum && !this.state.showDatenschutz ?
          <div>
            <div className="legalLinksContainer">
              <button className="aboutUs" onClick={this.handleShowDatenschutz}>Datenschutzerklärung</button>
              |
              <button className="aboutUs" onClick={this.handleShowImpressum}>Impressum</button>
            </div>

            <div className="mainContainer">
            { !isMobile ? 
              <div>
                <div className="logoContainer">
                  <p className="logo" style={{color: "var(--secondary)"}}>Corona</p>
                  <p className="logo">.Digital</p>
                </div>
                <div className="searchContainer">
                  <p className= "mainHeader">Alle Corona Daten für deine Region auf einen <button className="toggleButton" onClick={this.handleKlickBlickButton}>{this.state.buttonDemo}</button></p>
                  <div className="inputWrapper">
                    <div className="inputContainer">
                      <input className="searchbar" placeholder="PLZ" type="number" value={this.state.zipTMP} onChange={this.handleChangeZipCode}></input>
                      <button className="searchbar" onClick={this.handleSearchButton} disabled={this.state.disableSearch}>
                        <Icon path={mdiMapSearchOutline} size={1} color={this.state.disableSearch ? "var(--primary)" : "var(--background)"}/>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              :
              <div>
                <div className="logoContainer" style={{left: "0%", width: "100%"}}>
                  <p className="logo" style={{color: "var(--secondary)", fontSize: "15vw", width: "100%", textAlign: "center"}}>Corona</p>
                  <p className="logo" style={{fontSize: "15vw", width: "100%", textAlign: "center"}}>.Digital</p>
                </div>
                <div className="searchContainer">
                  <p className= "mainHeader" style={{fontSize: "7vw", paddingTop: "1.5%", paddingBottom: "1.5%", marginTop: "0", marginBottom: "0"}}>Alle Corona Daten</p>
                  <p className= "mainHeader" style={{fontSize: "7vw", paddingTop: "1.5%", paddingBottom: "1.5%", marginTop: "0", marginBottom: "0"}}>für deine Region</p>
                  <p className= "mainHeader" style={{fontSize: "7vw", paddingTop: "1.5%", paddingBottom: "1.5%", marginTop: "0"}}>auf einen <button style={{fontSize: "7vw"}} className="toggleButton" onClick={this.handleKlickBlickButton}>{this.state.buttonDemo}</button></p>
                  <div className="inputWrapper">
                    <div className="inputContainer" style={{width: "70%"}}>
                      <input className="searchbar" placeholder="PLZ" type="number" value={this.state.zipTMP} onChange={this.handleChangeZipCode} style={{fontSize: "5vw", height: "9vw"}}></input>
                      <button className="searchbar" style={{width: "30%"}} onClick={this.handleSearchButton} disabled={this.state.disableSearch}>
                        <Icon path={mdiMapSearchOutline} size={"5vw"} color={this.state.disableSearch ? "var(--primary)" : "var(--background)"}/>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              }
              <div className="contentHintContainer">
                {
                  this.state.loadingData ? <Icon path={mdiLoading} spin={true} size={2} color={"var(--primary)"}/> : null
                }
                {
                  this.state.apiFetchCompleted ? <Icon path={mdiChevronDown} size={2} color={"var(--primary)"}/> : null
                }

                
              </div>
              <div className="contentErrorContainer">
                {
                  this.state.showTimerError ?
                    <p className="timerError">Aktuell ist nur eine Anfrage pro Minute möglich</p>
                    :
                    null
                }
                {
                  this.state.showUnknownZipError ?
                    <p className="timerError">Wir konnten deine Postleitzahl leider nicht finden</p>
                    :
                    null
                }
                {
                  this.state.showDataError ?
                    <p className="timerError">Ups. Es gab technische Probleme, bitte versuche es später erneut.</p>
                    :
                    null
                }
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
        : 
        null
        }

        {/* <div>
          <span class="close">&times;</span>
          <div className="legalWrapper">
            <div className="legalContainer">
              <p className="legalHeader">This is some header</p>
              <text className="legalText">
                This is some text. Lets see if linebreaks
                work.

                Test me.
              </text>
            </div>
          </div>
        </div> */}

        {
          this.state.showImpressum ?
            <div className="legalWrapper">
              <span className="close" onClick={this.closeLegal}>&times;</span>

                <div className="legalContainer">
                <h1 className="legalHeader" style={{textDecoration: "underline"}}>Impressum</h1>

                <h2 className="legalHeader">Angaben gem&auml;&szlig; &sect; 5 TMG</h2>
                <p className="legalText">Timo Leal Dos Reis<br />
                M&uuml;nsterstr. 57<br />
                48308 Senden</p>

                <h2 className="legalHeader">Kontakt</h2>
                <p className="legalText">E-Mail: ttechs.designs@gmail.com<br />
                (Bitte nutzen Sie "CoronaDigital " + ihr Anliegen als Betreff, damit Ihre Mail zugeordnet werden kann.)</p>

                <h2 className="legalHeader">Redaktionell Verantwortlicher</h2>
                <p className="legalText">(Siehe Absatz "Angaben gemäß § 5 TMG")</p>

                <h3 className="legalHeader">Haftung f&uuml;r Inhalte</h3> 
                <p className="legalText">Als Diensteanbieter sind wir gem&auml;&szlig; &sect; 7 Abs.1 TMG f&uuml;r eigene Inhalte auf diesen Seiten nach den allgemeinen Gesetzen verantwortlich. Nach &sect;&sect; 8 bis 10 TMG sind wir als Diensteanbieter jedoch nicht verpflichtet, &uuml;bermittelte oder gespeicherte fremde Informationen zu &uuml;berwachen oder nach Umst&auml;nden zu forschen, die auf eine rechtswidrige T&auml;tigkeit hinweisen.</p> 
                <p className="legalText">Verpflichtungen zur Entfernung oder Sperrung der Nutzung von Informationen nach den allgemeinen Gesetzen bleiben hiervon unber&uuml;hrt. Eine diesbez&uuml;gliche Haftung ist jedoch erst ab dem Zeitpunkt der Kenntnis einer konkreten Rechtsverletzung m&ouml;glich. Bei Bekanntwerden von entsprechenden Rechtsverletzungen werden wir diese Inhalte umgehend entfernen.</p>
                <p className="legalText">Alle Inhalte, die aktuelle Corona Daten beinhalten werden automatisiert von dritten Quellen abgefragt. Eine permanente inhaltliche Kontrolle der externen Inhalte ist jedoch ohne konkrete Anhaltspunkte einer Rechtsverletzung nicht zumutbar. Wir übernehmen keine Haftung für die Korrektheit der Inhalte. Alle Angaben ohne Gewähr.</p>
                
                <h3 className="legalHeader">Haftung f&uuml;r Links</h3> 
                <p className="legalText">Unser Angebot enth&auml;lt Links zu externen Websites Dritter, auf deren Inhalte wir keinen Einfluss haben. Deshalb k&ouml;nnen wir f&uuml;r diese fremden Inhalte auch keine Gew&auml;hr &uuml;bernehmen. F&uuml;r die Inhalte der verlinkten Seiten ist stets der jeweilige Anbieter oder Betreiber der Seiten verantwortlich. Die verlinkten Seiten wurden zum Zeitpunkt der Verlinkung auf m&ouml;gliche Rechtsverst&ouml;&szlig;e &uuml;berpr&uuml;ft. Rechtswidrige Inhalte waren zum Zeitpunkt der Verlinkung nicht erkennbar.</p> 
                <p className="legalText">Eine permanente inhaltliche Kontrolle der verlinkten Seiten ist jedoch ohne konkrete Anhaltspunkte einer Rechtsverletzung nicht zumutbar. Bei Bekanntwerden von Rechtsverletzungen werden wir derartige Links umgehend entfernen.</p> 
                
                <h3 className="legalHeader">Urheberrecht</h3> 
                <p className="legalText">Die durch die Seitenbetreiber erstellten Inhalte und Werke auf diesen Seiten unterliegen dem deutschen Urheberrecht. Die Vervielf&auml;ltigung, Bearbeitung, Verbreitung und jede Art der Verwertung au&szlig;erhalb der Grenzen des Urheberrechtes bed&uuml;rfen der schriftlichen Zustimmung des jeweiligen Autors bzw. Erstellers. Downloads und Kopien dieser Seite sind nur f&uuml;r den privaten, nicht kommerziellen Gebrauch gestattet.</p> 
                <p className="legalText">Soweit die Inhalte auf dieser Seite nicht vom Betreiber erstellt wurden, werden die Urheberrechte Dritter beachtet. Insbesondere werden Inhalte Dritter als solche gekennzeichnet. Sollten Sie trotzdem auf eine Urheberrechtsverletzung aufmerksam werden, bitten wir um einen entsprechenden Hinweis. Bei Bekanntwerden von Rechtsverletzungen werden wir derartige Inhalte umgehend entfernen.</p>

                <p className="legalText">Quelle: <a className="legalText" target="_blank" rel="noopener" href="https://www.e-recht24.de">eRecht24</a></p>


                <h1 className="legalHeader" style={{textDecoration: "underline"}}>Lizenzen</h1>
                <h2 className="legalHeader">Robert Koch-Institut API (v2)</h2>
                <p className="legalText">
                  <a className="legalText" href="https://rki.marlon-lueckert.de" target="_blank" rel="noopener">rki-covid-api</a> by  
                  <a className="legalText" href="https://marlon-lueckert.de" target="_blank" rel="noopener"> Marlon Lückert</a> is licensed under 
                  <a className="legalText" href="https://creativecommons.org/licenses/by/4.0" target="_blank" rel="noopener"> CC BY 4.0</a>
                </p>
                <h2 className="legalHeader">React</h2>
                <p className="legalText">MIT License</p>
                <p className="legalText">Copyright (c) Facebook, Inc. and its affiliates.</p>
                <p className="legalText">Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:</p>
                <p className="legalText">The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.</p>
                <p className="legalText">THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.</p>
                <h2 className="legalHeader">Recharts</h2>
                <p className="legalText">MIT License (MIT)</p>
                <p className="legalText">Copyright (c) 2015 recharts</p>
                <p className="legalText">Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:</p>
                <p className="legalText">The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.</p>
                <p className="legalText">THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.</p>
                <h2 className="legalHeader">Material Design Icons</h2>
                <p className="legalText">Licensed under the Apache License, Version 2.0 (the "License");</p>
                <p className="legalText">you may not use this file except in compliance with the License.</p>
                <p className="legalText">You may obtain a copy of the License at <a className="legalText" href="http://www.apache.org/licenses/LICENSE-2.0" target="_blank" rel="noopener">http://www.apache.org/licenses/LICENSE-2.0</a></p>
                <p className="legalText">Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.</p>

              </div>

          </div>
          :
          null
        }

        {
          this.state.showDatenschutz ?
            <div className="legalWrapper">
              <span className="close" onClick={this.closeLegal}>&times;</span>

                <div className="legalContainer">
                  <h1 className="legalHeader">Datenschutzerklärung</h1> 
                  <p className="legalText">Personenbezogene Daten (nachfolgend zumeist nur „Daten“ genannt) werden von uns nur im Rahmen der Erforderlichkeit sowie zum Zwecke der Bereitstellung eines funktionsfähigen und nutzerfreundlichen Internetauftritts, inklusive seiner Inhalte und der dort angebotenen Leistungen, verarbeitet.</p> 
                  <p className="legalText">Gemäß Art. 4 Ziffer 1. der Verordnung (EU) 2016/679, also der Datenschutz-Grundverordnung (nachfolgend nur „DSGVO“ genannt), gilt als „Verarbeitung“ jeder mit oder ohne Hilfe automatisierter Verfahren ausgeführter Vorgang oder jede solche Vorgangsreihe im Zusammenhang mit personenbezogenen Daten, wie das Erheben, das Erfassen, die Organisation, das Ordnen, die Speicherung, die Anpassung oder Veränderung, das Auslesen, das Abfragen, die Verwendung, die Offenlegung durch Übermittlung, Verbreitung oder eine andere Form der Bereitstellung, den Abgleich oder die Verknüpfung, die Einschränkung, das Löschen oder die Vernichtung.</p> 
                  <p className="legalText">Mit der nachfolgenden Datenschutzerklärung informieren wir Sie insbesondere über Art, Umfang, Zweck, Dauer und Rechtsgrundlage der Verarbeitung personenbezogener Daten, soweit wir entweder allein oder gemeinsam mit anderen über die Zwecke und Mittel der Verarbeitung entscheiden. Zudem informieren wir Sie nachfolgend über die von uns zu Optimierungszwecken sowie zur Steigerung der Nutzungsqualität eingesetzten Fremdkomponenten, soweit hierdurch Dritte Daten in wiederum eigener Verantwortung verarbeiten.</p> 
                  <p className="legalText">Unsere Datenschutzerklärung ist wie folgt gegliedert:</p> 
                  <p className="legalText">I. Informationen über uns als Verantwortliche<br></br>II. Rechte der Nutzer und Betroffenen<br></br>III. Informationen zur Datenverarbeitung</p> 
                  
                  <h2 className="legalHeader">I. Informationen über uns als Verantwortliche</h2> 
                  <p className="legalText">Verantwortlicher Anbieter dieses Internetauftritts im datenschutzrechtlichen Sinne ist:</p> 
                  <p className="legalText">Timo Leal dos Reis<br></br>Münsterstr. 57<br></br>48308 Senden<br></br>Deutschland</p> 
                  <p className="legalText">E-Mail: ttechs.designs@gmail.com<br></br>(Bitte verwenden Sie "CoronaDigital Datenschutz" als Betreff, damit Ihre Mail zugeordnet werden kann.)</p> 
                  
                  <h2 className="legalHeader">II. Rechte der Nutzer und Betroffenen</h2> 
                  <p className="legalText">Mit Blick auf die nachfolgend noch näher beschriebene Datenverarbeitung haben die Nutzer und Betroffenen das Recht</p> 
                  <ul> 
                    <li className="legalText">auf Bestätigung, ob sie betreffende Daten verarbeitet werden, auf Auskunft über die verarbeiteten Daten, auf weitere Informationen über die Datenverarbeitung sowie auf Kopien der Daten (vgl. auch Art. 15 DSGVO);</li> 
                    <li className="legalText">auf Berichtigung oder Vervollständigung unrichtiger bzw. unvollständiger Daten (vgl. auch Art. 16 DSGVO);</li> 
                    <li className="legalText">auf unverzügliche Löschung der sie betreffenden Daten (vgl. auch Art. 17 DSGVO), oder, alternativ, soweit eine weitere Verarbeitung gemäß Art. 17 Abs. 3 DSGVO erforderlich ist, auf Einschränkung der Verarbeitung nach Maßgabe von Art. 18 DSGVO;</li> 
                    <li className="legalText">auf Erhalt der sie betreffenden und von ihnen bereitgestellten Daten und auf Übermittlung dieser Daten an andere Anbieter/Verantwortliche (vgl. auch Art. 20 DSGVO);</li> 
                    <li className="legalText">auf Beschwerde gegenüber der Aufsichtsbehörde, sofern sie der Ansicht sind, dass die sie betreffenden Daten durch den Anbieter unter Verstoß gegen datenschutzrechtliche Bestimmungen verarbeitet werden (vgl. auch Art. 77 DSGVO).</li> 
                  </ul> 
                  <p className="legalText">Darüber hinaus ist der Anbieter dazu verpflichtet, alle Empfänger, denen gegenüber Daten durch den Anbieter offengelegt worden sind, über jedwede Berichtigung oder Löschung von Daten oder die Einschränkung der Verarbeitung, die aufgrund der Artikel 16, 17 Abs. 1, 18 DSGVO erfolgt, zu unterrichten. Diese Verpflichtung besteht jedoch nicht, soweit diese Mitteilung unmöglich oder mit einem unverhältnismäßigen Aufwand verbunden ist. Unbeschadet dessen hat der Nutzer ein Recht auf Auskunft über diese Empfänger.</p> 
                  <p className="legalText"><strong>Ebenfalls haben die Nutzer und Betroffenen nach Art. 21 DSGVO das Recht auf Widerspruch gegen die künftige Verarbeitung der sie betreffenden Daten, sofern die Daten durch den Anbieter nach Maßgabe von Art. 6 Abs. 1 lit. f) DSGVO verarbeitet werden. Insbesondere ist ein Widerspruch gegen die Datenverarbeitung zum Zwecke der Direktwerbung statthaft.</strong></p> 
                  
                  <h2 className="legalHeader">III. Informationen zur Datenverarbeitung</h2> 
                  <p className="legalText">Ihre bei Nutzung unseres Internetauftritts verarbeiteten Daten werden gelöscht oder gesperrt, sobald der Zweck der Speicherung entfällt, der Löschung der Daten keine gesetzlichen Aufbewahrungspflichten entgegenstehen und nachfolgend keine anderslautenden Angaben zu einzelnen Verarbeitungsverfahren gemacht werden.</p>  
                  
                  <h3 className="legalHeader">Serverdaten</h3> 
                  <p className="legalText">Aus technischen Gründen, insbesondere zur Gewährleistung eines sicheren und stabilen Internetauftritts, werden Daten durch Ihren Internet-Browser an uns bzw. an unseren Webspace-Provider übermittelt. Mit diesen sog. Server-Logfiles werden u.a. Typ und Version Ihres Internetbrowsers, das Betriebssystem, die Website, von der aus Sie auf unseren Internetauftritt gewechselt haben (Referrer URL), die Website(s) unseres Internetauftritts, die Sie besuchen, Datum und Uhrzeit des jeweiligen Zugriffs sowie die IP-Adresse des Internetanschlusses, von dem aus die Nutzung unseres Internetauftritts erfolgt, erhoben.</p> 
                  <p className="legalText">Diese so erhobenen Daten werden vorrübergehend gespeichert, dies jedoch nicht gemeinsam mit anderen Daten von Ihnen.</p> 
                  <p className="legalText">Diese Speicherung erfolgt auf der Rechtsgrundlage von Art. 6 Abs. 1 lit. f) DSGVO. Unser berechtigtes Interesse liegt in der Verbesserung, Stabilität, Funktionalität und Sicherheit unseres Internetauftritts.</p> 
                  <p className="legalText">Die Daten werden spätestens nach sieben Tage wieder gelöscht, soweit keine weitere Aufbewahrung zu Beweiszwecken erforderlich ist. Andernfalls sind die Daten bis zur endgültigen Klärung eines Vorfalls ganz oder teilweise von der Löschung ausgenommen.</p>  
                  
                  <h3 className="legalHeader">Kontaktanfragen / Kontaktmöglichkeit</h3> 
                  <p className="legalText">Sofern Sie per Kontaktformular oder E-Mail mit uns in Kontakt treten, werden die dabei von Ihnen angegebenen Daten zur Bearbeitung Ihrer Anfrage genutzt. Die Angabe der Daten ist zur Bearbeitung und Beantwortung Ihre Anfrage erforderlich - ohne deren Bereitstellung können wir Ihre Anfrage nicht oder allenfalls eingeschränkt beantworten.</p> 
                  <p className="legalText">Rechtsgrundlage für diese Verarbeitung ist Art. 6 Abs. 1 lit. b) DSGVO.</p> 
                  <p className="legalText">Ihre Daten werden gelöscht, sofern Ihre Anfrage abschließend beantwortet worden ist und der Löschung keine gesetzlichen Aufbewahrungspflichten entgegenstehen, wie bspw. bei einer sich etwaig anschließenden Vertragsabwicklung.</p>  
                  
                  <h3 className="legalHeader">Google Fonts</h3> 
                  <p className="legalText">In unserem Internetauftritt setzen wir Google Fonts zur Darstellung externer Schriftarten ein. Es handelt sich hierbei um einen Dienst der Google Ireland Limited, Gordon House, Barrow Street, Dublin 4, Irland, nachfolgend nur „Google“ genannt.</p> 
                  <p className="legalText">Um die Darstellung bestimmter Schriften in unserem Internetauftritt zu ermöglichen, wird bei Aufruf unseres Internetauftritts eine Verbindung zu dem Google-Server in den USA aufgebaut.</p> 
                  <p className="legalText">Rechtsgrundlage ist Art. 6 Abs. 1 lit. f) DSGVO. Unser berechtigtes Interesse liegt in der Optimierung und dem wirtschaftlichen Betrieb unseres Internetauftritts.</p> 
                  <p className="legalText">Durch die bei Aufruf unseres Internetauftritts hergestellte Verbindung zu Google kann Google ermitteln, von welcher Website Ihre Anfrage gesendet worden ist und an welche IP-Adresse die Darstellung der Schrift zu übermitteln ist.</p> 
                  <p className="legalText">Google bietet unter</p> 
                  <p className="legalText"><a className="legalText" href="https://adssettings.google.com/authenticated" target="_blank" rel="noopener">https://adssettings.google.com/authenticated</a></p> <p><a className="legalText" href="https://policies.google.com/privacy" target="_blank" rel="noopener">https://policies.google.com/privacy</a></p> 
                  <p className="legalText">weitere Informationen an und zwar insbesondere zu den Möglichkeiten der Unterbindung der Datennutzung.</p>  
                  <p><a className="legalText" href="https://www.ratgeberrecht.eu/leistungen/muster-datenschutzerklaerung.html" target="_blank" rel="noopener">Muster-Datenschutzerklärung</a> der <a className="legalText" href="https://www.ratgeberrecht.eu/datenschutz/datenschutzerklaerung-generator-dsgvo.html" target="_blank" rel="noopener">Anwaltskanzlei Weiß &amp; Partner</a></p> 

                  <h3 className="legalHeader">Robert Koch-Institut API (v2)</h3> 
                  <p className="legalText">In unserem Internetauftritt setzen wir auf Datenquellen Dritter. Dazu wird die von Ihnen getätigt Eingabe im "Postleitzahl"-Feld nach dem Klick auf das "Suchen"-Symbol an einen Server Dritter gesendet.</p> 
                  <p className="legalText">Diese so erhobenen Daten werden vorrübergehend gespeichert, dies jedoch nicht gemeinsam mit anderen Daten von Ihnen.</p> 
                  <p className="legalText">Diese Speicherung erfolgt auf der Rechtsgrundlage von Art. 6 Abs. 1 lit. f) DSGVO. Unser berechtigtes Interesse liegt in der Funktionalität unseres Internetauftritts.</p>
                  <p className="legalText">Da der Server Dritten unterliegt, haben wir keinen Einfluss auf die Speicherung und Verarbeitung der übermittelten Daten.</p> 
                  <p className="legalText">Der Quellcode des Servers ist jedoch unter "CC BY 4.0" lizensiert, sodass es Ihnen möglich ist die Verarbeitung und Speicherung der übermittelten Daten nachzuvollziehen.</p>
                  <p className="legalText">Dieser kann unter folgender Adresse eingesehen werden: <a className="legalText" href="https://github.com/marlon360/rki-covid-api" target="_blank" rel="noopener">Robert Koch-Institut API (v2)</a></p> 
                </div>

            </div>
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
          <DistrictDay 
            scope = {this.props.scope} 
            handleScopeToggle={this.handleScopeToggle} 
            districtName={this.props.districtName} 
            data={this.props.districtDay}
            cases = {this.props.districtMonthCases[this.props.districtMonthCases.length-1]["cases"]}
            recovered = {this.props.districtMonthRecovered[this.props.districtMonthRecovered.length-1]["recovered"]} 
            deaths = {this.props.districtMonthDeaths[this.props.districtMonthDeaths.length-1]["deaths"]} 
            />
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
    {console.log(this.props.cases)}
    return (
      <div className="contentContainer">
        <p className="districtDayHeader" style={{marginTop: "0", paddingTop: "10%"}}>Übersicht der heutigen Zahlen für <button className="toggleButton" onClick={this.handleScopeToggle}>{this.props.scope == "district" ? this.props.districtName : "Deuschland"}</button></p>
        {/* <p className="districtDay">Fälle: {this.props.data["cases"]}</p>
        <p className="districtDay">Genesen: {this.props.data["recovered"]}</p>
        <p className="districtDay">Todesfälle: {this.props.data["deaths"]}</p> */}
        <div className="quickviewWrapper">
          <div className="quickviewContainer"> 
            <p className="districtDay">Neue Fälle: {this.props.cases}</p>
            <p className="districtDay">Genesene Personen: {this.props.recovered}</p>
            <p className="districtDay">Todesfälle: {this.props.deaths}</p>
            <p className="districtDay">7-Tage Inzidenz: ~{Math.round((this.props.data["weekIncidence"] + Number.EPSILON) * 100) / 100}</p>
          </div>
        </div>

        {/* <p className="districtDay">Fälle pro 100.000: {this.props.data["casesPer100k"]}</p> */}
        
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


        {/* Incidence */}
        <p className="plotHeader" style={{paddingTop: "1em"}}>Inzidenz</p>
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
                <Line type="monotone" dot={false} dataKey="Inzidenz" stroke="#465973" isAnimationActive={!isMobile} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="plotSpacerWrapper">
          <div className="plotSpacerTop"></div>
          <div className="plotSpacerBottom"></div>
        </div>


        {/* Per Day Statistics */}
        <p className="plotHeader">Fallzahlen pro Tag</p>
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
                <Bar dataKey="Neue Fälle" fill="#465973" isAnimationActive={!isMobile}/>
                <Bar dataKey="Genesene Personen" fill="#6181b0" isAnimationActive={!isMobile}/>
                <Bar dataKey="Todesfälle" fill="#202936" isAnimationActive={!isMobile}/>
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
                <Line type="monotone" dot={false} dataKey="Fälle" stroke="#465973" isAnimationActive={!isMobile}/>
                <Line type="monotone" dot={false} dataKey="Genesene Personen" stroke="#6181b0" isAnimationActive={!isMobile}/>
                <Line type="monotone" dot={false} dataKey="Todesfälle" stroke="#202936" isAnimationActive={!isMobile}/>
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
                      <Line type="monotone" dot={false} dataKey="Erste Impfung" stroke="#465973" isAnimationActive={!isMobile}/>
                      <Line type="monotone" dot={false} dataKey="Zweite Impfung" stroke="#6181b0" isAnimationActive={!isMobile}/>
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
            

            :
            null

        }

        <div className="plotSpacerWrapper" style={{paddingTop: "20%"}}>
          <div className="plotSpacerTop"></div>
          <div className="plotSpacerBottom"></div>
        </div>
        <p className="districtDayHeader" style={{textDecoration: "underline", color: "var(--primary)"}}>Disclaimer</p>
        <p className="disclaimerText">Tagesaktuelle Daten werden regelmäßig aktualisiert, wenn nachträglich neue Daten für ein Datum in der Vergangenheit von den Gesundheitsämtern übermittelt werden.</p>
        <p className="disclaimerText">Dementsprechend fallen die finalen Zahlen im laufe der Zeit häufig höher aus, als sie am jeweiligen Tag angegeben wurden.</p>
        <p className="disclaimerText">Alle Daten werden um 10:00 Uhr, des jeweiligen Tages aktualisiert. Tagesdaten beziehen sich immer auf den vorangegangenen Tag.</p>
        <p className="disclaimerText">Alle Angaben ohne Gewähr.</p>
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
