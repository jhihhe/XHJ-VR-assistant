# Case Scope

## meta
- case_id: xhj-refresh
- created: 2026-09-05T17:12:24+08:00
- operator: local
- project_root: /Users/mac/Pictures/工作/其他/trae_xhjvrskin
- primary_skill: browser-automation/SKILL.md
- primary_id: R19
- lead_role: lead
- specialist_roles: []
- hint: browser automation
- preset: none

## auth
- status: granted
- basis: explicit_user
- evidence_of_auth: User supplied test account and requested page source collection and userscript redesign
- MUST NOT proceed if status != granted

## in_scope
- assets:
  - https://vr.xhj.com/houseadmin/index
  - https://vr.xhj.com/houseadmin/
- surfaces: []
- activities: []

## out_of_scope
- assets: []
- activities: [dos, phishing_real_users, unrestricted_exfil]

## network_profile
- mode: authorized_target_only
- notes: |
    offline | lab_only | authorized_target_only | unrestricted_lab
    Change mode only after auth.status = granted.
    Presets: offline-sample | ctf-public | own-system

## deliverables
- report: true
- field_journal: true
- diagrams: true
- timeline: true

## constraints
- timebox: {}
- stealth: low
- data_handling: anonymize

## signoff
- ready_for_act: true
- checklist:
  - [x] auth.status = granted
  - [x] in_scope.assets non-empty OR offline sample path set
  - [x] network_profile.mode chosen
  - [ ] out_of_scope reviewed
  - [ ] roles assigned (see skills/ops/role-map.md)

## ops_refs
- skills/ops/scope-contract.md
- skills/ops/evidence-finding-path.md
- skills/ops/role-map.md
- skills/ops/timeline-workitem.md
- skills/ops/IDENTITY.md
