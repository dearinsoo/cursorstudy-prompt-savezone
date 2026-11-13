#!/usr/bin/env python3
"""Convert Excel prompt sheet to public/prompts.json."""

from __future__ import annotations

import argparse
import json
import os
from pathlib import Path

import pandas as pd

ROOT = Path(__file__).resolve().parent.parent
DEFAULT_INPUT = Path.home() / "Downloads" / "나만의 프롬프트.xlsx"
OUTPUT = ROOT / "public" / "prompts.json"

NAME_COL = "프롬프트의 이름"
PROMPT_COL = "프롬프트"


def main() -> None:
    parser = argparse.ArgumentParser(description="Convert prompts xlsx to JSON")
    parser.add_argument(
        "--input",
        type=Path,
        default=Path(os.environ.get("PROMPTS_XLSX", DEFAULT_INPUT)),
        help="Path to Excel file",
    )
    args = parser.parse_args()

    if not args.input.is_file():
        raise SystemExit(f"Input file not found: {args.input}")

    df = pd.read_excel(args.input)
    if NAME_COL not in df.columns or PROMPT_COL not in df.columns:
        raise SystemExit(
            f"Expected columns {NAME_COL!r}, {PROMPT_COL!r}; got {list(df.columns)}"
        )

    rows: list[dict[str, object]] = []
    for i, row in df.iterrows():
        name = row[NAME_COL]
        prompt = row[PROMPT_COL]
        if pd.isna(name) and pd.isna(prompt):
            continue
        rows.append(
            {
                "id": int(i) + 1,
                "name": "" if pd.isna(name) else str(name).strip(),
                "prompt": "" if pd.isna(prompt) else str(prompt).strip(),
            }
        )

    OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    with OUTPUT.open("w", encoding="utf-8") as f:
        json.dump(rows, f, ensure_ascii=False, indent=2)

    print(f"Wrote {len(rows)} prompts to {OUTPUT}")


if __name__ == "__main__":
    main()
