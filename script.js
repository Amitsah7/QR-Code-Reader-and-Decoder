// QR Code Reader
const readerBox = document.querySelector(".reader_box"),
    form = document.querySelector("form"),
    fileInp = form.querySelector("input"),
    infoText = form.querySelector("p"),
    iFont = form.querySelector("i"),
    closeBtn = document.querySelector(".closeBtn"),
    copyBtn = document.querySelector(".copyBtn"),
    loader = document.querySelector("#loader");

// This function now uses jsQR to read the QR code from the local file
function fetchRequest(file) {
    iFont.style.display = 'none';
    loader.style.display = 'block';
    infoText.innerText = "Scanning QR Code...";

    const reader = new FileReader();
    reader.onload = function(event) {
        const img = new Image();
        img.onload = function() {
            const canvas = document.createElement('canvas');
            const context = canvas.getContext('2d');
            canvas.width = img.width;
            canvas.height = img.height;
            context.drawImage(img, 0, 0, img.width, img.height);
            const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
            const code = jsQR(imageData.data, imageData.width, imageData.height);

            let result = code ? code.data : null;
            infoText.innerText = result ? `Click To Choose Or Drop QR Code To Read` : "Couldn't Scan QR Code...Click To Choose Or Drop Another QR Code To Read";
            loader.style.display = 'none';
            if (!result) return;
            document.querySelector("textarea").innerText = result;
            form.querySelector("img").src = URL.createObjectURL(file);
            readerBox.classList.add("active");
        };
        img.src = event.target.result;
    };
    reader.readAsDataURL(file);
}

fileInp.addEventListener("change", e => {
    let file = e.target.files[0];
    if (!file) return;
    fetchRequest(file);
});

copyBtn.addEventListener("click", () => {
    let text = document.querySelector("textarea").textContent;
    navigator.clipboard.writeText(text);
    showToast();
});

form.addEventListener("click", () => fileInp.click());

closeBtn.addEventListener("click", () => {
    loader.style.display = 'none';
    iFont.style.display = 'block';
    readerBox.classList.remove("active");
});

// Drag & Drop
form.addEventListener("dragenter", (e) => {
    e.preventDefault();
    e.stopPropagation();
    form.classList.add("drop_active");
}, false);

form.addEventListener("dragleave", (e) => {
    e.preventDefault();
    e.stopPropagation();
    form.classList.remove("drop_active");
}, false);

form.addEventListener("dragover", (e) => {
    e.preventDefault();
    e.stopPropagation();
    form.classList.add("drop_active");
}, false);

form.addEventListener("drop", (e) => {
    e.preventDefault();
    e.stopPropagation();
    form.classList.remove("drop_active");
    
    let file = e.dataTransfer.files[0];
    
    if (file) {
        fetchRequest(file);
    }
}, false);

// End QR Code Reader

// QR Code Generator
const showQr = document.querySelector(".show_qr");
const userInput = document.getElementById("userInput");
const submitBtn = document.getElementById("submitBtn");
const cancelBtn = document.getElementById("cancelBtn");
const downloadBtn = document.getElementById("downloadBtn");

let QR_Code;

const inputFormatter = (value) => {
    // This function can be used for cleaning up the filename
    return value.replace(/[^a-z0-9A-Z]+/g, "");
};

submitBtn.addEventListener("click", () => {
    showQr.innerHTML = "";
    new QRCode(showQr, {
        text: userInput.value,
        width: 256,
        height: 256
    });

    // Use a small delay to ensure the QR code image is rendered before we try to get its source
    setTimeout(() => {
        const src = showQr.querySelector("img").src;
        downloadBtn.href = src;
        
        let filename = inputFormatter(userInput.value) || 'CosaslearningQR';
        downloadBtn.download = `${filename}.png`;
        
        downloadBtn.classList.remove("hide");
        submitBtn.classList.add("hide");
        cancelBtn.classList.remove("hide");
        submitBtn.disabled = true;
    }, 100);
});

userInput.addEventListener("input", () => {
    if (userInput.value.trim().length < 1) {
        submitBtn.disabled = true;
    } else {
        submitBtn.disabled = false;
    }
});

cancelBtn.addEventListener("click", () => {
    resetGenerator();
});

function resetGenerator() {
    showQr.innerHTML = "";
    userInput.value = "";
    downloadBtn.classList.add("hide");
    cancelBtn.classList.add("hide");
    submitBtn.disabled = true;
    submitBtn.classList.remove("hide");
}

window.onload = () => {
    resetGenerator();
};

// End QR Code Generator

// Toast Notification
let toastBox = document.getElementById('toastBox');

function showToast() {
    let toast = document.createElement('div');
    toast.classList.add('toast');
    toast.innerHTML = '<i class="fa-solid fa-circle-check"></i> Copied!';
    toastBox.appendChild(toast);

    setTimeout(() => {
        toast.remove();
    }, 3000);
}
// End Toast Notification