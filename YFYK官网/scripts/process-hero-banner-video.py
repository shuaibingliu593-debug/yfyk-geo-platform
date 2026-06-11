#!/usr/bin/env python3
"""Process hero banner background video with feathered watermark blur."""

import argparse
import imageio_ffmpeg
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
FFMPEG = imageio_ffmpeg.get_ffmpeg_exe()


def feathered_blend(x0: int, x1: int, y0: int, y1: int, feather_x: int, feather_y: int, strength: float) -> str:
    alpha = (
        f"min(min((X-{x0})/{feather_x},1),min(({x1}-X)/{feather_x},1))*"
        f"min(min((Y-{y0})/{feather_y},1),min(({y1}-Y)/{feather_y},1))*{strength}"
    )
    region = f"between(X,{x0},{x1})*between(Y,{y0},{y1})"
    return f"if({region},A*(1-{alpha})+B*{alpha},A)"


def build_filter(blur_regions: list[dict]) -> str:
    split_count = len(blur_regions) + 1
    split_outputs = [f"[blur{i}]" for i in range(len(blur_regions))]
    split_labels = "".join(split_outputs)
    parts = [f"[0:v]split={split_count}[base]{split_labels};"]
    current = "base"

    for index, region in enumerate(blur_regions):
        blur_label = f"blur{index}"
        out_label = f"v{index}"
        sigma = region["sigma"]
        blend = feathered_blend(
            x0=region["x0"],
            x1=region["x1"],
            y0=region["y0"],
            y1=region["y1"],
            feather_x=region["feather_x"],
            feather_y=region["feather_y"],
            strength=region["strength"],
        )
        parts.append(f"[{blur_label}]gblur=sigma={sigma}[{blur_label}g];")
        parts.append(f"[{current}][{blur_label}g]blend=all_expr='{blend}':shortest=1[{out_label}];")
        current = out_label

    parts.append(f"[{current}]format=yuv420p")
    return "".join(parts)


def run(cmd: list[str]) -> None:
    print(" ".join(cmd))
    subprocess.run(cmd, check=True)


PRESETS = {
    "workspace": {
        "input": Path(
            "/Users/ws/Downloads/stock-footage-computer-monitors-in-empty-startup-workspace-with-cloud-computing-ai-resources-pc-screens-in.mp4"
        ),
        "duration": 8.0,
        "output_name": "hero-banner-8s.mp4",
        "poster_name": "hero-banner-workspace-poster.jpg",
        "blur_regions": [
            {
                "x0": 155,
                "x1": 745,
                "y0": 185,
                "y1": 405,
                "feather_x": 72,
                "feather_y": 55,
                "strength": 0.9,
                "sigma": 24,
            },
        ],
    },
    "monument": {
        "input": Path("/Users/ws/Downloads/gettyimages-1301371350-640_adpp.mp4"),
        "duration": None,
        "output_name": "hero-banner-5s.mp4",
        "poster_name": "hero-banner-monument-poster.jpg",
        "blur_regions": [
            {
                "x0": 130,
                "x1": 602,
                "y0": 158,
                "y1": 292,
                "feather_x": 55,
                "feather_y": 45,
                "strength": 0.88,
                "sigma": 22,
            },
            {
                "x0": 0,
                "x1": 290,
                "y0": 338,
                "y1": 432,
                "feather_x": 40,
                "feather_y": 32,
                "strength": 0.98,
                "sigma": 32,
            },
            {
                "x0": 0,
                "x1": 230,
                "y0": 384,
                "y1": 432,
                "feather_x": 22,
                "feather_y": 16,
                "strength": 1.0,
                "sigma": 38,
            },
        ],
    },
}


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--preset", choices=PRESETS.keys(), default="workspace")
    parser.add_argument("--input", type=Path)
    parser.add_argument("--duration", type=float)
    parser.add_argument("--output-dir", type=Path, default=ROOT / "public" / "videos")
    parser.add_argument("--output-name")
    parser.add_argument("--poster-name")
    args = parser.parse_args()

    preset = PRESETS[args.preset]
    input_path = args.input or preset["input"]
    duration = args.duration if args.duration is not None else preset["duration"]
    output_dir = args.output_dir
    output_video = output_dir / (args.output_name or preset["output_name"])
    output_poster = output_dir / (args.poster_name or preset["poster_name"])
    blur_regions = preset["blur_regions"]

    if not input_path.is_file():
        print(f"Missing input: {input_path}", file=sys.stderr)
        return 1

    output_dir.mkdir(parents=True, exist_ok=True)
    filter_graph = build_filter(blur_regions)

    encode_cmd = [FFMPEG, "-y", "-i", str(input_path)]
    if duration is not None:
        encode_cmd.extend(["-t", str(duration)])
    encode_cmd.extend(
        [
            "-filter_complex",
            filter_graph,
            "-an",
            "-c:v",
            "libx264",
            "-crf",
            "22",
            "-preset",
            "medium",
            "-movflags",
            "+faststart",
            str(output_video),
        ]
    )
    run(encode_cmd)

    run(
        [
            FFMPEG,
            "-y",
            "-i",
            str(output_video),
            "-vframes",
            "1",
            "-update",
            "1",
            str(output_poster),
        ]
    )

    print(f"Wrote {output_video} ({output_video.stat().st_size} bytes)")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
