# Digital Health Capstone - Multimorbidity Transition Project

This context encompasses the clinical epidemiology, predictive modeling, and primary care decision support for older adults transitioning from a single chronic disease to multimorbidity.

## Language

**Index Disease**:
The single confirmed chronic condition present at the baseline examination before any disease transition occurs.
_Avoid_: Primary diagnosis, baseline morbidity, initial symptom

**Incident Multimorbidity**:
The longitudinal transition where an individual with exactly one chronic condition accumulates one or more additional diagnosed chronic conditions ($\ge 2$ total conditions) during the follow-up window.
_Avoid_: Morbidity progression, disease worsening, comorbidity onset

**Competing Risk of Death**:
An event (mortality) that occurs before the transition to multimorbidity, precluding the observation of the transition outcome.
_Avoid_: Drop-out, loss to follow-up, censoring

**Simple Clinical Baseline**:
A parsimonious logistic regression model incorporating only chronological age and the categorical identity of the Index Disease.
_Avoid_: Naive model, dummy classifier, rule-based baseline

**Decision Curve Analysis (DCA)**:
A clinical utility evaluation method quantifying the net clinical benefit of threshold-based intervention strategies compared against "treat all" or "treat none".
_Avoid_: Cost-benefit curve, ROC curve, profit matrix
