const fetch = require('node-fetch');

var fetchData = []

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
      if (data.length == 0) {
        console.log(fetchData.length)
        console.log(JSON.stringify(fetchData))
      } else {
        fetchBitMex(data[data.length-1]["timestamp"])
      }
    } else {
      console.log(data)
      console.log(JSON.stringify(fetchData))
    }
  })
}

fetchBitMex("2020-03-25T12:00:00.000Z")