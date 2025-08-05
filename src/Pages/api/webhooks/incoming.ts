import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
//import { WebhookEvent } from '@clerk/nextjs/server';

const prisma = new PrismaClient();

type WebexWebhookPayload = {
  id: string;
  resource: "messages" | "memberships" | "rooms" | "attachmentActions";
  event: "created" | "updated" | "deleted";
  data: any;
  actorId?: string;
  orgId?: string;
  created: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    // Verify the webhook secret if configured
    const secret = req.headers["x-spark-signature"];
    if (process.env.WEBEX_WEBHOOK_SECRET && !secret) {
      return res.status(401).json({ message: "Missing signature header" });
    }

    const payload: WebexWebhookPayload = req.body;
    const webhookId =
      (req.headers["x-spark-webhook-id"] as string) || "unknown";

    // Log the webhook event
    const logEntry = await prisma.webhookLog.create({
      data: {
        webhookId,
        payload,
        status: "received",
      },
    });

    try {
      // Process the webhook based on resource and event
      let processingResult;
      const { resource, event, data } = payload;

      // ===== WEBHOOK PROCESSING LOGIC =====
      switch (resource) {
        case "messages":
          if (event === "created") {
            // Handle new message
            processingResult = await handleNewMessage(data);
          }
          break;

        case "memberships":
          if (event === "created") {
            // Handle new member
            processingResult = await handleNewMember(data);
          }
          break;

        case "rooms":
          if (event === "created") {
            // Handle new room
            processingResult = await handleNewRoom(data);
          }
          break;

        case "attachmentActions":
          if (event === "created") {
            // Handle card action
            processingResult = await handleCardAction(data);
          }
          break;

        default:
          throw new Error(`Unsupported resource type: ${resource}`);
      }

      // Update log status to success
      await prisma.webhookLog.update({
        where: { id: logEntry.id },
        data: {
          status: "processed",
          payload: {
            ...payload,
            processingResult,
          },
        },
      });

      return res.status(200).json({
        message: "Webhook processed successfully",
        result: processingResult,
      });
    } catch (processingError) {
      // Update log status to failed
      await prisma.webhookLog.update({
        where: { id: logEntry.id },
        data: {
          status: "failed",
          payload: {
            ...payload,
            error:
              processingError instanceof Error
                ? processingError.message
                : "Unknown processing error",
          },
        },
      });

      return res.status(500).json({
        message: "Error processing webhook",
        error: processingError,
      });
    }
  } catch (error) {
    console.error("Error handling webhook:", error);
    return res.status(500).json({
      message: "Internal server error",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
}

// ===== PROCESSING FUNCTIONS =====
async function handleNewMessage(data: any) {
  const message = {
    id: data.id,
    roomId: data.roomId,
    personId: data.personId,
    text: data.text,
    created: new Date(data.created),
  };

  // 1. Store message in database
  await prisma.chatMessage.create({
    data: {
      messageId: message.id,
      roomId: message.roomId,
      personId: message.personId,
      content: message.text,
      createdAt: message.created,
    },
  });

  // 2. Check/create chat request
  const existingRequest = await prisma.chatRequest.findFirst({
    where: { roomId: message.roomId },
  });

  if (!existingRequest) {
    // Get person details from Webex API
    const personResponse = await fetch(
      `https://webexapis.com/v1/people/${message.personId}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.WEBEX_ACCESS_TOKEN}`,
        },
      }
    );

    const personData = await personResponse.json();

    await prisma.chatRequest.create({
      data: {
        roomId: message.roomId,
        personEmail: personData.emails[0],
        status: "unassigned",
        latestMessage: message.text,
      },
    });
  }

  return { action: "message_processed", messageId: message.id };
}

async function handleNewMember(data: any) {
  // Handle new member added to space
  await prisma.spaceMember.create({
    data: {
      membershipId: data.id,
      personId: data.personId,
      personEmail: data.personEmail,
      roomId: data.roomId,
      isModerator: data.isModerator || false,
      created: new Date(data.created),
    },
  });

  return { action: "member_added", membershipId: data.id };
}

async function handleNewRoom(data: any) {
  // Handle new space created
  await prisma.space.create({
    data: {
      roomId: data.id,
      title: data.title,
      type: data.type,
      created: new Date(data.created),
      lastActivity: new Date(data.lastActivity),
    },
  });

  return { action: "room_created", roomId: data.id };
}

async function handleCardAction(data: any) {
  // Handle card action submissions
  await prisma.cardAction.create({
    data: {
      actionId: data.id,
      type: data.type,
      messageId: data.messageId,
      inputs: data.inputs,
      personId: data.personId,
      roomId: data.roomId,
      createdAt: new Date(data.created),
    },
  });

  return {
    action: "card_action_processed",
    actionId: data.id,
    type: data.type,
  };
}
