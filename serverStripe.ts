// src/webhook/webhook.controller.ts
import { Controller, Post, Headers, Body, BadRequestException } from '@nestjs/common';
import { Stripe } from 'stripe';

@Controller('webhook')
export class WebhookController {
  private stripe: Stripe;
  private readonly endpointSecret: string;

  constructor() {
    // Initialize Stripe with your test secret key
    this.stripe = new Stripe('sk_test_51OkCXdHWMYTqMLlBoPKRPMaAS5zf5IMHKZIoEGFJ4CrsVi7CGBy1NjQhMxYvYTZaWQn9xmQocwuFqXVisFsjUy8a002Z693HrA', {
      apiVersion: '2023-10-16', // Ensure this is the appropriate API version
    });

    // This is your Stripe CLI webhook secret for testing your endpoint locally.
    this.endpointSecret = 'whsec_186708cba4044c5bbc3536e7346dacc451ce9d49f7c343804071403d35a370c6';
  }

  @Post()
  async handleWebhook(@Headers('stripe-signature') signature: string, @Body() payload: any): Promise<void> {
    try {
      // Construct the event
      const event = this.stripe.webhooks.constructEvent(payload, signature, this.endpointSecret);

      // Handle the event
      switch (event.type) {
        case 'payment_intent.succeeded':
          const paymentIntentSucceeded = event.data.object;
          // Call a function to handle the event payment_intent.succeeded
          console.log(paymentIntentSucceeded);
          break;
        // Handle other event types
        default:
          console.log(`Unhandled event type ${event.type}`);
      }
    } catch (error) {
      throw new BadRequestException(`Webhook Error: ${error}`);
    }
  }
}

