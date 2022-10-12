import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";

const ddb = DynamoDBDocumentClient.from(
  new DynamoDBClient({ region: process.env.AWS_REGION })
);

export const handler = async (event: any, context: any) => {
  console.log(JSON.stringify(event), 0, null);
  console.log(JSON.stringify(context), 0, null);

  const jobId = event.input.jobId;

  console.log(
    `Pretend we created a MC job here. Task Token: ${event.taskToken}`
  );

  await ddb.send(
    new PutCommand({
      TableName: process.env.taskTable,
      Item: {
        jobId: jobId,
        taskToken: event.taskToken,
      },
    })
  );
};
