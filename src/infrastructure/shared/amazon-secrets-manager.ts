import {
  SecretsManagerClient,
  GetSecretValueCommand,
} from '@aws-sdk/client-secrets-manager';

export class AmazonSecretsManager {
  public static async getSecret(awsAccessKeyId: string, awsSecretAccessKey: string, secretName: string, region: string) {
    const credentials = {
      accessKeyId: awsAccessKeyId,
      secretAccessKey: awsSecretAccessKey,
  }
    const client = new SecretsManagerClient({
      credentials: credentials,
      region: region,
    });
    let response;
    try {
      response = await client.send(
        new GetSecretValueCommand({
          SecretId: secretName,
          VersionStage: "AWSCURRENT",
        })
      );
    } catch (error) {
      throw error;
    }
    const secret = response.SecretString;
    return secret;
  }
}
