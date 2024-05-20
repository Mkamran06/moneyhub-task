const http = require('http');

function jsonToCsv(data, companyMap) {
  const headers = ["User", "First Name", "Last Name", "Date", "Holding", "Value"];
  let csv = headers.join(",") + "\n";

  data.forEach(investment => {
    investment.holdings.forEach(holding => {
      const companyName = companyMap[holding.id] ? companyMap[holding.id].name : "Unknown";
      const value = investment.investmentTotal * holding.investmentPercentage;
      const rowData = [
        investment.userId,
        investment.firstName,
        investment.lastName,
        investment.date,
        companyName,
        value
      ];
      
      csv += rowData.join(",") + "\n";
    });
  });
  
  return csv;
}

function fetchData(url) {
  return new Promise((resolve, reject) => {
    http.get(url, (response) => {
      let data = '';

      response.on('data', (chunk) => {
        data += chunk;
      });

      response.on('end', () => {
        resolve(JSON.parse(data));
      });
    }).on('error', (error) => {
      reject(error);
    });
  });
}

function sendCsvReport(url, csvData) {
  return new Promise((resolve, reject) => {
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    };

    const req = http.request(url, options, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        resolve({
          statusCode: res.statusCode,
          body: data
        });
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    req.write(JSON.stringify({ csv: csvData }));
    req.end();
  });
}

module.exports = { jsonToCsv, fetchData, sendCsvReport };
