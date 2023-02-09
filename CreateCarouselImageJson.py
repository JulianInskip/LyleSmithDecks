import os
import json

wksp = r"C:\GISData\decksmith\responsive-made-easy-master\img\carousel"
config_json = {"categories": {}}

for dirname, dirnames, filenames in os.walk(wksp):
    file_count = 0
    carousel_images = {os.path.basename(dirname): {}}
    file_json = {}
    if dirname.endswith("carousel"):
        continue
    for filename in filenames:
        file_path = os.path.join(dirname, filename)
        print(f"file path: {file_path}")
        # file_json["carousel-images"] = {".".join(filename.split(".")[:-1])}
        file_json[".".join(filename.split(".")[:-1])] = {"filename": os.path.join(r"img\carousel",os.path.basename(dirname), filename)}
        file_count += 1
    carousel_images[os.path.basename(dirname)]["carousel-images"] = file_json
    config_json["categories"] = carousel_images
print(json.dumps(config_json, indent=2))
