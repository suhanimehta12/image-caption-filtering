import cv2
import numpy as np


def apply_filter(
    img_rgb: np.ndarray,
    filter_type: str,
    ksize: int = 5,
    thresh1: int = 100,
    thresh2: int = 200,
    iterations: int = 1,
) -> np.ndarray:
    """Apply the selected filter to an RGB numpy array. Returns RGB numpy array."""

    img_bgr = cv2.cvtColor(img_rgb, cv2.COLOR_RGB2BGR)

    if filter_type == "Grayscale":
        gray     = cv2.cvtColor(img_bgr, cv2.COLOR_BGR2GRAY)
        filtered = cv2.cvtColor(gray, cv2.COLOR_GRAY2RGB)

    elif filter_type == "Gaussian Blur":
        k        = ksize if ksize % 2 == 1 else ksize + 1
        blurred  = cv2.GaussianBlur(img_bgr, (k, k), 0)
        filtered = cv2.cvtColor(blurred, cv2.COLOR_BGR2RGB)

    elif filter_type == "Edge Detection":
        gray     = cv2.cvtColor(img_bgr, cv2.COLOR_BGR2GRAY)
        edges    = cv2.Canny(gray, thresh1, thresh2)
        filtered = cv2.cvtColor(edges, cv2.COLOR_GRAY2RGB)

    elif filter_type == "Median Blur":
        k        = ksize if ksize % 2 == 1 else ksize + 1
        blurred  = cv2.medianBlur(img_bgr, k)
        filtered = cv2.cvtColor(blurred, cv2.COLOR_BGR2RGB)

    elif filter_type == "Erosion":
        kernel   = np.ones((5, 5), np.uint8)
        eroded   = cv2.erode(img_bgr, kernel, iterations=iterations)
        filtered = cv2.cvtColor(eroded, cv2.COLOR_BGR2RGB)

    elif filter_type == "Dilation":
        kernel   = np.ones((5, 5), np.uint8)
        dilated  = cv2.dilate(img_bgr, kernel, iterations=iterations)
        filtered = cv2.cvtColor(dilated, cv2.COLOR_BGR2RGB)

    elif filter_type == "Sharpening":
        kernel   = np.array([[0, -1, 0], [-1, 5, -1], [0, -1, 0]])
        sharp    = cv2.filter2D(img_bgr, -1, kernel)
        filtered = cv2.cvtColor(sharp, cv2.COLOR_BGR2RGB)

    elif filter_type == "Sepia":
        sepia_kernel = np.array(
            [[0.272, 0.534, 0.131],
             [0.349, 0.686, 0.168],
             [0.393, 0.769, 0.189]]
        )
        sepia    = cv2.transform(img_rgb.astype(np.float32) / 255, sepia_kernel)
        filtered = np.clip(sepia * 255, 0, 255).astype(np.uint8)

    elif filter_type == "Emboss":
        kernel   = np.array([[-2, -1, 0], [-1, 1, 1], [0, 1, 2]])
        embossed = cv2.filter2D(img_bgr, -1, kernel) + 128
        filtered = cv2.cvtColor(embossed, cv2.COLOR_BGR2RGB)

    elif filter_type == "Invert":
        filtered = cv2.bitwise_not(img_rgb)

    else:
        filtered = img_rgb

    return filtered
