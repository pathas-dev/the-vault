# Agent Guidelines for The Vault Project

This file contains critical instructions for any AI Agent or code generation tool operating within "The Vault" project workspace. 

## 1. Design System Adherence
**Before creating or modifying any UI components, layouts, or design tokens, you MUST read and comprehend the instructions outlined in `DESIGN.md`.**

The `DESIGN.md` document outlines "The Shadow Architect" design philosophy, specific color hierarchies, typography constraints (using Noto Serif KR & Manrope), and component styling (e.g., Glass & Gold rule, No-Line rule).

- You are NOT permitted to use generic Tailwind utility combinations that violate these rules.
- Do NOT use 1px solid borders for visual sectioning, use surface color stacking as specified.
- Only utilize the specific thematic tones (primary, surface-container-highest, etc.) documented in the color palette.

## 2. Component Generation
When asked to create new elements:
- Use Tailwind CSS v4 variables mapped properly in the global `.css` file.
- Combine components logically holding true to the atmosphere: asymmetric layouts, intentional empty spaces, and high-end aesthetic gradients.
- Build off the structured components (like Buttons, The Ledger Item logic) detailed in `DESIGN.md`.

*Failure to adhere to these design constraints will break the intentional premium aesthetic of The Vault.*
