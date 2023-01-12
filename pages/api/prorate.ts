import type { NextApiRequest, NextApiResponse } from "next";

type Investor = {
  name: string;
  requested_amount: number;
  average_amount: number;
};

type Payload = {
  allocation_amount: number;
  investor_amounts: Investor[];
};

export type OutputData =
  | {
      [k: string]: number;
    }
  | { error: string };

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<OutputData>
) {
  const payload: Payload = req.body;
  const availableAllocation = payload.allocation_amount;

  // Early return if no allocation amount is given
  if (!availableAllocation) {
    return res
      .status(400)
      .json({ error: "The total available allocation must be at least $1." });
  }

  // Filter out incomplete investor data
  const investors = payload.investor_amounts.filter(
    (investor) =>
      investor.name && investor.average_amount && investor.requested_amount
  );

  // Early return if there are no valid investors
  if (!investors.length) {
    return res.status(400).json({
      error:
        "Please provide at least one valid investor. All three fields (name, requested amount, average amount) must be filled.",
    });
  }

  // Calculate the sum of all investors' historical average investment amount
  const historicalTotal = investors.reduce((total, investor) => total + investor.average_amount, 0)

  // Prepare output object
  const proratedAmounts: OutputData = {};

  // Calculate first pass of investment allocation
  // Store unused allocation and inconsequential weightage (due to an investor requesting less than their average historical amount)
  let extraCredits = 0;
  let wastedWeightage = 0;

  investors.forEach((investor) => {
    const maxAllocation =
      availableAllocation * (investor.average_amount / historicalTotal);
    // Avoid allocating more than an investor's required amount
    proratedAmounts[investor.name] = Math.min(
      investor.requested_amount,
      maxAllocation
    );

    if (maxAllocation >= investor.requested_amount) {
      extraCredits += maxAllocation - investor.requested_amount;
      wastedWeightage += investor.average_amount;
    }
  });

  // Early return if  all investors are getting their full requested amount
  if (!extraCredits) {
    return res.status(200).json(proratedAmounts);
  }

  // Second pass to redistribute unused allocation
  investors.forEach((investor) => {
    if (investor.requested_amount > proratedAmounts[investor.name]) {
      const maxAllocation =
        extraCredits *
          (investor.average_amount /
            Math.abs(historicalTotal - wastedWeightage)) +
        proratedAmounts[investor.name];

      proratedAmounts[investor.name] = Math.min(
        investor.requested_amount,
        maxAllocation
      );
    }
  });

  return res.status(200).json(proratedAmounts);
}
