export interface Question {
  id: string;
  text: string;
  options: { value: string; label: string; score: number }[];
}

export interface QuestionCluster {
  id: string;
  title: string;
  description: string;
  questions: Question[];
}

export const assessmentClusters: QuestionCluster[] = [
  {
    id: "information-security-policy",
    title: "Information Security Policy",
    description: "Assessment of organizational security policies and management support",
    questions: [
      {
        id: "policy-1",
        text: "Does your organization have a documented information security policy?",
        options: [
          { value: "fully-implemented", label: "Fully Implemented and Updated", score: 4 },
          { value: "partially-implemented", label: "Partially Implemented", score: 2 },
          { value: "planned", label: "Planned but Not Implemented", score: 1 },
          { value: "not-implemented", label: "Not Implemented", score: 0 },
        ],
      },
      {
        id: "policy-2",
        text: "Is the information security policy regularly reviewed and updated?",
        options: [
          { value: "annually", label: "Reviewed Annually", score: 4 },
          { value: "occasionally", label: "Reviewed Occasionally", score: 2 },
          { value: "not-reviewed", label: "Never Reviewed", score: 0 },
          { value: "no-policy", label: "No Policy Exists", score: 0 },
        ],
      },
      {
        id: "policy-3",
        text: "Are employees aware of and trained on the information security policy?",
        options: [
          { value: "all-trained", label: "All Employees Trained", score: 4 },
          { value: "some-trained", label: "Some Employees Trained", score: 2 },
          { value: "minimal-training", label: "Minimal Training", score: 1 },
          { value: "no-training", label: "No Training", score: 0 },
        ],
      },
    ],
  },
  {
    id: "access-control",
    title: "Access Control",
    description: "Evaluation of access management and user authentication practices",
    questions: [
      {
        id: "access-1",
        text: "Do you have a formal user access control policy?",
        options: [
          { value: "comprehensive", label: "Comprehensive Policy with Role-Based Access", score: 4 },
          { value: "basic-policy", label: "Basic Policy Exists", score: 2 },
          { value: "informal", label: "Informal Practices Only", score: 1 },
          { value: "none", label: "No Access Control", score: 0 },
        ],
      },
      {
        id: "access-2",
        text: "Are user access rights regularly reviewed and updated?",
        options: [
          { value: "quarterly", label: "Reviewed Quarterly", score: 4 },
          { value: "annually", label: "Reviewed Annually", score: 3 },
          { value: "rarely", label: "Rarely Reviewed", score: 1 },
          { value: "never", label: "Never Reviewed", score: 0 },
        ],
      },
      {
        id: "access-3",
        text: "Do you enforce multi-factor authentication (MFA)?",
        options: [
          { value: "all-users", label: "MFA for All Users", score: 4 },
          { value: "privileged-only", label: "MFA for Privileged Accounts Only", score: 3 },
          { value: "optional", label: "MFA is Optional", score: 1 },
          { value: "not-implemented", label: "No MFA", score: 0 },
        ],
      },
      {
        id: "access-4",
        text: "Are password policies enforced (complexity, expiry, etc.)?",
        options: [
          { value: "strong-policy", label: "Strong Password Policy Enforced", score: 4 },
          { value: "basic-policy", label: "Basic Requirements Only", score: 2 },
          { value: "weak-policy", label: "Weak or No Policy", score: 0 },
        ],
      },
    ],
  },
  {
    id: "asset-management",
    title: "Asset Management",
    description: "Review of information asset identification and handling",
    questions: [
      {
        id: "asset-1",
        text: "Do you maintain an inventory of all information assets?",
        options: [
          { value: "complete", label: "Complete and Updated Inventory", score: 4 },
          { value: "partial", label: "Partial Inventory", score: 2 },
          { value: "outdated", label: "Outdated Inventory", score: 1 },
          { value: "none", label: "No Inventory", score: 0 },
        ],
      },
      {
        id: "asset-2",
        text: "Are assets classified according to their criticality and sensitivity?",
        options: [
          { value: "all-classified", label: "All Assets Classified", score: 4 },
          { value: "critical-only", label: "Critical Assets Only", score: 2 },
          { value: "no-classification", label: "No Classification", score: 0 },
        ],
      },
      {
        id: "asset-3",
        text: "Do you have acceptable use policies for information assets?",
        options: [
          { value: "comprehensive", label: "Comprehensive Policy Enforced", score: 4 },
          { value: "basic", label: "Basic Policy Exists", score: 2 },
          { value: "none", label: "No Policy", score: 0 },
        ],
      },
    ],
  },
  {
    id: "cryptography",
    title: "Cryptography",
    description: "Assessment of cryptographic controls and key management",
    questions: [
      {
        id: "crypto-1",
        text: "Do you use encryption for sensitive data at rest?",
        options: [
          { value: "all-data", label: "All Sensitive Data Encrypted", score: 4 },
          { value: "some-data", label: "Some Data Encrypted", score: 2 },
          { value: "none", label: "No Encryption", score: 0 },
        ],
      },
      {
        id: "crypto-2",
        text: "Is data encrypted in transit (e.g., TLS/SSL)?",
        options: [
          { value: "always", label: "Always Encrypted", score: 4 },
          { value: "mostly", label: "Mostly Encrypted", score: 2 },
          { value: "rarely", label: "Rarely or Never", score: 0 },
        ],
      },
      {
        id: "crypto-3",
        text: "Do you have a cryptographic key management process?",
        options: [
          { value: "formal-process", label: "Formal Key Management Process", score: 4 },
          { value: "informal", label: "Informal Practices", score: 2 },
          { value: "none", label: "No Key Management", score: 0 },
        ],
      },
    ],
  },
  {
    id: "physical-security",
    title: "Physical and Environmental Security",
    description: "Review of physical security controls and environmental protections",
    questions: [
      {
        id: "physical-1",
        text: "Are physical access controls in place for secure areas?",
        options: [
          { value: "comprehensive", label: "Comprehensive Controls (Biometric, Card Access)", score: 4 },
          { value: "basic", label: "Basic Controls (Locks, Keys)", score: 2 },
          { value: "minimal", label: "Minimal Controls", score: 1 },
          { value: "none", label: "No Controls", score: 0 },
        ],
      },
      {
        id: "physical-2",
        text: "Are equipment and facilities protected from environmental threats?",
        options: [
          { value: "comprehensive", label: "Comprehensive Protection (Fire, Flood, Climate)", score: 4 },
          { value: "partial", label: "Partial Protection", score: 2 },
          { value: "none", label: "No Protection", score: 0 },
        ],
      },
      {
        id: "physical-3",
        text: "Do you have a clean desk and clear screen policy?",
        options: [
          { value: "enforced", label: "Policy Enforced", score: 4 },
          { value: "recommended", label: "Recommended but Not Enforced", score: 2 },
          { value: "none", label: "No Policy", score: 0 },
        ],
      },
    ],
  },
  {
    id: "incident-management",
    title: "Incident Management",
    description: "Evaluation of security incident response and management capabilities",
    questions: [
      {
        id: "incident-1",
        text: "Do you have an incident response plan?",
        options: [
          { value: "documented-tested", label: "Documented and Regularly Tested", score: 4 },
          { value: "documented", label: "Documented but Not Tested", score: 2 },
          { value: "informal", label: "Informal Approach Only", score: 1 },
          { value: "none", label: "No Plan", score: 0 },
        ],
      },
      {
        id: "incident-2",
        text: "Are security incidents logged and tracked?",
        options: [
          { value: "comprehensive", label: "Comprehensive Logging and Tracking", score: 4 },
          { value: "basic", label: "Basic Logging", score: 2 },
          { value: "none", label: "No Logging", score: 0 },
        ],
      },
      {
        id: "incident-3",
        text: "Do you conduct post-incident reviews?",
        options: [
          { value: "always", label: "Always Conducted", score: 4 },
          { value: "sometimes", label: "Sometimes Conducted", score: 2 },
          { value: "never", label: "Never Conducted", score: 0 },
        ],
      },
    ],
  },
  {
    id: "business-continuity",
    title: "Business Continuity",
    description: "Assessment of continuity planning and disaster recovery capabilities",
    questions: [
      {
        id: "bc-1",
        text: "Do you have a business continuity plan (BCP)?",
        options: [
          { value: "comprehensive-tested", label: "Comprehensive BCP, Regularly Tested", score: 4 },
          { value: "documented", label: "Documented but Not Tested", score: 2 },
          { value: "informal", label: "Informal Planning", score: 1 },
          { value: "none", label: "No BCP", score: 0 },
        ],
      },
      {
        id: "bc-2",
        text: "Do you have a disaster recovery plan (DRP)?",
        options: [
          { value: "comprehensive-tested", label: "Comprehensive DRP, Regularly Tested", score: 4 },
          { value: "documented", label: "Documented but Not Tested", score: 2 },
          { value: "none", label: "No DRP", score: 0 },
        ],
      },
      {
        id: "bc-3",
        text: "Are backups performed regularly and tested for restoration?",
        options: [
          { value: "regular-tested", label: "Regular Backups, Tested Restoration", score: 4 },
          { value: "regular-untested", label: "Regular Backups, Not Tested", score: 2 },
          { value: "irregular", label: "Irregular Backups", score: 1 },
          { value: "none", label: "No Backups", score: 0 },
        ],
      },
    ],
  },
  {
    id: "compliance",
    title: "Compliance",
    description: "Review of legal, regulatory, and contractual compliance",
    questions: [
      {
        id: "compliance-1",
        text: "Do you identify and comply with relevant legal and regulatory requirements?",
        options: [
          { value: "fully-compliant", label: "Fully Compliant with Regular Reviews", score: 4 },
          { value: "mostly-compliant", label: "Mostly Compliant", score: 2 },
          { value: "uncertain", label: "Uncertain of Requirements", score: 1 },
          { value: "non-compliant", label: "Not Compliant", score: 0 },
        ],
      },
      {
        id: "compliance-2",
        text: "Are internal audits conducted for information security?",
        options: [
          { value: "regular", label: "Regular Internal Audits", score: 4 },
          { value: "occasional", label: "Occasional Audits", score: 2 },
          { value: "none", label: "No Audits", score: 0 },
        ],
      },
      {
        id: "compliance-3",
        text: "Do you have intellectual property rights protection measures?",
        options: [
          { value: "comprehensive", label: "Comprehensive Protection Measures", score: 4 },
          { value: "basic", label: "Basic Protection", score: 2 },
          { value: "none", label: "No Protection Measures", score: 0 },
        ],
      },
    ],
  },
];
