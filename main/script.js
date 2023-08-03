// Get references to HTML elements
const imageUpload = document.getElementById('imageUpload');
const pixelBoxSizeInput = document.getElementById('pixelBoxSize');
const generateButton = document.getElementById('generateButton');
const pixelArtContainer = document.getElementById('pixelArtContainer');
const downloadLink = document.getElementById('downloadLink');
const uploadedImageContainer = document.getElementById('uploadedImageContainer');

// Event listener for the generate button
generateButton.addEventListener('click', generatePixelArt);

// Function to generate pixel art
function generatePixelArt() {
    // Clear any previous pixel art and uploaded image
    pixelArtContainer.innerHTML = '';
    uploadedImageContainer.innerHTML = '';
    imageDimensions.textContent = '';

    // Get the uploaded image
    const imageFile = imageUpload.files[0];
    if (!imageFile) {
        alert('Please select an image file.');
        return;
    }

    // Read the image file
    const reader = new FileReader();
    reader.onload = function (event) {
        const image = new Image();
        image.onload = function () {
            // Display the original image dimensions
            imageDimensions.textContent = `Original Dimensions: ${image.width} x ${image.height}`;

            // Calculate the pixel box dimensions
            const pixelBoxSize = parseInt(pixelBoxSizeInput.value);
            if (!pixelBoxSize || pixelBoxSize < 1) {
                alert('Please enter a valid pixel box size.');
                return;
            }

            // Create a canvas to draw the image
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            canvas.width = image.width;
            canvas.height = image.height;
            ctx.drawImage(image, 0, 0);

            // Generate pixel art
            const pixelArtData = generatePixelArtData(ctx, pixelBoxSize);
            displayPixelArt(pixelArtData);

            // Display the uploaded image
            displayUploadedImage(image);
        };
        image.src = event.target.result;
    };
    reader.readAsDataURL(imageFile);
}

// Function to generate pixel art data
function generatePixelArtData(context, pixelBoxSize) {
    const imageData = context.getImageData(0, 0, context.canvas.width, context.canvas.height);
    const pixels = imageData.data;
  
    const pixelArtData = [];
  
    let startXOffset = 0;
    let endXOffset = 0;
    let startYOffset = 0;
    let endYOffset = 0;
  
    // Find the starting and ending offsets on the X-axis
    for (let x = 0; x < context.canvas.width; x++) {
      let isBlackColumn = true;
  
      for (let y = 0; y < context.canvas.height; y++) {
        const pixelIndex = (y * context.canvas.width + x) * 4;
        const [red, green, blue] = [pixels[pixelIndex], pixels[pixelIndex + 1], pixels[pixelIndex + 2]];
  
        if (red !== 0 || green !== 0 || blue !== 0) {
          isBlackColumn = false;
          break;
        }
      }
  
      if (!isBlackColumn) {
        startXOffset = x;
        break;
      }
    }
  
    for (let x = context.canvas.width - 1; x >= 0; x--) {
      let isBlackColumn = true;
  
      for (let y = 0; y < context.canvas.height; y++) {
        const pixelIndex = (y * context.canvas.width + x) * 4;
        const [red, green, blue] = [pixels[pixelIndex], pixels[pixelIndex + 1], pixels[pixelIndex + 2]];
  
        if (red !== 0 || green !== 0 || blue !== 0) {
          isBlackColumn = false;
          break;
        }
      }
  
      if (!isBlackColumn) {
        endXOffset = context.canvas.width - x - 1;
        break;
      }
    }
  
    // Find the starting and ending offsets on the Y-axis
    for (let y = 0; y < context.canvas.height; y++) {
      let isBlackRow = true;
  
      for (let x = 0; x < context.canvas.width; x++) {
        const pixelIndex = (y * context.canvas.width + x) * 4;
        const [red, green, blue] = [pixels[pixelIndex], pixels[pixelIndex + 1], pixels[pixelIndex + 2]];
  
        if (red !== 0 || green !== 0 || blue !== 0) {
          isBlackRow = false;
          break;
        }
      }
  
      if (!isBlackRow) {
        startYOffset = y;
        break;
      }
    }
  
    for (let y = context.canvas.height - 1; y >= 0; y--) {
      let isBlackRow = true;
  
      for (let x = 0; x < context.canvas.width; x++) {
        const pixelIndex = (y * context.canvas.width + x) * 4;
        const [red, green, blue] = [pixels[pixelIndex], pixels[pixelIndex + 1], pixels[pixelIndex + 2]];
  
        if (red !== 0 || green !== 0 || blue !== 0) {
          isBlackRow = false;
          break;
        }
      }
  
      if (!isBlackRow) {
        endYOffset = context.canvas.height - y - 1;
        break;
      }
    }
  
    // Calculate the adjusted canvas dimensions and starting coordinates
    const adjustedWidth = context.canvas.width - startXOffset - endXOffset;
    const adjustedHeight = context.canvas.height - startYOffset - endYOffset;
    const startX = startXOffset + Math.floor(endXOffset / 2);
    const startY = startYOffset + Math.floor(endYOffset / 2);
  
    // Generate pixel art based on the adjusted canvas dimensions and starting coordinates
    for (let y = startY; y < startY + adjustedHeight; y += pixelBoxSize) {
      for (let x = startX; x < startX + adjustedWidth; x += pixelBoxSize) {
        let redSum = 0;
        let greenSum = 0;
        let blueSum = 0;
        let alphaSum = 0;
        let pixelCount = 0;
  
        for (let j = 0; j < pixelBoxSize; j++) {
          for (let i = 0; i < pixelBoxSize; i++) {
            const pixelX = x + i;
            const pixelY = y + j;
            const pixelIndex = (pixelY * context.canvas.width + pixelX) * 4;
            redSum += pixels[pixelIndex];
            greenSum += pixels[pixelIndex + 1];
            blueSum += pixels[pixelIndex + 2];
            alphaSum += pixels[pixelIndex + 3];
            pixelCount++;
          }
        }
  
        const redAverage = Math.floor(redSum / pixelCount);
        const greenAverage = Math.floor(greenSum / pixelCount);
        const blueAverage = Math.floor(blueSum / pixelCount);
        const alphaAverage = Math.floor(alphaSum / pixelCount);
        const color = `rgba(${redAverage}, ${greenAverage}, ${blueAverage}, ${alphaAverage})`;
  
        pixelArtData.push(color);
      }
    }
  
    return pixelArtData;
  }  

// Function to display pixel art on the page
function displayPixelArt(pixelArtData) {
    const pixelBoxSize = parseInt(pixelBoxSizeInput.value);
    const containerWidth = pixelBoxSize * Math.ceil(Math.sqrt(pixelArtData.length));
    pixelArtContainer.style.width = containerWidth + 'px';

    for (let i = 0; i < pixelArtData.length; i++) {
        const pixelBox = document.createElement('div');
        pixelBox.className = 'pixel-box';
        pixelBox.style.backgroundColor = pixelArtData[i];
        pixelArtContainer.appendChild(pixelBox);
    }
}

// Function to display the uploaded image
function displayUploadedImage(image) {
    const uploadedImage = document.createElement('img');
    uploadedImage.src = image.src;
    uploadedImageContainer.appendChild(uploadedImage);

    // Calculate the container width and height based on the original image size
    const containerWidth = image.width;
    const containerHeight = image.height;

    // Set the container width and height to match the original image size
    uploadedImageContainer.style.width = containerWidth + 'px';
    uploadedImageContainer.style.height = containerHeight + 'px';

    // Calculate the pixel box size based on the closest fit
    const pixelBoxSize = calculatePixelBoxSize(containerWidth, containerHeight, pixelArtData.length);

    // Generate pixel art with the adjusted pixel box size
    const pixelArtData = generatePixelArtData(ctx, pixelBoxSize);

    // Calculate the adjusted container width and height
    const adjustedContainerWidth = pixelBoxSize * Math.ceil(containerWidth / pixelBoxSize);
    const adjustedContainerHeight = pixelBoxSize * Math.ceil(containerHeight / pixelBoxSize);

    // Set the pixel art container width and height to match the adjusted size
    pixelArtContainer.style.width = adjustedContainerWidth + 'px';
    pixelArtContainer.style.height = adjustedContainerHeight + 'px';

    // Display the pixel art with the adjusted pixel box size
    displayPixelArt(pixelArtData);
}

// Function to calculate the pixel box size based on the closest fit
function calculatePixelBoxSize(containerWidth, containerHeight, pixelCount) {
    const maxDimension = Math.max(containerWidth, containerHeight);
    const minDimension = Math.min(containerWidth, containerHeight);
    let pixelBoxSize = Math.round(Math.sqrt(pixelCount));

    while (pixelBoxSize > 1) {
        if (maxDimension % pixelBoxSize === 0 && minDimension % pixelBoxSize === 0) {
            break;
        }
        pixelBoxSize--;
    }

    return pixelBoxSize;
}