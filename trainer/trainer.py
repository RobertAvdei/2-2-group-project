import os
import argparse
import yaml
import pandas as pd
import torch.backends.cudnn as cudnn

from train import train
from utils import AttrDict


def get_config(file_path: str) -> AttrDict:
    """Load and prepare training configuration."""
    with open(file_path, "r", encoding="utf8") as stream:
        opt = yaml.safe_load(stream)

    opt = AttrDict(opt)

    if opt.lang_char == "None":
        characters = ""
        for data in opt.select_data.split("-"):
            csv_path = os.path.join(
                opt.train_data, data, "labels.csv"
            )
            df = pd.read_csv(
                csv_path,
                sep="^([^,]+),",
                engine="python",
                usecols=["filename", "words"],
                keep_default_na=False,
            )
            all_char = "".join(df["words"])
            characters += "".join(set(all_char))

        opt.character = "".join(sorted(set(characters)))
    else:
        opt.character = opt.number + opt.symbol + opt.lang_char

    os.makedirs(f"./saved_models/{opt.experiment_name}", exist_ok=True)
    return opt


def main():
    parser = argparse.ArgumentParser(description="Training entrypoint")
    parser.add_argument(
        "--config",
        type=str,
        default="trainer/config_files/en_filtered_config.yaml",
        help="Path to YAML config file",
    )
    parser.add_argument(
        "--amp",
        action="store_true",
        help="Enable automatic mixed precision",
    )

    args = parser.parse_args()

    cudnn.benchmark = True
    cudnn.deterministic = False

    opt = get_config(args.config)
    train(opt, amp=args.amp)


if __name__ == "__main__":
    main()
