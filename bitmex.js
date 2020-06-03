const fetch = require('node-fetch');

var fetchData = []

function sleep(millis) {
  return new Promise(resolve => setTimeout(resolve, millis));
}

function fetchBitMex(startTime) {
  var url = "https://www.bitmex.com/api/v1/trade?symbol=.BVOL&count=1000&columns=price"
  if (startTime) {
    url += "&startTime=" + startTime
  }
  console.log(url)
  fetch(url, {
    headers: {"content-type": "application/json"},
    mode: "no-cors"
  }).then(response => {
    return response.json()
  }).then(data => {
    if (Array.isArray(data)) {
      if (startTime) {
        // if there's a startTime, exclude the first element
        fetchData = fetchData.concat(data.slice(1))
      } else {
        fetchData = fetchData.concat(data)
      }
      if (data[data.length-1]["timestamp"] == startTime) {
        console.log(fetchData.length)
        console.log(JSON.stringify(fetchData))
      } else {
        fetchBitMex(data[data.length-1]["timestamp"])
      }
    } else {
      if (data["error"]) {
        sleep(5000).then(() => {
          fetchBitMex(startTime)
        })
      }
    }
  })
}

//fetchBitMex("2020-05-13T12:00:00.000Z")

fetchBitMex()