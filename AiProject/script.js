const generateForm = document.querySelector(".generate-form");
const imageGallery = document.querySelector(".image-gallery");

const OPENAI_API_KEY ="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"

let isImageGenerating = false;


const updateImageCard = (imgDataArray) => {
    imgDataArray.forEach((imgObject, index) => {
        const imgCard = imageGallery.querySelectorAll(".img-card")[index]
        const imgElement = imgCard.querySelector("img")
        const downloadBtn = imgCard.querySelector("download-btn")

        const aiGeneratedImg = `data:image/jpeg;base64, ${imgObject.b64_json}`
        imgElement.src = aiGeneratedImg

        imgElement.onload = () => {
            imgCard.classList.remove("loading")
            downloadBtn.setAttribute("href", aiGeneratedImg)
            downloadBtn.setAttribute("download", `${new Date().getTime()}.jpg`)
        }

    });
}

const generateAiImages = async (userPromt,userImgQuantity) => {
    try {
        const response = await fetch("https://api.openai.com/v1/images/generations", {
            method : "POST",
            headers : {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${OPENAI_API_KEY}`
            },
            body : JSON.stringify({
                prompt : userPromt,
                n: parseInt(userImgQuantity),
                size: "512x512",
                response_format : "b64_json"
            })
        })

        const { data } = await response.json()
        updateImageCard([...data])
    } catch (error) {
        console.log(error)
    }finally{
        isImageGenerating = false
    }
}



const handleFormSubmisson = (e) => {
    e.preventDefault();

    if(isImageGenerating) return
    isImageGenerating = true;

    const userPromt = e.target[0].value;
    const userImgQuantity = e.target[1].value;

    console.log("target 0: " + userPromt + ", target 1: " + userImgQuantity);

    const imgCardMarkup = Array.from({length: userImgQuantity}, () =>
    `
    <div class="img-card loading">
    <img src="images/loader.svg" alt="image">
    <a href="#" class="download-btn">
        <img src="images/download.svg" alt="download icon"></a>         
</div>
    `
    ).join("")

    imageGallery.innerHTML = imgCardMarkup;
    generateAiImages(userPromt,userImgQuantity)
}
console.log("target 0: " + userPromt + ", target 1: " + userImgQuantity);


{/* <div class="img-card loading">
<img src="images/loader.svg" alt="image">
<a href="#" class="download-btn">
    <img src="images/download.svg" alt="download icon"></a>         
</div>
`
<div class="img-card loading">
<img src="images/loader.svg" alt="image">
<a href="#" class="download-btn">
    <img src="images/download.svg" alt="download icon"></a>         
</div>
`
<div class="img-card loading">
<img src="images/loader.svg" alt="image">
<a href="#" class="download-btn">
    <img src="images/download.svg" alt="download icon"></a>         
</div>
` */}





generateForm.addEventListener("submit", handleFormSubmisson);