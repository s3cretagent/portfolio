# Shubh Malhotra — DevOps / SRE

[Visit Portfolio](https://s3cretagent.github.io/portfolio/)

---

## About Me

Software Engineer (DevOps/SRE) with 5+ years building and operating cloud infrastructure for high-traffic production platforms. Day to day that means Kubernetes and AWS at scale, Terraform-managed infrastructure, GitOps delivery, and observability that makes incidents short.

**Selected outcomes**

- 99.95%+ uptime SLA across production workloads on a 50+ microservice EKS platform
- 25 production EKS clusters provisioned and managed through Terraform
- New microservice onboarding reduced from 2+ days to under 30 minutes
- 35% MTTR reduction and a 50% shorter release cycle
- 60% higher deployment frequency, with zero-downtime releases for 18+ consecutive months
- ~20% cloud cost reduction, roughly $50K/year

**Details**

- **Title:** Software Engineer — DevOps / SRE
- **Location:** Bhopal, Madhya Pradesh, India
- **Email:** [shubhmalhotra07@gmail.com](mailto:shubhmalhotra07@gmail.com)
- **LinkedIn:** [Shubh Malhotra](https://www.linkedin.com/in/shubhmalhotra07)
- **GitHub:** [github.com/s3cretagent](https://github.com/s3cretagent)
- **Resume:** [Download PDF](resume.pdf)

---

## Experience

### Software Engineer, DevOps — Superhero Tech Pvt. Ltd., Bengaluru
**Jul 2025 – Present**

- Designed and operated a Kubernetes (EKS) platform serving 50+ microservices at scale; implemented HPA, VPA, Cluster Autoscaler and multi-AZ managed node groups maintaining 99.95%+ uptime SLA across all production workloads.
- Provisioned 25 production EKS clusters via Terraform IaC (VPC, EKS control plane, managed node groups, IAM/IRSA, EKS add-ons), with remote state in S3 + DynamoDB locking and workspaces per environment.
- Authored a shared Helm chart library (Deployments, HPA, PDB, Services, ExternalSecrets, CronJobs) adopted organisation-wide, reducing new microservice onboarding from 2+ days to under 30 minutes.
- Established GitOps delivery with ArgoCD using the app-of-apps pattern, sync waves, automated health checks and instant rollback, eliminating all manual `kubectl apply` operations in production.
- Built Woodpecker CI pipelines (build, test, lint, Trivy scan, ECR push) cutting the PR feedback loop to under 8 minutes across 30+ repositories; hardened AWS security with WAF, GuardDuty, SCPs and centralised CloudTrail for 1M+ monthly users.
- Streamlined Jenkins CI/CD with SonarQube and Trivy quality gates, cutting the release cycle by 50%. Deployed Prometheus (200+ targets), Grafana RED-method dashboards, Loki and PagerDuty alerting, driving a 35% MTTR reduction.

### Software Engineer, Senior SRE — Superhero Tech Pvt. Ltd., Bengaluru
**Apr 2022 – Jul 2025**

- Owned AWS infrastructure at scale: 100+ EC2 (Auto Scaling Groups), RDS Multi-AZ PostgreSQL, Lambda, CloudFront, EKS and ECR, handling millions of daily API requests against defined SLO targets.
- Architected AWS MSK (Managed Apache Kafka) for real-time event streaming; configured Debezium PostgreSQL CDC connectors for sub-second OLTP-to-analytical replication with zero data loss.
- Designed an RDS Read Replica topology with automated failover, offloading analytical queries and reducing primary DB load by ~40%.
- Engineered Jenkins multi-branch pipelines increasing deployment frequency by 60% and eliminating all SSH-based manual deployments.
- Led Blue-Green deployments with automated smoke tests and instant traffic switchback, achieving zero-downtime releases for 18+ consecutive months.
- Drove a 20% cloud cost reduction (~$50K/year) via EC2 Savings Plans, Reserved Instance analysis, Auto Scaling tuning and S3 lifecycle optimisation. Built GitHub Actions workflows with Trivy scanning, EKS rolling deployments and health gate verification.

### Software Engineer, SRE — Treebo Hotels, Bengaluru
**Jun 2021 – Apr 2022** (Intern: Jun 2021 – Dec 2021)

- Built production Jenkins pipelines integrated with AWS ECS, EC2 and S3; standardised deployment across 15+ microservices, reducing manual effort by 70% and cutting deployment errors to near zero.
- Instrumented Grafana dashboards and CloudWatch alarms for SLIs (latency P50/P95/P99, error rate, saturation), improving incident detection by 30% and driving a 25% reduction in repeat incidents through blameless post-mortems.
- Automated deployment and monitoring scripts in Python and Bash; built proficiency in PostgreSQL, AWS EC2/S3 and Linux systems, forming the foundation for subsequent SRE roles.

---

## Key Projects

### Cost Optimization Dashboard
`Grafana` · `AWS CloudWatch` · `Cost Explorer APIs` · `Python / Boto3`

Multi-account cost observability platform visualising spend per service, team and environment in real time. Automated instance right-sizing via Python/CloudWatch metrics, reducing monthly cloud costs by 25% and improving cross-team spend visibility.

### Database Migration Automation Framework
`Python` · `Boto3` · `AWS DMS` · `Debezium` · `Kafka`

Fully automated Python framework for zero-downtime database migration: provisions new RDS instances via Boto3, replicates schemas/tables/indexes/sequences, and configures AWS DMS tasks with full-load + CDC mode. Integrates Debezium connectors for downstream Kafka consumer sync.

### Kubernetes Cluster Provisioning Automation
`Terraform` · `EKS` · `Helm` · `IAM/IRSA`

Reusable Terraform modules (VPC, EKS, node groups, IAM/IRSA, add-ons) provisioning 25 EKS clusters with remote S3 state, DynamoDB locking and workspaces per environment. Paired Helm chart library enables new service onboarding in under 30 minutes.

---

## Technical Skills

| Area | Tools |
| --- | --- |
| **Cloud Platforms** | AWS (EC2, RDS, Lambda, EKS, ECR, S3, CloudFormation, CloudFront, WAF, Cost Explorer, DMS, MSK), GCP (VPC, VM, Cloud SQL, Secret Manager) |
| **Containers & Orchestration** | Kubernetes (EKS, 25+ clusters via Terraform), Docker, Helm (custom chart authoring), HPA, VPA, Cluster Autoscaler |
| **CI/CD & Automation** | Jenkins, GitHub Actions, ArgoCD (GitOps), Woodpecker CI, Python scripting, Bash/Linux |
| **Observability & Monitoring** | Grafana, Prometheus, Loki, CloudWatch, Alertmanager, PagerDuty, Incident Management |
| **Databases & Streaming** | PostgreSQL, AWS RDS (Multi-AZ, Read Replicas), AWS MSK (Managed Kafka), Debezium CDC Connectors |
| **AI-Assisted Engineering** | ChatGPT, Claude, Gemini, AugmentCode, AmpCode, CodeMux — daily use for IaC generation, code review and incident RCA |
| **Tools & Collaboration** | Jira, Confluence, Git, SonarQube, Trivy, PagerDuty, Slack, cross-team mentorship |

---

## Education

**IK Gujral Punjab Technical University**, Jalandhar, Punjab
Bachelor of Technology in Computer Science & Engineering · Jul 2018 – Jun 2022

---

## Certifications & Leadership

- AWS Educate Cloud 101 · AWS Educate Solutions Architect · Python Training, IIT Bombay · NASSCOM AI Practitioner
- Active in hackathons and innovation sprints; shipped multiple live projects within the organisation. Hosted technical workshops as part of the ACM Chapter, Chandigarh Engineering College.
- Mentored junior engineers on Kubernetes operations, CI/CD best practices and cloud cost optimisation.

---

## Contact

- **Email:** [shubhmalhotra07@gmail.com](mailto:shubhmalhotra07@gmail.com)
- **Phone:** +91-9654910542
- **LinkedIn:** [Shubh Malhotra](https://www.linkedin.com/in/shubhmalhotra07)
- **GitHub:** [s3cretagent](https://github.com/s3cretagent)

---

© 2026 Shubh Malhotra
