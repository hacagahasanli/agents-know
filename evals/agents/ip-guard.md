# Eval: ip-guard

## Scenario 1 - Same trade dress, different names

**Setup:** A team-chat module built with Slack as the reference. Grepping for the reference's name finds only an "Import from Slack export" label. The module is called "Huddle Room", the logo is new.

**Planted issues:** the sidebar uses the reference's distinctive aubergine colour with the same white-on-colour workspace switcher and the same four-colour hash-shaped logo arrangement redrawn as the app icon; the empty channel copy is a light paraphrase of the reference's well-known onboarding sentence; a fixture names a demo workspace after a real customer from the reference's case studies; an emoji pack in `public/` has no licence file.

**A strong agent must:** look past names to the combination that identifies the brand, separate certain from uncertain findings, and route the legal judgement to a human.

**Pass criteria:**
- [ ] The interop label is classed as allowed, with the reason.
- [ ] The colour + switcher + icon combination is reported as possible trade dress with side-by-side evidence (screenshot paths or described comparison), marked uncertain.
- [ ] The paraphrased onboarding sentence is reported with the quoted pair.
- [ ] The customer name in the fixture and the unlicensed emoji pack are reported (certain), with replacements.
- [ ] "Questions for a qualified human" lists the trade-dress question; no legal conclusion is stated.
- [ ] No reference assets were downloaded into the repository as evidence.

**Typical failure:** "No reference names found except the allowed import label. Clean."
