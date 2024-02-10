    // Get references to HTML elements
    const imageFileInput = document.getElementById("imageFileInput");
    const canvas = document.getElementById("meme");
    const textInput = document.getElementById("textInput");
    const fontSizeSlider = document.getElementById("font-size-slider");
    const addButton = document.getElementById("addButton");
    const downloadButton = document.getElementById("btn-download");
    const removeButton = document.getElementById("removeButton");

    // Get 2D rendering context for the canvas
    const ctx = canvas.getContext("2d");

    // Variables to store image, text inputs, and selected text input index
    let image;
    let textInputs = [];
    let selectedTextInputIndex = -1;
    let isDragging = false;
    let draggedTextInputIndex;
    let dragStartX, dragStartY;

    // Event listener for file input change (image selection)
    imageFileInput.addEventListener("change", (e) => {
      // Create object URL for the selected image file
      const imageDataUrl = URL.createObjectURL(e.target.files[0]);

      // Create image object and set its source to the object URL
      image = new Image();
      image.src = imageDataUrl;

      // When the image is loaded, draw the meme
      image.onload = () => {
        // Calculate aspect ratio and adjust canvas dimensions
        const aspectRatio = image.width / image.height;

        // Set canvas width and height based on the desired width (e.g., 500)
        const canvasWidth = 600;
        const canvasHeight = canvasWidth / aspectRatio;

        canvas.width = canvasWidth;
        canvas.height = canvasHeight;

        drawMeme();
      };
    });


    // Event listener for text input change
    textInput.addEventListener("input", drawMeme);

    // Event listener for font size slider change
    fontSizeSlider.addEventListener("input", drawMeme);

    // Event listener for add text button click
    addButton.addEventListener("click", addText);

    // Event listener for remove text button click
    removeButton.addEventListener("click", removeText);

    // Event listeners for canvas mouse interactions
    canvas.addEventListener("mousedown", handleMouseDown);
    canvas.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("mouseup", handleMouseUp);

    // Event listener for save button click
    downloadButton.addEventListener("click", saveMeme);

    // Function to draw the meme on the canvas
    function drawMeme() {
      const width = canvas.width;
      const height = canvas.height;

      // Clear the canvas
      ctx.clearRect(0, 0, width, height);

      // Draw the image if available
      if (image) {
        // Calculate position to center the image in the canvas
        const x = (width - image.width) / 2;
        const y = (height - image.height) / 2;

        ctx.drawImage(image, x, y);
      }

      // Draw each text input on the canvas
      for (let i = 0; i < textInputs.length; i++) {
        const { text, x, y, fontSize } = textInputs[i];

        // Set text styling
        ctx.strokeStyle = "black";
        ctx.lineWidth = Math.floor(fontSize / 4);
        ctx.fillStyle = "white";
        ctx.textAlign = "center";
        ctx.lineJoin = "round";
        ctx.font = `${fontSize}px sans-serif`;

        // Draw text on the canvas
        ctx.textBaseline = "top";
        ctx.strokeText(text, x, y);
        ctx.fillText(text, x, y);
      }
    }

    // Function to add a text input to the meme
    function addText() {
      const text = textInput.value;
      const fontSize = fontSizeSlider.value;
      const x = canvas.width / 2; // Initial x position at the center
      const y = canvas.height / 2; // Initial y position at the center

      // Add the new text input to the array
      textInputs.push({ text, x, y, fontSize });

      // Redraw the meme with the new text input
      drawMeme();
    }

    // Function to remove the selected text input
    function removeText() {
      if (selectedTextInputIndex !== -1) {
        // Remove the selected text input from the array
        textInputs.splice(selectedTextInputIndex, 1);

        // Clear the selected text input index
        selectedTextInputIndex = -1;

        // Redraw the meme without the removed text input
        drawMeme();
      }
    }

    // Function to handle mouse down event on the canvas
    function handleMouseDown(e) {
      const mouseX = e.clientX - canvas.getBoundingClientRect().left;
      const mouseY = e.clientY - canvas.getBoundingClientRect().top;

      // Check if the mouse is over a text input
      for (let i = textInputs.length - 1; i >= 0; i--) {
        const { x, y, fontSize } = textInputs[i];

        // If the mouse is over a text input, start dragging
        if (
          mouseX >= x - fontSize / 2 &&
          mouseX <= x + fontSize / 2 &&
          mouseY >= y &&
          mouseY <= y + fontSize
        ) {
          isDragging = true;
          draggedTextInputIndex = i;
          dragStartX = mouseX - x;
          dragStartY = mouseY - y;
          break; // Stop checking further textInputs
        }
      }

      // Check if a text input is selected and update the font size slider
      if (isDragging) {
        selectedTextInputIndex = draggedTextInputIndex;
        fontSizeSlider.value = textInputs[selectedTextInputIndex].fontSize;
      } else {
        selectedTextInputIndex = -1;
      }
    }

    // Function to handle mouse move event on the canvas (during dragging)
    function handleMouseMove(e) {
      if (isDragging) {
        const mouseX = e.clientX - canvas.getBoundingClientRect().left;
        const mouseY = e.clientY - canvas.getBoundingClientRect().top;

        // Update the position of the dragged text input
        const draggedTextInput = textInputs[draggedTextInputIndex];
        draggedTextInput.x = mouseX - dragStartX;
        draggedTextInput.y = mouseY - dragStartY;

        // Redraw the meme with the updated text input position
        drawMeme();
      }
    }

    // Function to handle mouse up event on the canvas (end of dragging)
    function handleMouseUp() {
      isDragging = false;
    }

    // Function to save the meme as an image
    function saveMeme() {
      const dataURL = canvas.toDataURL("image/png");
      downloadButton.href = dataURL;
    }