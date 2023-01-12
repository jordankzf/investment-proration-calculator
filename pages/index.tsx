import Head from "next/head";
import React, { FormEvent } from "react";
import InvestorFields from "../components/InvestorFields";
import { OutputData } from "./api/prorate";

async function handleSubmit(e: FormEvent<HTMLFormElement>) {
  // Prevent the browser from reloading the page
  e.preventDefault();

  // Read the form data
  const form = e.currentTarget;

  if (!form) return;

  const formData = new FormData(form);
  const formJson = Object.fromEntries(formData.entries());

  const response = await fetch("/api/prorate", {
    method: form.method,
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      allocation_amount: Number(formJson.total),
      investor_amounts: [
        {
          name: formJson["name-1"],
          requested_amount: Number(formJson["requested-1"]),
          average_amount: Number(formJson["average-1"]),
        },
        {
          name: formJson["name-2"],
          requested_amount: Number(formJson["requested-2"]),
          average_amount: Number(formJson["average-2"]),
        },
        {
          name: formJson["name-3"],
          requested_amount: Number(formJson["requested-3"]),
          average_amount: Number(formJson["average-3"]),
        },
      ],
    }),
  });
  return await response.json();
}

export default function Home() {
  const [results, setResults] = React.useState<OutputData>({});
  return (
    <>
      <Head>
        <title>Investment Proration Calculator</title>
        <meta name="description" content="Fair investing for all!" />
      </Head>
      <div className="parent-container">
        <div className="inputs-container">
          <form
            method="post"
            onSubmit={(e) => handleSubmit(e).then((r) => setResults(r))}
          >
            <div className="main-label">Inputs</div>
            <div className="inner-inputs-container">
              <div>
                <div className="secondary-label">
                  Total Available Allocation
                </div>
                <span className="input-symbol-dollar">
                  <input
                    type="number"
                    id="total"
                    name="total"
                    placeholder="Allocation"
                    min="0"
                  />
                </span>
              </div>
              <div>
                <div className="secondary-label">Investor Breakdown</div>
                {/* You could do something like [1,2,3].map... but that's a little overkill imo */}
                <InvestorFields id={1} />
                <InvestorFields id={2} />
                <InvestorFields id={3} />
              </div>
              <div>
                <button className="submit-button">Prorate</button>
              </div>
            </div>
          </form>
        </div>
        <div className="results-container">
          <div className="main-label">Results</div>
          <div className="inner-results-container">
            {results.error ? (
              <div className="error">{results.error}</div>
            ) : (
              Object.entries(results).map((result, index) => (
                <div key={`investor-${index}`}>
                  {/* Multiply by 1 to remove trailing zeros */}
                  {`${result[0]} - $${result[1].toFixed(5) * 1}`}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </>
  );
}
