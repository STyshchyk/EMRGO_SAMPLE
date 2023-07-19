import os
import shutil


def update_js_to_jsx(root_dir):
    for dirpath, _, filenames in os.walk(root_dir):
        for filename in filenames:
            if filename.endswith('.js'):
                old_path = os.path.join(dirpath, filename)
                new_path = os.path.join(dirpath, filename[:-2] + 'jsx')
                shutil.move(old_path, new_path)
                print(f"Renamed: {old_path} -> {new_path}")


if __name__ == "__main__":
    # Replace this with the path to your target directory
    target_directory = "./src/components"
    update_js_to_jsx(target_directory)
