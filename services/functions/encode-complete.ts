import {
  SFNClient,
  SendTaskSuccessCommand,
  SendTaskFailureCommand,
} from "@aws-sdk/client-sfn";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, GetCommand } from "@aws-sdk/lib-dynamodb";

const ddb = DynamoDBDocumentClient.from(
  new DynamoDBClient({ region: process.env.AWS_REGION })
);

const sfn = new SFNClient({ region: process.env.AWS_REGION });

export const handler = async (event: any, context: any) => {
  console.log(JSON.stringify(event), 0, null);
  console.log(JSON.stringify(context), 0, null);

  const task: any = await ddb.send(
    new GetCommand({
      TableName: process.env.taskTable,
      Key: {
        jobId: event.detail.userMetadata.jobId,
      },
    })
  );
  console.log(task);
  const token = task.Item.taskToken;

  console.log(`Task token from MC job event: ${token}`);

  if (event.detail.status === "COMPLETE") {
    console.log("Sending task complete");
    await sfn.send(
      new SendTaskSuccessCommand({
        taskToken: token,
        output: JSON.stringify(event),
      })
    );
  } else {
    console.log("Sending task errored");
    await sfn.send(
      new SendTaskFailureCommand({
        taskToken: token,
        error: "MediaConvert Job Failed",
        cause: event.detail.errorMessage,
      })
    );
  }
};
