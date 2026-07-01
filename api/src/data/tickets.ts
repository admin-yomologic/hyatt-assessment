import type { Ticket } from "../features/tickets/types/ticket";

export const ticketsFixture: Ticket[] = [
  {
    id: "TCK-1001",
    subject: "Unable to reset account password",
    requester: "Ava Johnson",
    status: "Open",
    priority: "High",
    createdDate: "2026-06-24T09:11:00.000Z",
    description:
      "Requester reports the password reset email never arrives. Verified address is correct and spam folder is empty.",
  },
  {
    id: "TCK-1002",
    subject: "VPN disconnects every 10 minutes",
    requester: "Liam Carter",
    status: "In Progress",
    priority: "Urgent",
    createdDate: "2026-06-25T15:42:00.000Z",
    description:
      "Connection drops during file uploads. Issue appears on both home and office networks.",
  },
  {
    id: "TCK-1003",
    subject: "Request access to analytics dashboard",
    requester: "Noah Ramirez",
    status: "Resolved",
    priority: "Low",
    createdDate: "2026-06-21T08:03:00.000Z",
    description:
      "New team member requires read-only access to the quarterly analytics workspace.",
  },
  {
    id: "TCK-1004",
    subject: "Printer queue stuck for finance floor",
    requester: "Emma Wilson",
    status: "Open",
    priority: "Medium",
    createdDate: "2026-06-26T11:27:00.000Z",
    description:
      "All print jobs remain in queue with status pending. Device restarted once but issue persists.",
  },
  {
    id: "TCK-1005",
    subject: "Error 500 on billing export",
    requester: "Olivia Brown",
    status: "In Progress",
    priority: "High",
    createdDate: "2026-06-27T13:55:00.000Z",
    description:
      "Billing CSV export fails for date ranges larger than 30 days. Smaller exports succeed.",
  },
  {
    id: "TCK-1006",
    subject: "Laptop camera not detected in Teams",
    requester: "Mason Lee",
    status: "Resolved",
    priority: "Medium",
    createdDate: "2026-06-20T17:18:00.000Z",
    description:
      "Camera device was missing after OS update; driver reinstallation resolved the problem.",
  },
  {
    id: "TCK-1007",
    subject: "Need MFA reset after phone change",
    requester: "Sophia Clark",
    status: "Open",
    priority: "Urgent",
    createdDate: "2026-06-28T07:40:00.000Z",
    description:
      "Requester cannot complete login because old authenticator device is no longer available.",
  },
  {
    id: "TCK-1008",
    subject: "Slow loading profile page",
    requester: "Ethan Walker",
    status: "In Progress",
    priority: "Low",
    createdDate: "2026-06-23T12:09:00.000Z",
    description:
      "Profile page load time exceeds 7 seconds on first visit. Subsequent visits are faster.",
  },
  {
    id: "TCK-1009",
    subject: "Email signature not syncing in Outlook",
    requester: "Isabella Hall",
    status: "Open",
    priority: "Low",
    createdDate: "2026-06-18T10:02:00.000Z",
    description:
      "Updated signature appears in web client but desktop Outlook still shows old template.",
  },
  {
    id: "TCK-1010",
    subject: "Cannot join Zoom meetings from calendar invite",
    requester: "James Young",
    status: "In Progress",
    priority: "Medium",
    createdDate: "2026-06-19T14:44:00.000Z",
    description:
      "Join button opens browser and fails with authentication loop for SSO users.",
  },
  {
    id: "TCK-1011",
    subject: "Sales dashboard showing stale numbers",
    requester: "Charlotte King",
    status: "Open",
    priority: "High",
    createdDate: "2026-06-22T09:26:00.000Z",
    description:
      "Dashboard appears one day behind after nightly ETL; sales team needs same-day accuracy.",
  },
  {
    id: "TCK-1012",
    subject: "SSO login fails for new contractor accounts",
    requester: "Benjamin Scott",
    status: "Resolved",
    priority: "Urgent",
    createdDate: "2026-06-17T07:58:00.000Z",
    description:
      "Provisioning workflow missed identity group assignment; corrected via sync rerun.",
  },
  {
    id: "TCK-1013",
    subject: "Expense app crashes when uploading receipt",
    requester: "Amelia Green",
    status: "In Progress",
    priority: "High",
    createdDate: "2026-06-29T16:31:00.000Z",
    description:
      "Mobile app closes unexpectedly when attaching HEIC images larger than 5 MB.",
  },
  {
    id: "TCK-1014",
    subject: "Need shared mailbox access for support queue",
    requester: "Lucas Adams",
    status: "Resolved",
    priority: "Medium",
    createdDate: "2026-06-15T12:45:00.000Z",
    description:
      "Access granted with send-as permissions for two agents after manager approval.",
  },
  {
    id: "TCK-1015",
    subject: "Database timeout on order history page",
    requester: "Mia Baker",
    status: "Open",
    priority: "Urgent",
    createdDate: "2026-06-30T08:12:00.000Z",
    description:
      "Requests exceeding 90-day history timeout consistently during morning traffic peaks.",
  },
  {
    id: "TCK-1016",
    subject: "Password reset email translated incorrectly",
    requester: "Henry Gonzalez",
    status: "Resolved",
    priority: "Low",
    createdDate: "2026-06-14T11:17:00.000Z",
    description:
      "Spanish locale template had malformed variable placeholder, now corrected.",
  },
  {
    id: "TCK-1017",
    subject: "VPN profile missing split tunnel settings",
    requester: "Harper Nelson",
    status: "In Progress",
    priority: "Medium",
    createdDate: "2026-06-16T18:05:00.000Z",
    description:
      "New MDM deployment pushed incomplete profile, causing internal app routing issues.",
  },
  {
    id: "TCK-1018",
    subject: "Customer export includes duplicate rows",
    requester: "Elijah Carter",
    status: "Open",
    priority: "High",
    createdDate: "2026-06-30T09:01:00.000Z",
    description:
      "CSV export repeats records when filter by region is combined with custom fields.",
  },
  {
    id: "TCK-1019",
    subject: "Need MFA enrollment reminder campaign",
    requester: "Evelyn Perez",
    status: "Resolved",
    priority: "Medium",
    createdDate: "2026-06-13T13:37:00.000Z",
    description:
      "Automated reminder configured for users not enrolled after seven days.",
  },
  {
    id: "TCK-1020",
    subject: "Slack notifications delayed for incident channel",
    requester: "Alexander Torres",
    status: "In Progress",
    priority: "Urgent",
    createdDate: "2026-06-29T05:54:00.000Z",
    description:
      "Webhook retries succeeded but queue lag introduced delays up to four minutes.",
  },
  {
    id: "TCK-1021",
    subject: "Create report for unresolved urgent tickets",
    requester: "Abigail Mitchell",
    status: "Open",
    priority: "Low",
    createdDate: "2026-06-12T08:49:00.000Z",
    description:
      "Operations team requested weekly digest showing owner, age, and SLA breach risk.",
  },
  {
    id: "TCK-1022",
    subject: "Search results missing requester names",
    requester: "Daniel Roberts",
    status: "Resolved",
    priority: "High",
    createdDate: "2026-06-11T15:11:00.000Z",
    description:
      "UI rendering bug skipped requester fallback field; patched and deployed.",
  },
  {
    id: "TCK-1023",
    subject: "Billing webhook signature verification failed",
    requester: "Scarlett Turner",
    status: "In Progress",
    priority: "Urgent",
    createdDate: "2026-06-28T21:06:00.000Z",
    description:
      "Rotation of signing key not propagated to consumer service in one environment.",
  },
  {
    id: "TCK-1024",
    subject: "Need access to production logs for audit",
    requester: "Matthew Phillips",
    status: "Resolved",
    priority: "Medium",
    createdDate: "2026-06-10T10:28:00.000Z",
    description:
      "Read-only role granted with access limited to payment-service namespace.",
  },
  {
    id: "TCK-1025",
    subject: "High memory usage on reporting worker",
    requester: "Victoria Campbell",
    status: "Open",
    priority: "High",
    createdDate: "2026-06-30T10:40:00.000Z",
    description:
      "Worker exceeds memory limit during monthly aggregation and restarts repeatedly.",
  },
  {
    id: "TCK-1026",
    subject: "Data retention policy question for backups",
    requester: "Joseph Parker",
    status: "In Progress",
    priority: "Low",
    createdDate: "2026-06-09T09:05:00.000Z",
    description:
      "Compliance requested confirmation of retention windows across hot and cold storage tiers.",
  },
  {
    id: "TCK-1027",
    subject: "Mobile app login spinner never stops",
    requester: "Grace Evans",
    status: "Open",
    priority: "Urgent",
    createdDate: "2026-06-30T11:02:00.000Z",
    description:
      "Android users remain on loading spinner after successful authentication callback.",
  },
  {
    id: "TCK-1028",
    subject: "Customer profile photo upload fails",
    requester: "Samuel Edwards",
    status: "Resolved",
    priority: "Low",
    createdDate: "2026-06-08T16:33:00.000Z",
    description:
      "Issue traced to strict MIME check rejecting uppercase JPG extension; fixed.",
  },
  {
    id: "TCK-1029",
    subject: "Need bulk status update for old tickets",
    requester: "Chloe Collins",
    status: "In Progress",
    priority: "Medium",
    createdDate: "2026-06-07T14:22:00.000Z",
    description:
      "Support operations requested tooling to close stale tickets older than 180 days.",
  },
  {
    id: "TCK-1030",
    subject: "Intermittent 502 from public API gateway",
    requester: "David Stewart",
    status: "Open",
    priority: "Urgent",
    createdDate: "2026-06-30T12:19:00.000Z",
    description:
      "Burst traffic triggers upstream timeout path causing sporadic gateway errors.",
  },
];
