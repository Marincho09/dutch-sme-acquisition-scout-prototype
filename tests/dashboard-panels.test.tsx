import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { DashboardPanelDialog } from "../components/dashboard-panels";
import { createMockAssessment } from "../lib/mock";

const assessment = createMockAssessment({
  company_name: "Adaption",
  website_url: "https://www.adaption.com",
});

describe("DashboardPanelDialog", () => {
  it("renders the complete scorecard methodology", () => {
    const markup = renderToStaticMarkup(
      <DashboardPanelDialog panel="scorecards" assessments={[]} onClose={() => undefined} onClearResults={() => undefined} />,
    );

    expect(markup).toContain("Scorecard methodology");
    expect(markup).toContain("Business model");
    expect(markup).toContain("Owner-operator fit");
  });

  it("renders saved personalized outreach", () => {
    const markup = renderToStaticMarkup(
      <DashboardPanelDialog panel="outreach" assessments={[assessment]} onClose={() => undefined} onClearResults={() => undefined} />,
    );

    expect(markup).toContain("Personalized outreach");
    expect(markup).toContain(assessment.companyName);
    expect(markup).toContain(`Subject: Introduction regarding ${assessment.companyName}`);
  });

  it("renders workspace settings and the saved profile count", () => {
    const markup = renderToStaticMarkup(
      <DashboardPanelDialog panel="settings" assessments={[assessment]} onClose={() => undefined} onClearResults={() => undefined} />,
    );

    expect(markup).toContain("Settings &amp; data");
    expect(markup).toContain("1 saved profile");
    expect(markup).toContain("Clear saved results");
  });
});
