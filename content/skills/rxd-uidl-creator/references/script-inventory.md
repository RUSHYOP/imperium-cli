# Script Inventory

Use this inventory to decide which scripts are part of the official authoring flow and which are only diagnostics.

## Official Generation / Authoring

- `scripts/gen-component-schema.js`
- `scripts/sync-nebula-foundations.js`
- `scripts/create-project-page.js`
- `scripts/new-page.sh`
- `scripts/uidl-mcp-smoke.js`

## Official Validation / Verification

- `scripts/validate-uidl.js`
- `scripts/uidl-check.js`
- `samples/simulate_runtime.js`
- `samples/test_full_flow.js`
- `samples/run_uidl_save.js`
- `samples/validate_import.py`

## Diagnostics / Investigation Only

- `samples/analyze.js`
- `samples/analyze2.js`
- `samples/check_children.js`
- `samples/check_components.py`
- `samples/check_issues.js`
- `samples/check_listview.py`
- `samples/compare_nodes.py`
- `samples/deep_audit.py`
- `samples/final_check.py`
- `samples/fix_buyer_hub.py`
- `samples/fix_issues.js`
- `samples/fix_listview.py`
- `samples/gen_showcase.py`
- `samples/scan_uidl.py`
- `samples/verify_fixes.js`

## Practical Rule

If you are building or validating real page files under `projects/`, stay on the official scripts first and use the diagnostics only when you are debugging a specific failure.
