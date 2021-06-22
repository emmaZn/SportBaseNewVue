const functions = require("firebase-functions").region("europe-west1");
const {
  google
} = require("googleapis");
const request = require("request");
const axios = require("axios");
const cors = require("cors")({
  origin: true
});

var ggfitData = new Object();


// app.get('/:id', (req, res) => res.send());

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//

exports.getLink = functions.https.onRequest((req, res) => {
    cors(req, res, () => {
      const oauth2Client = new google.auth.OAuth2(
        "329953458846-g91hdj53b2ojs8ck775r7h77c98tm5ql.apps.googleusercontent.com",
        "C-4DybcdMnORlveADEuoDaXn",
        "http://localhost:8080"
      );
      const scopes = ["https://www.googleapis.com/auth/fitness.heart_rate.read",
        "https://www.googleapis.com/auth/fitness.activity.read",
      ];

      const url = oauth2Client.generateAuthUrl({
        access_type: "offline",
        scope: scopes,
        state: JSON.stringify({
          callbackUrl: req.body.callbackUrl,
          userID: req.body.userid,
        }),
      });
      request(url, (err, response) => {
        console.log("error: ", err);
        console.log("statCode: ", response && response.statusCode);
        res.send({
          url
        });
      });
    });
  });

exports.postData = functions.https.onRequest(async (req, res) => {
    cors(req, res, async () => {

      const oauth2Client = new google.auth.OAuth2(
        '329953458846-g91hdj53b2ojs8ck775r7h77c98tm5ql.apps.googleusercontent.com',
        'C-4DybcdMnORlveADEuoDaXn',
        "http://localhost:8080"
      )
      const tokens = await oauth2Client.getToken(req.body.code)
      const result = await axios({
        method: 'GET',
        headers: {
          'Authorization': 'Bearer ' + tokens.tokens.access_token
        },
        "Content-Type": "application/json",
        url: `https://www.googleapis.com/fitness/v1/users/me/dataSources`,
      })
      let dataSource = result.data.dataSource
      dataSource.forEach(async data => {
        if (
          data.dataType.name == "com.google.calories.expended" ||
          data.dataType.name == "com.google.heart_rate.bpm") {
          const dataType = data.dataType.name
          const dataSet = await axios({
            method: 'POST',
            headers: {
              'Authorization': 'Bearer ' + tokens.tokens.access_token
            },
            "Content-Type": "application/json",
            url: `https://www.googleapis.com/fitness/v1/users/me/dataset:aggregate`,
            data: {
              aggregateBy: [{
                dataTypeName: data.dataType.name,
                dataSourceId: data.dataStreamId,
              }],
              bucketByTime: {
                durationMillis: req.body.endTimeMillis - req.body.startTimeMillis //86400000 jour
              },
              startTimeMillis: req.body.startTimeMillis,
              endTimeMillis: req.body.endTimeMillis
            }
          })
          let d = dataSet.data.bucket[0].dataset[0]
          d.point.forEach((point) => {
            if (dataType == "com.google.calories.expended") {
              ggfitData.calories = (point.value)
            }
            if (dataType == "com.google.heart_rate.bpm") {
              ggfitData.bpm = (point.value)
            }
          });

          if (ggfitData.bpm && ggfitData.calories) {
            return res.send(ggfitData)
          }
        }
      });
    });
  });