// components/SquareCardForm.tsx
import React, { useState } from "react";
import { useSquareSDK } from "@/hooks/useSquareSDK";
import { toast } from "@/hooks/use-toast";

interface SquareCardFormProps {
  amount: number; // in USD
}

export default function SquareCardForm({ amount }: SquareCardFormProps) {
  const { sdkStatus, cardRef, card, isSecureConnection } = useSquareSDK({});
  const [submitting, setSubmitting] = useState(false);

  const handlePay = async () => {
    try {
      if (!card) throw new Error("Card not ready");
      setSubmitting(true);

      // Tokenize the card
      const result = await card.tokenize();
      if (result.status !== "OK") {
        throw new Error(result.errors?.[0]?.message || "Tokenization failed");
      }

      // Process payment via Supabase Edge Function
      const resp = await fetch(
        "https://ibdjzzgvxlscmwlbuewd.functions.supabase.co/square-payments",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: "process_payment",
            sourceId: result.token,
            amount,
          }),
        }
      );

      const json = await resp.json();
      if (!resp.ok || !json?.success) throw new Error(json?.error || "Payment failed");

      toast({
        title: "Payment Successful",
        description: `Payment ID: ${json.paymentId}`,
        variant: "default",
      });
    } catch (err: any) {
      toast({
        title: "Payment Failed",
        description: err.message || "An error occurred",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (!isSecureConnection) {
    return (
      <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
        <p className="text-amber-800 font-medium text-sm">Secure connection required</p>
        <p className="text-amber-700 text-sm mt-1">
          HTTPS connection is required for payment processing.
        </p>
      </div>
    );
  }

  if (sdkStatus === "loading") {
    return <p>Loading payment form...</p>;
  }

  if (sdkStatus === "error") {
    return (
      <div className="py-8 text-center">
        <p className="text-red-600 text-sm">Payment System Initialization Failed</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div
        ref={cardRef}
        id="card-container"
        className="w-full border border-gray-300 rounded-lg p-4 bg-white min-h-[80px]"
      />
      <button
        onClick={handlePay}
        disabled={submitting}
        className="w-full rounded-lg px-4 py-3 bg-sage text-white disabled:opacity-50"
      >
        {submitting ? "Processing…" : `Place Your Order – $${amount.toFixed(2)}`}
      </button>
    </div>
  );
}
