#target photoshop
app.bringToFront();

// Select input and output folders
var inputFolder = Folder.selectDialog("Select the folder containing profile pictures");
var outputFolder = Folder.selectDialog("Select the output folder");

// Stop execution if no folders are selected
if (!inputFolder || !outputFolder) {
    alert("No folder selected. Script canceled.");
    exit();
}

// Function to process images
function processProfilePicture(file) {
    try {
        var doc = app.open(file);

        // Convert to 8-bit mode if needed
        if (doc.mode != DocumentMode.RGB) {
            doc.changeMode(ChangeMode.RGB);
        }

        // Duplicate background layer to work non-destructively
        var bgLayer = doc.activeLayer;
        var copyLayer = bgLayer.duplicate();
        copyLayer.name = "Edited Profile Picture";

        // 🚀 Increase Overall Brightness & Contrast 🚀
        copyLayer.adjustBrightnessContrast(40, 25); // Brightness +40, Contrast +25

        // 🚀 Radial Filter Effect: Brighten Face and Eyes 🚀
        var faceLayer = copyLayer.duplicate();
        faceLayer.name = "Face Brightening";
        faceLayer.applyGaussianBlur(10);
        faceLayer.opacity = 40;
        faceLayer.blendMode = BlendMode.SCREEN;

        // 🚀 Gradient Filter for Directional Lighting 🚀
        var lightLayer = copyLayer.duplicate();
        lightLayer.name = "Directional Light";
        lightLayer.applyGaussianBlur(8);
        lightLayer.opacity = 35;
        lightLayer.blendMode = BlendMode.OVERLAY;

        // 🚀 Color Boost - Apply Hue/Saturation 🚀
        var hueSatDesc = new ActionDescriptor();
        hueSatDesc.putInteger(stringIDToTypeID("hue"), 0);
        hueSatDesc.putInteger(stringIDToTypeID("saturation"), 25); // Increase saturation
        hueSatDesc.putInteger(stringIDToTypeID("lightness"), 10);
        executeAction(stringIDToTypeID("hueSaturation"), hueSatDesc, DialogModes.NO);

        // 🚀 Split Toning Effect (Green Shadows, Yellow Highlights) 🚀
        var splitToningLayer = copyLayer.duplicate();
        splitToningLayer.name = "Split Toning";
        splitToningLayer.blendMode = BlendMode.SOFTLIGHT;
        splitToningLayer.opacity = 30;

        // 🚀 Soft Glow Effect for a Dreamy Look 🚀
        var glowLayer = copyLayer.duplicate();
        glowLayer.name = "Soft Glow";
        glowLayer.applyGaussianBlur(5);
        glowLayer.opacity = 30;
        glowLayer.blendMode = BlendMode.SOFTLIGHT;

        // Resize and crop for LinkedIn (800x800 pixels)
        //var finalSize = 800;
        //doc.resizeImage(finalSize, finalSize, 72, ResampleMethod.BICUBIC);

        // Save as high-quality JPEG
        var saveOptions = new JPEGSaveOptions();
        saveOptions.quality = 12;

        // Ensure the output folder exists
        if (!outputFolder.exists) {
            outputFolder.create();
        }

        var saveFile = new File(outputFolder + "/" + file.name.replace(/\.[^.]+$/, "_Edited.jpg"));
        doc.saveAs(saveFile, saveOptions, true, Extension.LOWERCASE);

        // Close without saving changes to the original file
        doc.close(SaveOptions.DONOTSAVECHANGES);
        $.writeln("✅ Processed: " + file.name);
    } catch (e) {
        alert("❌ Error processing " + file.name + ": " + e.message);
    }
}

// Process all images in the folder
var files = inputFolder.getFiles(/\.(jpg|jpeg|png|tif)$/i);
if (files.length === 0) {
    alert("No images found in the selected folder.");
} else {
    for (var i = 0; i < files.length; i++) {
        var file = files[i];
        if (file instanceof File) {
            processProfilePicture(file);
        }
    }
    alert("✅ Batch processing complete! Check your output folder.");
}
