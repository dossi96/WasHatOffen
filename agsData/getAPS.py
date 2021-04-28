import requests
import json


def requestData() :
    res = requests.get("https://api.corona-zahlen.org/districts")
    response = res.json()

    with open('C:/Users/dosre/Desktop/Coding/Corona Website/allAGS.json', 'w', encoding='utf-8') as f:
        json.dump(response, f, indent=4, ensure_ascii=False)


def convertData():
    with open('C:/Users/dosre/Desktop/Coding/Corona Website/allAGS.json', 'r', encoding= 'utf-8') as f:
        # dataJson = json.load(fp)["data"].encode('utf-8')
        dataJson = json.load(f)["data"]

    output = {"agsData": []}
    for key in dataJson.keys():
        element = {}

        element["name"] = dataJson[key]["name"]
        element["county"] = dataJson[key]["county"]
        element["ags"] = dataJson[key]["ags"]
        
        output["agsData"].append(element)

    with open('C:/Users/dosre/Desktop/Coding/Corona Website/agsData.json', 'w', encoding='utf-8') as f:
        json.dump(output, f, indent=4, ensure_ascii=False)


convertData()