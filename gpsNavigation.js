const AWS = require('aws-sdk');

var dynamodb = new AWS.DynamoDB();
let counter = 0;
let c = 0;
let t = 0;
let b = 0;
let m = 0;
let ct = c;
let tt = t;
let bt = b;
let mt = m;
let temp = 0;
// let trafficLightOneList = { "Cars": { "N": c.toString() } , { "Trucks": { "N": t.toString() } , { "Buses": { "N": b.toString() } , { "Motorcycles": { "N": m.toString() } };

exports.handler = (event, context, callback) => {
    console.log(event);

    let httpMethod;
    let path;
    const routeKey = event.requestContext.routeKey;
    console.log("Route Key: " + routeKey);

    if (routeKey == "$default") {
        return new Error("Shouldn't have reached this part of code. Please investigate! 1");
    } else {
        const routeKeyArray = routeKey.split(' ');
        httpMethod = routeKeyArray[0];
        path = routeKeyArray[1];
    }

    console.log(httpMethod);
    console.log(path);

    let body;
    let statusCode = '200';
    const headers = {
        'Content-Type': 'application/json',
    };

    switch (path) {

        case '/trafficLightOne':
            switch (httpMethod) {
                case 'GET':

                    dynamodb.scan({
                        TableName: "trafficLightOne"
                    }, function (err, data) {
                        if (err) {
                            console.log(err, err.stack); // an error occurred
                        }
                        else {
                            console.log(JSON.stringify(data));           // successful response

                            let returnItems = [];

                            for (let item of data.Items) {

                                let returnItem = {
                                    id: item.Id.S,
                                    light: item.LightAngle.S,
                                    cars: counter,
                                    caremission: item.caremission.S,
                                    roadConditions: item.roadCondition.S,
                                    smoothness: item.smoothness.S,
                                    temp: item.temperature.S,
                                    tempRating: item.tempRating.S,
                                    time: item.timeWaited.S,
                                    timeRate: item.timeRating.S


                                };

                                returnItems.push(returnItem);
                            }

                            body = JSON.stringify(returnItems);

                            const response = {
                                statusCode,
                                body,
                                headers,
                            };


                            return callback(null, response);
                        }
                    });
                    break;



                case 'POST':
                    let requestBody = JSON.parse(event.body);
                    let id = requestBody.id;
                    let name = requestBody.name;
                    let temperature = requestBody.temperature;
                    let condition = requestBody.condition;
                    let time = requestBody.time;
                    let light = requestBody.light;
                    let smoothness;
                    let tempRating;
                    let timeRating;
                    let emissionnumber;
                    let emissionstatus;
                    counter++;

                    emissionnumber = (c * 1 + m * 2 + t * 3 + b * 4);
                    if (emissionnumber >= 45) {
                        emissionstatus = "Bad, High Congestion";
                    }
                    if (emissionnumber > 20 && emissionnumber < 45) {
                        emissionstatus = "Ok, Medium Congestion";
                    }
                    if (emissionnumber <= 20) {
                        emissionstatus = "Good, Low Congestion";
                    }

                    if (temp != id) {
                        c = 0;
                        t = 0;
                        b = 0;
                        m = 0;
                    }
                    temp = id;
                    if (time <= 12) {
                        timeRating = "Good";
                    }
                    if (time > 12 && time < 20) {
                        timeRating = "Ok";
                    }
                    if (time >= 20) {
                        timeRating = "Bad";
                    }
                    if (temperature >= 80) {
                        tempRating = "High: caution time low";
                    }
                    if (temperature >= 50 && temperature <= 80) {
                        tempRating = "Medium: caution time medium";
                    }
                    if (temperature < 50) {
                        tempRating = "Low: caution time high";
                    }

                    if (condition.substring(0, 4) == "Rain" && condition.substring(7) == "Paved") {
                        smoothness = "Very smooth";
                    }
                    if (condition.substring(0, 4) == "Rain" && condition.substring(7) != "Paved") {
                        smoothness = "Smooth";
                    }
                    if (condition.substring(0, 4) != "Rain" && condition.substring(10) == "Paved") {
                        smoothness = "Smooth";
                    }
                    if (condition.substring(0, 4) != "Rain" && condition.substring(7) != "Paved") {
                        smoothness = "Not Smooth";
                    }
                    if (name == "C") {
                        c++;
                    }
                    if (name == "T") {
                        t++;
                    }
                    if (name == "B") {
                        b++;
                    }
                    if (name == "M") {
                        m++;
                    }

                    dynamodb.putItem({
                        Item: {
                            "Id": {
                                "S": id
                            },
                            "LightAngle": {
                                "S": light
                            },
                            "allCars": {
                                "M": {
                                    "Cars": {
                                        "S": c.toString()
                                    },
                                    "Trucks": {
                                        "S": t.toString()
                                    },
                                    "Buses": {
                                        "S": b.toString()
                                    },
                                    "Motorcycles": {
                                        "S": m.toString()
                                    }
                                }
                            },
                            "typeOfVehicle": {
                                "S": name
                            },
                            "roadCondition": {
                                "S": condition
                            },
                            "temperature": {
                                "S": temperature
                            },
                            "timeWaited": {
                                "S": time
                            },
                            "timeRating": {
                                "S": timeRating
                            },
                            "caremission": {
                                "S": emissionstatus
                            },
                            "smoothness": {
                                "S": smoothness
                            },
                            "tempRating": {
                                "S": tempRating
                            },



                        },
                        ConditionExpression: "attribute_not_exists(Pk)",
                        TableName: "trafficLightOne"
                    }, function (err, data) {
                        if (err) {
                            console.log(err, err.stack); // an error occurred
                        }
                        else {
                            body = {
                                "message": "Success"
                            };

                            statusCode = 201;

                            const response = {
                                statusCode,
                                body,
                                headers,
                            };

                            return callback(null, response);
                        }
                    });
                    break;
                default:
                    throw new Error(`Unsupported method "${event.httpMethod}"`);
            }
            break;
        case '/trafficLightOne/{trafficLightOneId}':
            let trafficLightOneId = event.pathParameters.trafficLightOneId.trim().toLowerCase();
            switch (httpMethod) {
                case 'GET':
                    dynamodb.getItem({
                        Key: {
                            "Id": {
                                "S": trafficLightOneId
                            }
                        },
                        TableName: "trafficLightOne"
                    }, function (err, data) {
                        if (err) {
                            console.log(err, err.stack); // an error occurred
                        }
                        else {
                            console.log(JSON.stringify(data));           // successful response

                            let returnItem = {
                                id: data.Item.Id.S,
                                light: data.Item.LightAngle.S,
                                cars: counter,
                                caremission: data.Item.caremission.S,
                                roadConditions: data.Item.roadCondition.S,
                                smoothness: data.Item.smoothness.S,
                                temp: data.Item.temperature.S,
                                tempRating: data.Item.tempRating.S,
                                time: data.Item.timeWaited.S,
                                timeRate: data.Item.timeRating.S
                            };

                            body = JSON.stringify(returnItem);

                            const response = {
                                statusCode,
                                body,
                                headers,
                            };

                            return callback(null, response);
                        }
                    });
                    break;
                case 'DELETE':
                    dynamodb.deleteItem({
                        Key: {
                            "Id": {
                                "S": trafficLightOneId
                            }
                        },
                        TableName: "trafficLightOne"
                    }, function (err, data) {
                        if (err) {
                            console.log(err, err.stack); // an error occurred
                        }
                        else {
                            console.log(JSON.stringify(data));           // successful response

                            let returnItem = {
                                id: data.Item.Id.S,
                                name: data.Item.Name.S,
                            };

                            body = JSON.stringify(returnItem);

                            const response = {
                                statusCode,
                                body,
                                headers,
                            };

                            return callback(null, response);
                        }
                    });
                    break;
                default:
                    throw new Error(`Unsupported method "${event.httpMethod}"`);
            }
            break;

    }
};