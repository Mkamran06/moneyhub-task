const express = require("express")
const bodyParser = require("body-parser")
const config = require("config")
const request = require("request")
const R = require("ramda");
const { jsonToCsv, fetchData, sendCsvReport } = require("../utils");

const app = express()

app.use(bodyParser.json({limit: "10mb"}))

app.get("/investments/:id", (req, res) => {
  const {id} = req.params
  request.get(`${config.investmentsServiceUrl}/investments/${id}`, (e, r, investments) => {
    if (e) {
      console.error(e)
      res.send(500)
    } else {
      res.send(investments)
    }
  })
})

app.get("/generate-csv-report", async (req, res) => {
  try {
    const investments = await fetchData(`${config.investmentsServiceUrl}/investments`);
    const companies = await fetchData(`${config.financialCompaniesServiceUrl}/companies`);
    const companyMap = R.indexBy(R.prop('id'), companies);
    const csvData = jsonToCsv(investments, companyMap);
    const response = await sendCsvReport(`${config.investmentsServiceUrl}/investments/export`, csvData);

    if (response.statusCode === 204) {
      console.log("CSV report sent successfully");
      return res.status(200).send("CSV report generated and sent successfully");
    } else {
      return res.status(500).send("Internal Server Error");
    }
  } catch (error) {
    console.error("Error generating and sending CSV report", error);
    return res.status(500).send("Internal Server Error");
  }
});

app.listen(config.port, (err) => {
  if (err) {
    console.error("Error occurred starting the server", err)
    process.exit(1)
  }
  console.log(`Server running on port ${config.port}`)
})

module.exports = app;
