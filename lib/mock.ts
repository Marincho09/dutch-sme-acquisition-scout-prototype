import type { Assessment, AssessmentCore, CompanyInput } from "./schema";
import { unavailable } from "./schema";
import { calculateWeightedScore } from "./scoring";

type DemoProfile = Omit<AssessmentCore, "companyName" | "website">;

const commonGaps = [
  "Financial performance and margins",
  "Customer concentration and retention",
  "Ownership and succession context",
  "Management depth and owner dependency",
];

const demoProfiles: Record<string, DemoProfile> = {
  "adaption-it.nl": profile({
    overview: "Adaption provides a cloud-based logistics software suite for organizations with complex, business-critical warehouse, transport and forwarding processes.",
    productsServices: "Integrated WMS, TMS and freight-forwarding software, plus implementation, integrations and support.",
    customerType: "Producers, shippers and logistics service providers handling complex or bulk logistics flows.",
    businessModel: "Modular B2B logistics SaaS. The company states that customers select and pay for the modules they use; contract terms and pricing are not public.",
    sector: "Vertical logistics SaaS",
    location: "Sliedrecht, Netherlands",
    recurringRevenueCharacteristics: "Cloud delivery, modular software access and ongoing support indicate recurring characteristics, but revenue mix and contract duration are unavailable.",
    successionOwnershipIndicators: unavailable,
    operationalComplexity: "Complex product integrations, implementation work and support for business-critical logistics workflows create meaningful delivery complexity.",
    aiAutomationOpportunities: ["Support-ticket triage and knowledge retrieval", "Implementation-document extraction", "Logistics exception detection and workflow recommendations"],
    keyRisks: ["Implementation-heavy sales and onboarding", "Dependence on integrations with customer systems", "Customer concentration and retention are unavailable"],
    informationGaps: commonGaps,
    sourceUrls: ["https://www.adaption-it.nl/", "https://www.adaption-it.nl/contact/"],
    scores: scores(4, 4, 4, 3, 4, {
      model: "Integrated vertical SaaS for business-critical logistics workflows is attractive, although economics are unavailable.",
      recurring: "The official site describes a modular cloud SaaS solution; contract duration and retention are unavailable.",
      moat: "Domain-specific WMS, TMS and forwarding functionality plus integrations may raise switching costs.",
      improvement: "Support, implementation and logistics exception workflows offer plausible automation opportunities.",
      owner: "Focused B2B software is potentially owner-operable, subject to management depth and customer concentration diligence.",
    }),
    scoreExplanation: "The score is supported by Adaption's integrated, modular logistics SaaS positioning and specialization in complex workflows. Confidence remains medium because commercial metrics, ownership and customer concentration are unavailable.",
    confidence: "Medium",
    outreachDraft: outreach("Adaption", "your integrated cloud platform for complex warehouse, transport and forwarding workflows"),
  }),
  "apva.nl": profile({
    overview: "APVA IT Solutions & Services provides ERP, warehouse-management and transport software for Dutch SMEs, with an explicit focus on wholesale logistics.",
    productsServices: "ApvaERP modules for B2B sales, WMS and transport, supported by implementation and IT services.",
    customerType: "SME wholesalers and other businesses managing warehouse, sales and transport processes.",
    businessModel: "B2B enterprise software and services. Public pages do not disclose licensing, subscription or implementation revenue mix.",
    sector: "ERP and logistics software",
    location: "Rotterdam, Netherlands",
    recurringRevenueCharacteristics: "Operational ERP/WMS use and support may create repeat revenue, but subscription terms and renewal evidence are unavailable.",
    successionOwnershipIndicators: unavailable,
    operationalComplexity: "ERP implementations, customer-specific process configuration and integrations can require specialist delivery and support.",
    aiAutomationOpportunities: ["ERP implementation mapping", "Support knowledge assistant", "Order and warehouse exception detection"],
    keyRisks: ["Potential customization burden", "Commercial model is not publicly described", "Customer concentration is unavailable"],
    informationGaps: commonGaps,
    sourceUrls: ["https://www.apva.nl/"],
    scores: scores(4, 3, 3, 3, 4, {
      model: "Business-critical ERP and WMS software for a defined SME niche is attractive, but the revenue model is not disclosed.",
      recurring: "Ongoing software use suggests repeat potential; subscriptions and retention are not evidenced publicly.",
      moat: "Workflow embedding and customer configuration may create switching costs, although product differentiation needs diligence.",
      improvement: "Implementation and support processes offer credible automation opportunities.",
      owner: "The focused SME customer base could suit hands-on ownership, subject to technical-team dependency and concentration checks.",
    }),
    scoreExplanation: "APVA scores well for vertical focus and business-critical workflow software. The neutral recurring and defensibility scores reflect missing evidence on subscriptions, retention, customization and customer concentration.",
    confidence: "Medium",
    outreachDraft: outreach("APVA", "your ERP, WMS and transport solutions for SME wholesalers"),
  }),
  "taskform.nl": profile({
    overview: "TaskForm develops an operations platform for production and logistics, combining planning, production, WMS and time registration with an AI app builder.",
    productsServices: "A browser-based SaaS platform for planners and managers, plus a no-code AI app builder with ERP integrations.",
    customerType: "Manufacturers, logistics operators and technical-service businesses that need to digitize shop-floor workflows.",
    businessModel: "Per-seat SaaS with all core modules included, supplemented by implementation and app-building capabilities.",
    sector: "Operations management SaaS",
    location: "Haarlem, Netherlands",
    recurringRevenueCharacteristics: "The official site explicitly describes a per-seat SaaS product, supporting a recurring-revenue inference; retention and contract length are unavailable.",
    successionOwnershipIndicators: unavailable,
    operationalComplexity: "The combination of ERP integrations, configurable applications and production/logistics workflows creates moderate implementation complexity.",
    aiAutomationOpportunities: ["Automated workflow and app generation", "Production exception summaries", "Implementation and support copilots"],
    keyRisks: ["Competitive operations-software market", "Integration and implementation capacity", "Revenue scale and retention are unavailable"],
    informationGaps: commonGaps,
    sourceUrls: ["https://www.taskform.nl/", "https://www.taskform.nl/over-ons/"],
    scores: scores(4, 4, 3, 4, 4, {
      model: "Per-seat vertical SaaS with ERP connectivity is an attractive model, pending commercial diligence.",
      recurring: "The company explicitly markets a per-seat SaaS platform; renewal and churn data are unavailable.",
      moat: "Workflow knowledge and ERP integrations may differentiate the product, but competitive positioning needs validation.",
      improvement: "The product and delivery model expose strong AI-assisted workflow, support and onboarding opportunities.",
      owner: "A focused software company can suit long-term owner-operation if product and technical leadership are transferable.",
    }),
    scoreExplanation: "TaskForm ranks strongly because its public site supports a clear per-seat SaaS model, a defined production/logistics niche and practical automation opportunities. Defensibility remains provisional without retention and competitive data.",
    confidence: "Medium",
    outreachDraft: outreach("TaskForm", "your combination of shop-floor SaaS and an ERP-connected AI App Builder"),
  }),
  "fiton.nl": profile({
    overview: "Fiton supplies integrated logistics software for freight forwarding, warehousing and customs processes.",
    productsServices: "Fit on Forwarding, Fit on Warehousing and Fit on Customs, alongside consultancy, implementation, project management, training and helpdesk support.",
    customerType: "Logistics service providers, customs agents, importers, exporters and warehouse operators.",
    businessModel: "B2B logistics software delivered in cloud or on-premise configurations with implementation and support services; pricing and contract structure are unavailable.",
    sector: "Logistics and customs software",
    location: "Zwijndrecht, Netherlands",
    recurringRevenueCharacteristics: "Cloud software and support indicate possible recurring revenue, but the official site also describes on-premise delivery and does not disclose the revenue mix.",
    successionOwnershipIndicators: unavailable,
    operationalComplexity: "Customs compliance, multimodal forwarding, WMS processes and multiple deployment models create high product and support complexity.",
    aiAutomationOpportunities: ["Customs-document extraction and validation", "Support knowledge retrieval", "Shipment and warehouse exception detection"],
    keyRisks: ["Regulatory and customs-system change", "Legacy or on-premise maintenance burden", "Revenue concentration and retention are unavailable"],
    informationGaps: commonGaps,
    sourceUrls: ["https://www.fiton.nl/", "https://www.fiton.nl/en/contact"],
    scores: scores(4, 3, 4, 3, 4, {
      model: "Business-critical vertical software across customs, warehousing and forwarding is attractive, but deployment and revenue mix are unclear.",
      recurring: "Cloud and support usage support repeat potential; explicit subscriptions and retention are unavailable.",
      moat: "Customs-domain knowledge and integrated logistics modules may create defensibility and switching costs.",
      improvement: "Document-heavy compliance and support workflows offer automation potential, offset by product complexity.",
      owner: "A focused logistics-software provider may suit patient ownership if regulatory expertise is retained.",
    }),
    scoreExplanation: "Fiton's integrated customs and logistics specialization supports attractive model and defensibility scores. Recurring quality is held at neutral because cloud, on-premise and services mix is not disclosed.",
    confidence: "Medium",
    outreachDraft: outreach("Fiton", "your integrated forwarding, warehousing and customs software suite"),
  }),
  "logeo.nl": profile({
    overview: "LoGeo is a cloud transportation-management system designed for small and medium-sized road-transport, logistics, retail, distribution and wholesale businesses.",
    productsServices: "SaaS TMS covering orders, route planning, invoicing, warehouses, vehicle and shipment tracking, and reporting.",
    customerType: "Small and medium-sized road transport, logistics, retail, distribution and wholesale companies.",
    businessModel: "Cloud-hosted B2B SaaS. Public pricing, contract duration and support revenue are unavailable.",
    sector: "Transportation-management SaaS",
    location: "Alblasserdam, Netherlands",
    recurringRevenueCharacteristics: "The official site explicitly describes LoGeo as provider-hosted SaaS, indicating recurring characteristics; retention and contract evidence are unavailable.",
    successionOwnershipIndicators: unavailable,
    operationalComplexity: "Transport planning, mobile access, tracking, invoicing and warehouse functions require reliable integrations and operational support.",
    aiAutomationOpportunities: ["Route and load recommendations", "Transport exception summaries", "Customer-support and onboarding assistant"],
    keyRisks: ["Crowded TMS market", "Product-scale and customer concentration are unavailable", "Dependence on reliable integrations and mapping data"],
    informationGaps: commonGaps,
    sourceUrls: ["https://www.logeo.nl/about-logeo/", "https://www.logeo.nl/about-us/what-is-logeo/"],
    scores: scores(4, 4, 3, 4, 4, {
      model: "A focused cloud TMS for SMEs is attractive, although commercial scale is unavailable.",
      recurring: "LoGeo is explicitly described as provider-hosted SaaS; renewal and churn data are unavailable.",
      moat: "Operational workflow embedding may support switching costs, but competitive differentiation needs validation.",
      improvement: "Planning, exception handling and customer support offer strong automation potential.",
      owner: "The narrow SME focus may suit long-term operation if technical dependency and customer concentration are manageable.",
    }),
    scoreExplanation: "LoGeo benefits from a clear vertical SaaS model and identifiable operational automation opportunities. The score remains provisional because scale, retention, ownership and competitive data are not public.",
    confidence: "Medium",
    outreachDraft: outreach("LoGeo", "your cloud TMS designed specifically for smaller transport and logistics operators"),
  }),
  "elfsquad.io": profile({
    overview: "Elfsquad develops CPQ software for manufacturers that sell complex, customer-specific products and systems.",
    productsServices: "Configure-price-quote SaaS with product logic, pricing, quotations, bills of materials, channel management and ERP/CRM/production integrations.",
    customerType: "Manufacturers and their sales, dealer and engineering channels handling configurable products.",
    businessModel: "B2B CPQ SaaS with implementation and integration requirements; pricing and contract duration are unavailable.",
    sector: "Manufacturing CPQ SaaS",
    location: "Drachten, Netherlands",
    recurringRevenueCharacteristics: "The company explicitly describes its CPQ product as SaaS, supporting recurring characteristics; retention and net revenue metrics are unavailable.",
    successionOwnershipIndicators: unavailable,
    operationalComplexity: "Product-rule modeling, ERP/CRM integration, implementation and customer-specific manufacturing logic create substantial technical complexity.",
    aiAutomationOpportunities: ["Assisted product-rule modeling", "Quote and configuration quality checks", "Implementation and support knowledge copilots"],
    keyRisks: ["Implementation complexity", "Competition from broad CPQ platforms", "Retention, concentration and ownership data are unavailable"],
    informationGaps: commonGaps,
    sourceUrls: ["https://www.elfsquad.io/nl/cpq-software", "https://www.elfsquad.io/contact-us"],
    scores: scores(4, 4, 4, 3, 4, {
      model: "Specialized CPQ SaaS embedded in complex manufacturing sales workflows is attractive.",
      recurring: "The official site identifies the product as SaaS; contract quality and churn are unavailable.",
      moat: "Centralized configuration logic, integrations and product knowledge may create meaningful switching costs.",
      improvement: "AI can assist rule modeling and support, although the product is already software-intensive.",
      owner: "Vertical B2B SaaS can fit long-term ownership if management and technical capabilities are transferable.",
    }),
    scoreExplanation: "Elfsquad scores well for vertical SaaS, deep workflow integration and plausible switching costs. Commercial performance and ownership information remain unavailable, keeping confidence at medium.",
    confidence: "Medium",
    outreachDraft: outreach("Elfsquad", "your CPQ platform for manufacturers competing on customer-specific solutions"),
  }),
  "pom.eu": profile({
    overview: "POM provides software that helps organizations send payment requests and collect invoices through a more user-friendly payment and communication process.",
    productsServices: "Payment-request, invoice-collection and credit-management software supported by a technical platform and payment communications.",
    customerType: "Organizations across multiple sectors that issue invoices or payment requests to consumers and businesses.",
    businessModel: "B2B payment and collection software. Public pages do not provide enough evidence to determine subscription, transaction or services revenue mix.",
    sector: "Payments and collections software",
    location: "Alblasserdam, Netherlands",
    recurringRevenueCharacteristics: "Ongoing invoice and payment flows imply repeat usage, but pricing, contracts and revenue composition are unavailable.",
    successionOwnershipIndicators: unavailable,
    operationalComplexity: "Payment integrations, compliance, customer communications and multi-country operations create meaningful operational complexity.",
    aiAutomationOpportunities: ["Payment-journey personalization", "Customer-service triage", "Collections communication optimization with human review"],
    keyRisks: ["Payments and data-protection regulation", "Dependency on payment and communication integrations", "Revenue model and concentration are unavailable"],
    informationGaps: commonGaps,
    sourceUrls: ["https://www.pom.eu/en/about-us", "https://www.pom.eu/nl/contact"],
    scores: scores(4, 3, 3, 4, 3, {
      model: "Software supporting essential payment workflows is attractive, but monetization and economics are unavailable.",
      recurring: "Payment flows repeat, yet contractual recurrence and retention are not publicly evidenced.",
      moat: "Workflow integration and payment data may help defensibility, but the competitive position requires diligence.",
      improvement: "Communication, service and payment-journey optimization offer substantial automation potential.",
      owner: "The regulated, multi-country payments context may require more specialist governance than a simple owner-operated SME.",
    }),
    scoreExplanation: "POM's essential payment workflow and software platform support an attractive model and strong improvement potential. Scores are tempered by unavailable monetization details and the complexity of regulated, multi-country operations.",
    confidence: "Medium",
    outreachDraft: outreach("POM", "your people-centered software approach to improving invoice collection and payment experiences"),
  }),
  "vanraam.com": profile({
    overview: "vanRaam designs and manufactures specialized adapted bicycles for people who cannot or do not want to use a standard two-wheel bicycle.",
    productsServices: "Tricycles, wheelchair bikes, tandems, duo bikes, low-step and other adapted bicycles, including electric variants and customization through dealers.",
    customerType: "People with mobility needs, care organizations and other users served through an authorized dealer network.",
    businessModel: "Specialized product design and manufacturing with dealer-based distribution; aftermarket, service and recurring revenue mix are unavailable.",
    sector: "Specialized mobility equipment manufacturing",
    location: "Varsseveld, Netherlands",
    recurringRevenueCharacteristics: "Dealer relationships, accessories and replacement demand may create repeat business, but the official sources reviewed do not quantify recurring revenue.",
    successionOwnershipIndicators: "The official history states that vanRaam entered a partnership with Armira in 2023 and completed a leadership handover in 2025. No sale intention is stated.",
    operationalComplexity: "Product engineering, regulated safety expectations, customization, manufacturing and international dealer coordination create high operational complexity.",
    aiAutomationOpportunities: ["Dealer and product-configuration assistance", "Service knowledge retrieval", "Production planning and quality-analysis support"],
    keyRisks: ["Manufacturing and supply-chain complexity", "Product liability and quality requirements", "Recent investment and leadership context may limit acquisition fit"],
    informationGaps: ["Financial performance and margins", "Dealer concentration", "Aftermarket and repeat-revenue mix", "Current shareholder objectives"],
    sourceUrls: ["https://www.vanraam.com/nl-nl/over-van-raam", "https://www.vanraam.com/nl-nl/over-van-raam/geschiedenis", "https://www.vanraam.com/nl-nl/aanschaf"],
    scores: scores(4, 2, 4, 3, 2, {
      model: "A specialized product portfolio and dealer distribution are attractive, though manufacturing economics are unavailable.",
      recurring: "The sources do not establish meaningful contractual recurring revenue.",
      moat: "Specialized design, manufacturing know-how and an authorized dealer model may provide defensibility.",
      improvement: "Configuration, service and production workflows offer improvement potential within a complex operation.",
      owner: "Manufacturing complexity and the disclosed investment and leadership context reduce straightforward search-fund fit.",
    }),
    scoreExplanation: "vanRaam has a differentiated adapted-mobility niche and clear product capabilities. The lower owner-operator and repeat-revenue scores reflect manufacturing complexity, unavailable recurrence data and the publicly disclosed investment and leadership transition.",
    confidence: "Medium",
    outreachDraft: outreach("vanRaam", "the specialized adapted bicycles and dealer-supported mobility solutions you have developed"),
  }),
  "euromate.com": profile({
    overview: "Euromate supplies indoor-air cleaning and purification solutions from Breda, combining advice, measurements, filtration products, installation and service.",
    productsServices: "Air cleaners, air-quality sensors and measurements, filtration advice, installation, maintenance and service agreements.",
    customerType: "Industrial, logistics, woodworking, education, office, healthcare, hospitality and other organizations managing indoor-air quality.",
    businessModel: "Equipment and project sales supplemented by installation, maintenance and service agreements; revenue mix is unavailable.",
    sector: "Commercial air-quality equipment and services",
    location: "Breda, Netherlands",
    recurringRevenueCharacteristics: "The official support page describes service agreements with continuing maintenance, but their contribution to total revenue is unavailable.",
    successionOwnershipIndicators: unavailable,
    operationalComplexity: "Site assessment, tailored filtration, installation, field service, inventory and an international distributor network create moderate-to-high complexity.",
    aiAutomationOpportunities: ["Sensor-driven predictive maintenance", "Service scheduling and technician assistance", "Automated air-quality report drafting"],
    keyRisks: ["Project and equipment revenue cyclicality", "Field-service and inventory complexity", "Ownership and customer concentration are unavailable"],
    informationGaps: commonGaps,
    sourceUrls: ["https://www.euromate.com/group/nl/over-ons/", "https://www.euromate.com/group/nl/support/"],
    scores: scores(4, 3, 4, 4, 3, {
      model: "Specialized equipment, advice and service provide multiple value streams, although margins and mix are unavailable.",
      recurring: "Service agreements provide evidence of repeat revenue, but their materiality is not disclosed.",
      moat: "Application knowledge, installed equipment and service capability may support defensibility.",
      improvement: "Sensors, maintenance scheduling and field-service workflows create strong automation potential.",
      owner: "The operation could suit patient ownership, but field service and international distribution add complexity.",
    }),
    scoreExplanation: "Euromate combines specialized filtration products with advice and documented service agreements, supporting defensibility and repeat potential. The score remains cautious because revenue mix, ownership and customer concentration are unavailable.",
    confidence: "Medium",
    outreachDraft: outreach("Euromate", "your combination of air-quality advice, filtration equipment and ongoing service"),
  }),
  "royaleijkelkamp.com": profile({
    overview: "Royal Eijkelkamp develops and supplies equipment and solutions for soil and water research, sampling, monitoring and geotechnical work worldwide.",
    productsServices: "Soil augers and samplers, field and laboratory equipment, monitoring solutions, drilling and CPT systems, plus related expertise and support.",
    customerType: "Environmental, agricultural, water, geotechnical, research and infrastructure professionals worldwide.",
    businessModel: "Specialized equipment manufacturing and solution sales with technical expertise; service and recurring-revenue mix are unavailable.",
    sector: "Environmental and geotechnical equipment",
    location: "Giesbeek, Netherlands",
    recurringRevenueCharacteristics: "Monitoring, consumables and support may create repeat demand, but recurring revenue is not established by the sources reviewed.",
    successionOwnershipIndicators: "The official company page describes Royal Eijkelkamp as a fourth-generation family business. No succession or sale intention is stated.",
    operationalComplexity: "Engineering, manufacturing, global distribution and a broad technical product portfolio create high operational complexity.",
    aiAutomationOpportunities: ["Technical product-selection assistant", "Monitoring-data anomaly detection", "Service and documentation knowledge retrieval"],
    keyRisks: ["Broad technical portfolio and global operating complexity", "Project and equipment demand variability", "Family ownership may reduce acquisition availability"],
    informationGaps: ["Financial performance and margins", "Revenue mix by product and service", "Customer and distributor concentration", "Family shareholder objectives"],
    sourceUrls: ["https://www.royaleijkelkamp.com/nl/ons-bedrijf/", "https://www.royaleijkelkamp.com/nl/"],
    scores: scores(4, 2, 4, 3, 2, {
      model: "Specialized global equipment and expertise are attractive, although unit economics and service mix are unavailable.",
      recurring: "The reviewed sources do not establish substantial contractual recurring revenue.",
      moat: "Long operating history, specialized engineering and a broad technical portfolio suggest defensibility.",
      improvement: "Product selection, monitoring data and support knowledge offer useful automation opportunities.",
      owner: "Global technical manufacturing and fourth-generation family ownership reduce simple owner-operator suitability.",
    }),
    scoreExplanation: "Royal Eijkelkamp's specialized soil and water capabilities support attractive model and defensibility scores. Lower recurrence and owner-operator scores reflect missing repeat-revenue evidence, global technical complexity and disclosed family ownership.",
    confidence: "Medium",
    outreachDraft: outreach("Royal Eijkelkamp", "the specialist soil and water research solutions your family business has developed"),
  }),
};

export function slugify(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "") || "company";
}

export function createMockAssessment(company: CompanyInput): Assessment {
  const profile = demoProfiles[hostname(company.website_url)];
  if (profile) {
    return {
      ...profile,
      id: `${slugify(company.company_name)}-${Math.abs(hash(company.website_url)).toString(36)}`,
      companyName: company.company_name,
      website: company.website_url,
      totalScore: calculateWeightedScore(profile.scores),
      generatedAt: new Date().toISOString(),
      mode: "demo",
    };
  }

  const neutralEvidence = "No external research was performed in mock mode; a neutral score is used.";
  const neutralScores = {
    businessModelAttractiveness: { value: 3, evidence: neutralEvidence },
    recurringRevenue: { value: 3, evidence: neutralEvidence },
    defensibility: { value: 3, evidence: neutralEvidence },
    operationalImprovement: { value: 3, evidence: neutralEvidence },
    ownerOperatorFit: { value: 3, evidence: neutralEvidence },
  } as const;

  return {
    id: `${slugify(company.company_name)}-${Math.abs(hash(company.website_url)).toString(36)}`,
    companyName: company.company_name,
    website: company.website_url,
    overview: `${unavailable} — mock mode does not research or infer company facts.`,
    productsServices: unavailable,
    customerType: unavailable,
    businessModel: unavailable,
    sector: unavailable,
    location: unavailable,
    recurringRevenueCharacteristics: unavailable,
    successionOwnershipIndicators: unavailable,
    operationalComplexity: unavailable,
    aiAutomationOpportunities: [unavailable],
    keyRisks: ["Insufficient public evidence reviewed"],
    informationGaps: commonGaps,
    sourceUrls: [company.website_url],
    scores: neutralScores,
    totalScore: calculateWeightedScore(neutralScores),
    scoreExplanation: "Provisional neutral score. Connect an OpenAI API key to research public sources and replace unsupported fields with evidence-backed findings.",
    confidence: "Low",
    outreachDraft: outreach(company.company_name, "the business you have built"),
    generatedAt: new Date().toISOString(),
    mode: "mock",
  };
}

function profile(value: DemoProfile): DemoProfile {
  return value;
}

function scores(
  businessModelAttractiveness: number,
  recurringRevenue: number,
  defensibility: number,
  operationalImprovement: number,
  ownerOperatorFit: number,
  evidence: { model: string; recurring: string; moat: string; improvement: string; owner: string },
): AssessmentCore["scores"] {
  return {
    businessModelAttractiveness: { value: businessModelAttractiveness, evidence: evidence.model },
    recurringRevenue: { value: recurringRevenue, evidence: evidence.recurring },
    defensibility: { value: defensibility, evidence: evidence.moat },
    operationalImprovement: { value: operationalImprovement, evidence: evidence.improvement },
    ownerOperatorFit: { value: ownerOperatorFit, evidence: evidence.owner },
  } as AssessmentCore["scores"];
}

function outreach(companyName: string, supportedHook: string): string {
  return `Subject: Introduction regarding ${companyName}\n\nHello,\n\nI'm reaching out because I have been learning about ${supportedHook}. I'm exploring the long-term acquisition and operation of one Dutch business, with a focus on continuity for customers, employees and the owner's legacy.\n\nI do not want to presume that a transaction is under consideration. If a confidential, no-obligation introduction would be useful, I would value 20 minutes to hear your perspective.\n\nKind regards,`;
}

function hostname(url: string): string {
  return new URL(url).hostname.toLowerCase().replace(/^www\./, "");
}

function hash(value: string): number {
  let result = 0;
  for (let i = 0; i < value.length; i += 1) result = (result << 5) - result + value.charCodeAt(i);
  return result | 0;
}
