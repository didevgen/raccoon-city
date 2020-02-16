import AWS from 'aws-sdk';
import * as winston from 'winston';
import WinstonCloudWatch from 'winston-cloudwatch';

AWS.config.update({
    region: 'eu-central-1'
});

export const logger = winston.createLogger({
    format: winston.format.json(),
    transports: [
        new winston.transports.File({filename: 'error.log', level: 'error'}),
        new winston.transports.Console({
            format: winston.format.simple()
        })
    ]
});

if (process.env.NODE_ENV === 'production') {
    logger.add(
        new WinstonCloudWatch({
            cloudWatchLogs: new AWS.CloudWatchLogs(),
            logGroupName: 'raccoon-city-log-group',
            logStreamName: 'first'
        })
    );
}

