# ADR 0001: Dual-Dataset Strategy and Fixed-Horizon Transition Outcome

## Context
Predicting incident multimorbidity from a single chronic disease requires balancing sample size, event frequency, and local contextual validity. The Thai Health and Aging in Rapid Transition (HART) cohort may have constrained event counts for complex non-linear ML training. Furthermore, irregular wave intervals in HART (2-3 years) complicate longitudinal classification.

## Decision
1. We adopt a **Dual-Dataset Strategy**: We utilize international harmonized longitudinal cohorts (ELSA/HRS) for model pre-development/transfer benchmarking, and use the Thai HART cohort as the definitive target validation set (with internal HART fallback if event counts exceed 300).
2. We define the primary outcome as a **Fixed-Horizon Binary Transition Window (Pooled Person-Wave)** controlled by follow-up duration for core ML training and SHAP explainability, with discrete-time competing risk survival analysis as the secondary sensitivity benchmark.

## Consequences
- Ensures high statistical power and prevents overfitting during complex ML development.
- Provides strong academic novelty through cross-country transportability and TRIPOD+AI compliance.
- Requires explicit variable harmonization between HART and international survey codebooks.
