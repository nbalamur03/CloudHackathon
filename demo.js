const AWS = require('aws-sdk');

var dynamodb = new AWS.DynamoDB();


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

        case '/students':
            switch (httpMethod) {
                case 'GET':

                    dynamodb.scan({
                        TableName: "Students"
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
                                    name: item.Name.S,
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

                    dynamodb.putItem({
                        Item: {
                            "Id": {
                                "S": id
                            },
                            "Name": {
                                "S": name
                            },
                        },
                        ConditionExpression: "attribute_not_exists(Pk)",
                        TableName: "Students"
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
                case 'PUT':

                    let tablename = requestBody.tablename;
                    dynamodb.createTable({
                        AttributeDefinitions: [
                            {
                                AttributeName: "Name",
                                AttributeType: "S"
                            },
                        ],
                        KeySchema: [
                            {
                                Attributename: "Name",
                                KeyType: "HASH"
                            },
                        ],
                        ProvisionedThroughput: {
                            ReadCapacityUnits: 5,
                            WriteCapacityUnits: 5
                        },
                        TableName: tablename

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
        case '/students/{studentId}':
            let studentId = event.pathParameters.studentId.trim().toLowerCase();
            switch (httpMethod) {
                case 'GET':
                    dynamodb.getItem({
                        Key: {
                            "Id": {
                                "S": studentId
                            }
                        },
                        TableName: "Students"
                    }, function (err, data) {
                        if (err) {
                            console.log(err, err.stack); // an error occurred
                        }
                        else {
                            console.log(JSON.stringify(data));           // successful response

                            let returnItem = {
                                id: data.Item.Id.S,
                                name: data.Item.Name.S
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
                                "S": studentId
                            }
                        },
                        TableName: "Students"
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
        case '/courses':
            switch (httpMethod) {
                case 'GET':
                    dynamodb.scan({
                        TableName: "Students"
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
                                    name: item.Name.S,
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
                    let credits = requestBody.credits;
                    let name = requestBody.name;

                    dynamodb.putItem({
                        Item: {
                            "Id": {
                                "S": id,
                            },
                            "Name": {
                                "S": name
                            },
                            "Credits": {
                                "N": credits
                            }
                        },
                        ConditionExpression: "attribute_not_exists(Pk)",
                        TableName: "Courses"
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

        case '/courses/{courseId}':
            let courseId = event.pathParameters.courseId.trim().toLowerCase();
            switch (httpMethod) {
                case 'GET':
                    dynamodb.getItem({
                        Key: {
                            "Id": {
                                "S": courseId
                            }
                        },
                        TableName: "Courses"
                    }, function (err, data) {
                        if (err) {
                            console.log(err, err.stack); // an error occurred
                        }
                        else {
                            console.log(JSON.stringify(data));           // successful response

                            let returnItem = {
                                id: data.Item.Id.S,
                                name: data.Item.Name.S,
                                credits: Number.parseInt(data.Item.Credits.N)
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
                                "S": courseId
                            }
                        },
                        TableName: "Courses"
                    }, function (err, data) {
                        if (err) {
                            console.log(err, err.stack); // an error occurred
                        }
                        else {
                            console.log(JSON.stringify(data));           // successful response

                            let returnItem = {
                                id: data.Item.Id.S,
                                name: data.Item.Name.S,
                                credits: Number.parseInt(data.Item.Credits.N)
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