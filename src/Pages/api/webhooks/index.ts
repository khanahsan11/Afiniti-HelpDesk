import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id } = req.query;

  switch (req.method) {
    case "DELETE":
      return deleteWebhook(req, res, id as string);
    default:
      return res.status(405).json({ message: "Method not allowed" });
  }
}

async function deleteWebhook(
  req: NextApiRequest,
  res: NextApiResponse,
  id: string
) {
  try {
    // First get the webhook to access the access token and webhookId
    const webhook = await prisma.webhook.findUnique({
      where: { id },
    });

    if (!webhook) {
      return res.status(404).json({ message: "Webhook not found" });
    }

    if (!webhook.webhookId) {
      await prisma.webhook.delete({ where: { id } });
      return res.status(204).end();
    }

    // Delete from Webex first
    const webexResponse = await fetch(
      `https://webexapis.com/v1/webhooks/${webhook.webhookId}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${webhook.accessToken}`,
        },
      }
    );

    if (!webexResponse.ok && webexResponse.status !== 404) {
      const error = await webexResponse.json();
      throw new Error(error.message || "Failed to delete Webex webhook");
    }

    // Then delete from our database
    await prisma.webhook.delete({ where: { id } });
    return res.status(204).end();
  } catch (error) {
    if (error instanceof Error) {
      return res.status(400).json({ message: error.message });
    }
  }
  return res.status(500).json({ message: "An unexpected error occurred" });
}
